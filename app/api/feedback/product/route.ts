import { handleApiError } from "@/lib/api/error-handler";
import { getAuthUser, requireAuth } from "@/lib/api/middleware";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/response";
import { validateDto } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";
import { ProductCreationFeedbackDto } from "@/types/dto/product-creation-feedback.dto";
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
    const body: ProductCreationFeedbackDto = await request.json();
    const validationResult = await validateDto(
      ProductCreationFeedbackDto,
      body
    );
    if (!validationResult.success || !validationResult.data) {
      return errorResponse("Validation failed", 400, validationResult.errors);
    }

    const product = await prisma.product.findUnique({
      where: {
        id: BigInt(body.productId),
      },
    });
    if (!product) {
      return errorResponse("product not found ", 404);
    }
    if (product.isReviewed)
      return errorResponse("Product is already reviewed", 400);

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.productCreationFeedback.create({
        data: {
          productId: product.id,
          storeId: storeIdBigInt,
          overallExperience: body.overallExperience,
          formEaseRating: body.formEaseRating,
          helpToCompleteForm: body.helpToCompleteForm,
          confusingFields: body.confusingFields,
          isRequired: body.isRequired,
          effortRating: body.effortRating,
          timeTaken: body.timeTaken,
          anyError: body.anyError,
          error: body.error,
          mostTimeTakenFields: body.mostTimeTakenFields,
          isConfused: body.isConfused,
          confusingMessage: body.confusingMessage,
          easyNavigationRating: body.easyNavigationRating,
          foundButtons: body.foundButtons,
          productListingFrequency: body.productListingFrequency,
          suggestion: body.suggestion,
          recommend: body.recommend,
        },
      });

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          isReviewed: true,
        },
      });

      return review;
    });

    return successResponse(result, "Feedback submitted successfully", 200);
  } catch (error) {
    return handleApiError(error);
  }
}
