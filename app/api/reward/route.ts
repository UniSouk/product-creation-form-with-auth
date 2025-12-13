import { handleApiError } from "@/lib/api/error-handler";
import { getAuthUser, requireAuth } from "@/lib/api/middleware";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/response";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { SpinReward, WHEEL } from "@/types/constant";
import { RewardStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { generateCashfreeSignature } from "../../../lib/api/cashfree.client";
import { RewardDto } from "@/types/dto/reward.dto";
import { validateDto } from "@/lib/api/validation";

const spinWheel = (): SpinReward => {
  const TOTAL_WEIGHT = 1000;
  const rand = Math.floor(Math.random() * TOTAL_WEIGHT);
  let sum = 0;

  for (const item of WHEEL) {
    sum += item.weight;
    if (rand < sum) return item.reward;
  }

  return SpinReward.BLNT;
};

const resolveRewardWithLimits = (
  remainingBudget: number,
  userCashRewardCount: number
): number => {
  const limit = env.MAX_REWARD_LIMIT_PER_STORE;
  if (userCashRewardCount >= limit) {
    return 0; // Always 0
  }
  if (remainingBudget <= 0) {
    return 0;
  }
  const spinReward = spinWheel(); // 0 | 5 | 10 | 20
  if (spinReward === 0) {
    return 0;
  }
  if (remainingBudget >= spinReward) {
    return spinReward;
  }
  return remainingBudget;
};

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return unauthorizedResponse();

    const user = await getAuthUser(request);
    if (!user || !user.id) {
      return unauthorizedResponse();
    }

    const xStoreIdHeader = request.headers.get("x-store-id");

    if (!xStoreIdHeader) {
      return errorResponse("Store id is required", 400);
    }

    const storeIdBigInt = BigInt(xStoreIdHeader);

    const { feedbackId } = await request.json();
    const feedbackIdBigInt = BigInt(feedbackId);

    const store = await prisma.store.findUnique({
      where: {
        id: storeIdBigInt,
      },
    });
    if (!store) {
      return errorResponse("Store not found", 404);
    }

    const feedBack = await prisma.productCreationFeedback.findUnique({
      where: {
        id: feedbackIdBigInt,
      },
    });
    if (!feedBack) {
      return errorResponse("FeedBack not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const userCashRewardCount = await tx.reward.count({
        where: {
          storeId: storeIdBigInt,
          amount: { gt: 0 },
        },
      });

      const budgets = await tx.campaignBudget.findMany({});
      if (budgets.length === 0) {
        throw new Error("No campaign budget found");
      }
      const budget = budgets[0];
      const remainingBudget = budget.totalBudget - budget.usedBudget;

      const rewardAmount = resolveRewardWithLimits(
        remainingBudget,
        userCashRewardCount
      );

      const reward = await tx.reward.create({
        data: {
          storeId: storeIdBigInt,
          feedbackId: feedbackIdBigInt,
          amount: rewardAmount,
          status: RewardStatus.PENDING,
        },
      });

      if (rewardAmount > 0) {
        await tx.campaignBudget.update({
          where: { id: budget.id },
          data: {
            usedBudget: {
              increment: rewardAmount,
            },
          },
        });
      }
      return reward;
    });

    return successResponse(
      {
        amount: result.amount,
        label:
          result.amount === 0
            ? "Better luck next time"
            : `You won ₹${result.amount}`,
        id: result.id.toString(),
      },
      "Reward added successfully",
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}

const getCashfreeToken = async () => {
  try {
    const signature = generateCashfreeSignature();
    const url = `${env.CASHFREE_BASE_URL}/payout/v1/authorize`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "X-Cf-Signature": signature,
        "X-Client-Secret": env.CASHFREE_CLIENT_SECRET,
        "X-Client-Id": env.CASHFREE_CLIENT_ID,
      },
    });

    const data = await result.json();
    return data;
  } catch (error) {
    console.log("Cashfree token error", error);
    return null;
  }
};

const getPayOutLink = async (
  token: string,
  cashgramId: string,
  amount: number,
  name: string,
  phone: string,
  linkExpiry: string
) => {
  try {
    const url = `${env.CASHFREE_BASE_URL}/payout/v1/createCashgram`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cashgramId: cashgramId,
        amount: amount,
        name: name,
        phone: phone,
        linkExpiry: linkExpiry,
      }),
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("error generating pay out link", error);
    return null;
  }
};

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return unauthorizedResponse();

    const user = await getAuthUser(request);
    if (!user || !user.id) {
      return unauthorizedResponse();
    }

    const xStoreIdHeader = request.headers.get("x-store-id");
    if (!xStoreIdHeader) {
      return errorResponse("Store id is required", 400);
    }

    const storeIdBigInt = BigInt(xStoreIdHeader);

    const reqBody: RewardDto = await request.json();

    const validationResult = await validateDto(RewardDto, reqBody);
    if (!validationResult.success || !validationResult.data) {
      return errorResponse("Validation failed", 400, validationResult.errors);
    }

    const { name, phone, rewardId } = reqBody;

    const rewardIdBigInt = BigInt(rewardId);
    const reward = await prisma.reward.findUnique({
      where: { id: rewardIdBigInt },
    });

    if (!reward) {
      return errorResponse("Reward not found", 404);
    }
    if (reward.status !== RewardStatus.PENDING) {
      return errorResponse("Reward redeemed", 400);
    }

    const tokenData = await getCashfreeToken();
    if (!tokenData) {
      return errorResponse("internal server error", 500);
    }

    const token = tokenData.data.token;
    const date = new Date();
    date.setDate(date.getDate() + 2);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const result = await getPayOutLink(
      token,
      reward.id.toString(),
      reward.amount,
      name,
      phone,
      `${year}/${month}/${day}`
    );

    await prisma.reward.update({
      where: { id: rewardIdBigInt },
      data: {
        status: RewardStatus.GENERATED,
      },
    });

    return successResponse({ ...result.data }, "Payment link generated", 200);
  } catch (error) {
    return handleApiError(error);
  }
}
