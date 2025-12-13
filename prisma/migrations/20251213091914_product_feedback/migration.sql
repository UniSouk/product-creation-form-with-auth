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
ALTER TABLE "product" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "product_creation_feedback" ALTER COLUMN "id" SET DEFAULT public.next_id();

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
CREATE TABLE "product_feedback" (
    "id" BIGINT NOT NULL DEFAULT public.next_id(),
    "store_id" BIGINT NOT NULL,
    "got_stuck" TEXT NOT NULL,
    "stuck_reason" TEXT,
    "prevented" TEXT NOT NULL,
    "prevented_reason" TEXT,
    "any_error" BOOLEAN NOT NULL,
    "error_description" TEXT,
    "difficulty" INTEGER NOT NULL,
    "stopped_step" TEXT NOT NULL,
    "needed_help" TEXT NOT NULL,
    "needed_help_reason" TEXT,
    "suggestion" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_feedback_pkey" PRIMARY KEY ("id")
);
