-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "asset" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "category_attribute" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "category_attribute_enum_value" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "external_product_identifier" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "inventory_transaction" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "logistics_provider" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "payment_gateway_provider" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "price" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "price_update" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "sales_channel_provider" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "store" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "sub_category" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "variant" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "variant_option" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "variant_option_on_sub_category" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- CreateTable
CREATE TABLE "product_creation_feedback" (
    "id" BIGINT NOT NULL DEFAULT public.next_id(),
    "product_id" BIGINT NOT NULL,
    "store_id" BIGINT NOT NULL,
    "overall_experience" INTEGER NOT NULL,
    "form_ease_rating" INTEGER NOT NULL,
    "help_to_complete_form" BOOLEAN NOT NULL,
    "confusing_fields" TEXT[],
    "is_required" BOOLEAN NOT NULL,
    "effort_rating" INTEGER NOT NULL,
    "time_taken" TEXT NOT NULL,
    "any_error" BOOLEAN NOT NULL,
    "error" TEXT,
    "most_time_taken_fields" TEXT[],
    "is_confused" BOOLEAN NOT NULL,
    "confusing_message" TEXT,
    "easy_navigation_rating" INTEGER NOT NULL,
    "found_buttons" BOOLEAN NOT NULL,
    "product_listing_frequency" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_creation_feedback_pkey" PRIMARY KEY ("id")
);
