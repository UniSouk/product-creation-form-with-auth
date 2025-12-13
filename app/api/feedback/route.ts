import { handleApiError } from "@/lib/api/error-handler";
import { getAuthUser, requireAuth } from "@/lib/api/middleware";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/response";
import { validateDto } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";
import { ProductFeedbackDto } from "@/types/dto/product-feedback.dto";
import { NextRequest } from "next/server";

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
    const body: ProductFeedbackDto = await request.json();
    const validationResult = await validateDto(ProductFeedbackDto, body);
    if (!validationResult.success || !validationResult.data) {
      return errorResponse("Validation failed", 400, validationResult.errors);
    }

    const feedback = await prisma.productFeedback.create({
      data: {
        storeId: storeIdBigInt,
        gotStuck: body.gotStuck,
        stuckReason: body.stuckReason,
        prevented: body.prevented,
        preventedReason: body.preventedReason,
        anyError: body.anyError,
        errorDescription: body.errorDescription,
        difficulty: body.difficulty,
        stoppedStep: body.stoppedStep,
        neededHelp: body.neededHelp,
        neededHelpReason: body.neededHelpReason,
        suggestion: body.suggestion,
        device: body.device,
      },
    });

    return successResponse(feedback, "Feedback submitted successfully", 200);
  } catch (error) {
    return handleApiError(error);
  }
}
