import prisma from "@/db/prisma";
import { Errors, normalizeError } from "@/lib/errors";
import type { FoodLogInput } from "@/schemas/food-log.schema";

class FoodService {
  async getAvailableFood() {
    try {
      const food = await prisma.food.findMany({
        include: {
          nutrition: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return food.map((item) => ({
        id: item.id,
        source: item.source,
        externalId: item.externalId,
        name: item.name,
        brandName: item.brandName,
        servingSize: Number(item.servingSize),
        servingUnit: item.servingUnit,
        nutrition: item.nutrition
          ? {
              caloriesPerServing: item.nutrition.caloriesPerServing,
              proteinGrams: Number(item.nutrition.proteinGrams),
              carbohydrateGrams: Number(item.nutrition.carbohydrateGrams ?? 0),
              fatGrams: Number(item.nutrition.fatGrams ?? 0),
            }
          : null,
      }));
    } catch (error) {
      throw normalizeError(error, "FOOD");
    }
  }

  async logFood(userId: string, data: FoodLogInput, userTimezone: string) {
    try {
      const food = await prisma.food.findUnique({
        where: { id: data.foodId },
        include: { nutrition: true },
      });

      if (!food) {
        throw Errors.notFound("Food not found.", "FOOD_ENTRY");
      }

      if (!food.nutrition) {
        throw Errors.badRequest(
          "Food has no nutrition information.",
          "FOOD_ENTRY",
        );
      }

      const { nutrition } = food;
      const quantity = data.quantity;

      const localDateStr = new Date().toLocaleDateString("en-CA", {
        timeZone: userTimezone,
      });
      const loggedFor = new Date(localDateStr);

      const caloriesSnapshot = Math.round(
        nutrition.caloriesPerServing * quantity,
      );
      const proteinGramsSnapshot = Number(nutrition.proteinGrams) * quantity;
      const carbohydrateGramsSnapshot =
        nutrition.carbohydrateGrams !== null
          ? Number(nutrition.carbohydrateGrams) * quantity
          : null;
      const fatGramsSnapshot =
        nutrition.fatGrams !== null
          ? Number(nutrition.fatGrams) * quantity
          : null;

      return await prisma.$transaction(async (tx) => {
        const meal = await tx.meal.upsert({
          where: {
            userId_loggedFor_type: {
              userId,
              loggedFor,
              type: data.mealType,
            },
          },
          create: {
            userId,
            loggedFor,
            type: data.mealType,
          },
          update: {},
        });

        const foodEntry = await tx.foodEntry.create({
          data: {
            userId,
            mealId: meal.id,
            foodId: food.id,
            loggedFor,
            quantity,
            servingSizeSnapshot: food.servingSize,
            servingUnitSnapshot: food.servingUnit,
            foodNameSnapshot: food.name,
            brandNameSnapshot: food.brandName,
            sourceSnapshot: food.source,
            caloriesSnapshot,
            proteinGramsSnapshot: proteinGramsSnapshot.toFixed(2),
            carbohydrateGramsSnapshot:
              carbohydrateGramsSnapshot !== null
                ? carbohydrateGramsSnapshot.toFixed(2)
                : null,
            fatGramsSnapshot:
              fatGramsSnapshot !== null ? fatGramsSnapshot.toFixed(2) : null,
          },
        });

        await tx.dailyNutrition.upsert({
          where: {
            userId_loggedFor: { userId, loggedFor },
          },
          create: {
            userId,
            loggedFor,
            totalCalories: caloriesSnapshot,
            totalProteinGrams: proteinGramsSnapshot.toFixed(2),
            totalCarbohydrateGrams: (carbohydrateGramsSnapshot ?? 0).toFixed(2),
            totalFatGrams: (fatGramsSnapshot ?? 0).toFixed(2),
          },
          update: {
            totalCalories: { increment: caloriesSnapshot },
            totalProteinGrams: {
              increment: parseFloat(proteinGramsSnapshot.toFixed(2)),
            },
            totalCarbohydrateGrams: {
              increment: parseFloat(
                (carbohydrateGramsSnapshot ?? 0).toFixed(2),
              ),
            },
            totalFatGrams: {
              increment: parseFloat((fatGramsSnapshot ?? 0).toFixed(2)),
            },
          },
        });

        return foodEntry;
      });
    } catch (error) {
      throw normalizeError(error, "FOOD_ENTRY");
    }
  }
}
export const foodService = new FoodService();
