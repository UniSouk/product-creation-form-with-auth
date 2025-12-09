import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/error-handler";
import bcrypt from "bcryptjs";
import type { RegisterRequest } from "@/types/api";
import { ChannelType } from "@prisma/client";
import { signAccessToken, signRefreshToken } from "@/lib/auth-tokens";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user

    const res = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          ...(name && { name }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const channels = [
        ChannelType.AMAZON_IN,
        ChannelType.DEFAULT,
        ChannelType.ONDC,
        ChannelType.SHOPIFY,
        ChannelType.WIX,
        ChannelType.WOOCOMMERCE,
      ];
      const store = await tx.store.create({
        data: {
          userId: user.id,
          enabledChannels: channels,
        },
      });

      const accessToken = signAccessToken(String(user.id), user.email);
      const refreshToken = signRefreshToken(String(user.id), user.email);

      // Store refresh token
      const decodedRefresh = JSON.parse(
        Buffer.from(refreshToken.split(".")[1], "base64").toString("utf8")
      ) as { exp: number };

      await tx.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(decodedRefresh.exp * 1000),
        },
      });

      return { accessToken, refreshToken, user, storeId: store.id };
    });

    return successResponse(res, "User registered successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
