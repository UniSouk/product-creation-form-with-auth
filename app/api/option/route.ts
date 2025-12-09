import { getAuthUser, requireAuth } from "@/lib/api/middleware";
import { errorResponse, unauthorizedResponse } from "@/lib/api/response";
import { validateDto } from "@/lib/api/validation";
import { NextRequest, NextResponse } from "next/server";
import { CreateOptionDto } from "@/types/dto/create-option.dto";
import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { handleApiError } from "@/lib/api/error-handler";

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAuth(req);
    if (authError) return unauthorizedResponse();

    const user = await getAuthUser(req);
    if (!user || !user.id) {
      return unauthorizedResponse();
    }

    const storeId = req.headers.get("x-store-id");
    if (!storeId) {
      return errorResponse("Store id is required", 400);
    }

    const reqBody: CreateOptionDto = await req.json();

    const validationResult = await validateDto(CreateOptionDto, reqBody);
    if (!validationResult.success || !validationResult.data) {
      return errorResponse("Validation failed", 400, validationResult.errors);
    }

    const { subCategory, attributeName, gender, brand, value } = reqBody;

    const storeIdBigInt = BigInt(storeId);

    // Normalize inputs
    const genderValue = gender || "N/A";
    const brandValue = brand || "default";
    const optionName =
      attributeName.charAt(0).toUpperCase() + attributeName.slice(1);

    const subCategoryData = await prisma.subCategory.findFirst({
      where: {
        name: subCategory,
        active: true,
        OR: [{ storeId: null }, { storeId: storeIdBigInt }],
      },
      select: { attributes: true, storeId: true },
    });

    if (!subCategoryData) {
      return NextResponse.json(
        { message: "Sub Category not found or inactive" },
        { status: 400 }
      );
    }

    const attributeSet = new Set(subCategoryData.attributes);

    if (!attributeSet.has(attributeName)) {
      return NextResponse.json(
        { message: `No attribute found for ${attributeName}` },
        { status: 400 }
      );
    }

    const existingConnection =
      await prisma.variantOptionOnSubCategory.findFirst({
        where: {
          OR: [{ storeId: null }, { storeId: storeIdBigInt }],
          typeName: subCategory,
          variantOption: {
            OR: [{ storeId: null }, { storeId: storeIdBigInt }],
            brand: brandValue,
            gender: genderValue,
            attributeName: attributeName,
          },
        },
        include: { variantOption: true },
      });

    const alphabet: string =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result: unknown;

    if (existingConnection?.variantOption) {
      // Update existing variant option
      const variantOption = existingConnection.variantOption;

      if (!variantOption.editable) {
        throw new Error("Options value not editable");
      }

      const existingValues = variantOption.values as Array<any>;
      const newValue = { id: customAlphabet(alphabet, 16)(), ...value };

      const updatedValues = [...existingValues, newValue];

      result = await prisma.variantOption.update({
        where: { id: variantOption.id },
        data: { values: updatedValues },
      });
    } else {
      // Create new variant option with connection
      const relationStoreId =
        subCategoryData.storeId === null ? null : subCategoryData.storeId;
      const newValue = { id: customAlphabet(alphabet, 16)(), ...value };
      const newValues = [newValue];

      // Use transaction for atomic operations
      await prisma.$transaction(async (tx) => {
        // Get or create variant option
        let variantOption = await tx.variantOption.findUnique({
          where: {
            name_storeId: {
              name: optionName,
              storeId: storeIdBigInt,
            },
          },
        });

        if (variantOption) {
          variantOption = await tx.variantOption.update({
            where: { id: variantOption.id },
            data: {
              brand: brandValue,
              gender: genderValue,
              values: newValues,
            },
          });
        } else {
          variantOption = await tx.variantOption.create({
            data: {
              storeId: storeIdBigInt,
              name: optionName,
              brand: brandValue,
              gender: genderValue,
              attributeName,
              values: newValues,
              editable: true,
            },
          });
        }

        // Create connection if it doesn't exist
        const existingConnection =
          await tx.variantOptionOnSubCategory.findFirst({
            where: {
              typeName: subCategory,
              variantOptionId: variantOption.id,
              storeId: relationStoreId,
            },
          });

        if (!existingConnection) {
          await tx.variantOptionOnSubCategory.create({
            data: {
              typeName: subCategory,
              variantOptionId: variantOption.id,
              storeId: relationStoreId,
            },
          });
        }

        result = variantOption;
      });

      // Fetch complete result with relations
      result = await prisma.variantOption.findUnique({
        where: { id: (result as any).id },
        include: { subCategory: true },
      });
    }

    return NextResponse.json({
      message: "variant option created successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAuth(req);
    if (authError) return unauthorizedResponse();

    const user = await getAuthUser(req);
    if (!user || !user.id) {
      return unauthorizedResponse();
    }

    const storeId = req.headers.get("x-store-id");
    if (!storeId) {
      return errorResponse("Store id is required", 400);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // findOne logic
      const result = await prisma.variantOption.findUnique({
        where: {
          id: BigInt(id),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "Option not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Option fetched successfully",
        data: result,
        source: "db",
      });
    } else {
      // findAll logic
      const result = await prisma.variantOption.findMany({
        where: {
          OR: [{ storeId: null }, { storeId: BigInt(storeId) }],
        },
      });

      return NextResponse.json({
        message: "Options fetched successfully",
        data: result,
        source: "db",
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
