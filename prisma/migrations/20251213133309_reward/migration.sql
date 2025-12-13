-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('PENDING', 'GENERATED', 'REDEEMED');

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
ALTER TABLE "product_feedback" ALTER COLUMN "id" SET DEFAULT public.next_id();

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
CREATE TABLE "campaign_budget" (
    "id" BIGINT NOT NULL DEFAULT public.next_id(),
    "totalBudget" INTEGER NOT NULL,
    "usedBudget" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward" (
    "id" BIGINT NOT NULL DEFAULT public.next_id(),
    "store_id" BIGINT NOT NULL,
    "feedback_id" BIGINT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "RewardStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);
