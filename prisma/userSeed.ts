import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const passwordHash = await bcrypt.hash("member123", 10);

  const members = [
    {
      name: "User One",
      email: "user1@example.com",
    },
    {
      name: "User Two",
      email: "user2@example.com",
    },
    {
      name: "User Three",
      email: "user3@example.com",
    },
    {
      name: "User Four",
      email: "user4@example.com",
    },
  ];

  for (const member of members) {
    await prisma.user.upsert({
      where: {
        email: member.email,
      },
      update: {
        name: member.name,
        passwordHash,
      },
      create: {
        name: member.name,
        email: member.email,
        passwordHash,
      },
    });
  }

  console.log("Members seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
