import { seedOptions } from "@/lib/api/misc";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";

// const prisma = new PrismaClient();
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a shared Postgres pool and Prisma adapter
const pool = new Pool({
  connectionString: "",
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

async function main() {
  await prisma.$transaction(async (tx) => {
    const data = await seedOptions(tx);

    await tx.variantOption.createMany({
      data: data.variantOption,
    });

    await tx.variantOptionOnSubCategory.createMany({
      data: data.relationData,
    });
  });
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// to run this file
// npx ts-node -r tsconfig-paths/register prisma/seed-options.ts
