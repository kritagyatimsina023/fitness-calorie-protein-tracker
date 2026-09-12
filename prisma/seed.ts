import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, FoodSource, MealType } from "../generated/prisma/client";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL is required to seed the database.");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const day = (offset = 0) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};
async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);
  const alex = await prisma.user.upsert({
    where: { email: "alex@nourish.app" },
    update: { name: "Alex Morgan", passwordHash },
    create: {
      name: "Alex Morgan",
      email: "alex@nourish.app",
      passwordHash,
      profile: {
        create: { heightCm: 175, weightKg: 72.4, timezone: "Asia/Kathmandu" },
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "sam@nourish.app" },
    update: { name: "Sam Patel", passwordHash },
    create: {
      name: "Sam Patel",
      email: "sam@nourish.app",
      passwordHash,
      profile: {
        create: { heightCm: 168, weightKg: 63.2, timezone: "Asia/Kathmandu" },
      },
    },
  });
  await prisma.nutritionGoal.upsert({
    where: { userId_effectiveFrom: { userId: alex.id, effectiveFrom: day() } },
    update: { calorieTarget: 2100, proteinTargetGrams: 110 },
    create: {
      userId: alex.id,
      effectiveFrom: day(),
      calorieTarget: 2100,
      proteinTargetGrams: 110,
      carbohydrateTargetGrams: 250,
      fatTargetGrams: 70,
    },
  });

  const foodSeed = [
    {
      key: "yogurt",
      name: "Greek Yogurt, plain",
      externalId: "USDA-173418",
      servingSize: 170,
      servingUnit: "g",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.7,
    },
    {
      key: "oats",
      name: "Rolled oats",
      externalId: "USDA-234639",
      servingSize: 40,
      servingUnit: "g",
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
    },
    {
      key: "banana",
      name: "Banana",
      externalId: "USDA-173944",
      servingSize: 118,
      servingUnit: "g",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
    },
    {
      key: "chicken",
      name: "Grilled chicken breast",
      externalId: "USDA-171477",
      servingSize: 100,
      servingUnit: "g",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    {
      key: "rice",
      name: "Brown rice, cooked",
      externalId: "USDA-169704",
      servingSize: 195,
      servingUnit: "g",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
    },
    {
      key: "avocado",
      name: "Avocado",
      externalId: "USDA-171706",
      servingSize: 50,
      servingUnit: "g",
      calories: 80,
      protein: 1,
      carbs: 4,
      fat: 7.4,
    },
  ] as const;
  const foods = await Promise.all(
    foodSeed.map(async (item) => ({
      ...item,
      record: await prisma.food.upsert({
        where: {
          source_externalId: {
            source: FoodSource.USDA_FDC,
            externalId: item.externalId,
          },
        },
        update: {},
        create: {
          source: FoodSource.USDA_FDC,
          externalId: item.externalId,
          name: item.name,
          servingSize: item.servingSize,
          servingUnit: item.servingUnit,
          nutrition: {
            create: {
              caloriesPerServing: item.calories,
              proteinGrams: item.protein,
              carbohydrateGrams: item.carbs,
              fatGrams: item.fat,
            },
          },
        },
      }),
    })),
  );
  const byKey = new Map(foods.map((food) => [food.key, food]));
  const breakfast = await prisma.meal.upsert({
    where: {
      userId_loggedFor_type: {
        userId: alex.id,
        loggedFor: day(),
        type: MealType.BREAKFAST,
      },
    },
    update: {},
    create: { userId: alex.id, loggedFor: day(), type: MealType.BREAKFAST },
  });
  const lunch = await prisma.meal.upsert({
    where: {
      userId_loggedFor_type: {
        userId: alex.id,
        loggedFor: day(),
        type: MealType.LUNCH,
      },
    },
    update: {},
    create: { userId: alex.id, loggedFor: day(), type: MealType.LUNCH },
  });
  const entries = (["yogurt", "oats", "banana"] as const)
    .map((key) => ({ meal: breakfast, food: byKey.get(key)! }))
    .concat(
      (["chicken", "rice", "avocado"] as const).map((key) => ({
        meal: lunch,
        food: byKey.get(key)!,
      })),
    );
  await prisma.foodEntry.deleteMany({
    where: { userId: alex.id, loggedFor: day() },
  });
  await prisma.foodEntry.createMany({
    data: entries.map(({ meal, food }) => ({
      userId: alex.id,
      mealId: meal.id,
      foodId: food.record.id,
      loggedFor: day(),
      quantity: 1,
      servingSizeSnapshot: food.record.servingSize,
      servingUnitSnapshot: food.record.servingUnit,
      foodNameSnapshot: food.record.name,
      sourceSnapshot: food.record.source,
      caloriesSnapshot: food.calories,
      proteinGramsSnapshot: food.protein,
      carbohydrateGramsSnapshot: food.carbs,
      fatGramsSnapshot: food.fat,
    })),
  });
  await prisma.dailyNutrition.upsert({
    where: { userId_loggedFor: { userId: alex.id, loggedFor: day() } },
    update: {
      totalCalories: 816,
      totalProteinGrams: 60.3,
      totalCarbohydrateGrams: 109,
      totalFatGrams: 16.9,
    },
    create: {
      userId: alex.id,
      loggedFor: day(),
      totalCalories: 816,
      totalProteinGrams: 60.3,
      totalCarbohydrateGrams: 109,
      totalFatGrams: 16.9,
    },
  });
  console.log(
    "Seeded Alex Morgan, Sam Patel, six foods, today’s meals, and daily totals.",
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
