/*
  Warnings:

  - The `got_stuck` column on the `product_feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `needed_help` column on the `product_feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "asset" ALTER COLUMN "id" SET DEFAULT public.next_id();

-- AlterTable
ALTER TABLE "campaign_budget" ALTER COLUMN "id" SET DEFAULT public.next_id();

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
ALTER TABLE "product_feedback" ALTER COLUMN "id" SET DEFAULT public.next_id(),
DROP COLUMN "got_stuck",
ADD COLUMN     "got_stuck" TEXT[],
DROP COLUMN "needed_help",
ADD COLUMN     "needed_help" TEXT[];

-- AlterTable
ALTER TABLE "reward" ALTER COLUMN "id" SET DEFAULT public.next_id();

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
