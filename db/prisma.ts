// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@/generated/prisma/client";

// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// export function getPrisma() {
//   if (globalForPrisma.prisma) return globalForPrisma.prisma;

//   const connectionString = process.env.DATABASE_URL;
//   if (!connectionString) {
//     throw new Error("DATABASE_URL is not configured.");
//   }

//   const prisma = new PrismaClient({
//     adapter: new PrismaPg({ connectionString }),
//   });

//   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
//   return prisma;
// }
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
};

const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
};

const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
