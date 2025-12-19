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
  const campaignBudget = await prisma.campaignBudget.create({
    data: {
      totalBudget: 0,
      usedBudget: 0,
    },
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
