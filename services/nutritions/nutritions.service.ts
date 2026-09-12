import prisma from "@/db/prisma";
import { NutitionaGoalInput } from "./../../schemas/goal.schema";
import { Errors, normalizeError } from "@/lib/errors";

class GoalService {
  async createGoal(userId: string, data: NutitionaGoalInput) {
    try {
      const goal = await prisma.nutritionGoal.create({
        data: {
          userId,
          effectiveFrom: data.effectiveFrom,
          calorieTarget: data.calorieTarget,
          proteinTargetGrams: data.proteinTargetGrams,
          carbohydrateTargetGrams: data.calorieTarget ?? null,
          fatTargetGrams: data.fatTargetGrams ?? null,
        },
      });
      return goal;
    } catch (error) {
      throw normalizeError(error, "GOAL");
    }
  }
  // async updateGoal(userId: string, goalId: string, data: NutitionaGoalInput) {
  //   try {
  //     const editedGoal = await prisma.nutritionGoal.update({
  //       where: {
  //         id: goalId,
  //         userId,
  //       },
  //       data: {
  //         effectiveFrom: data.effectiveFrom,
  //         calorieTarget: data.calorieTarget,
  //         proteinTargetGrams: data.proteinTargetGrams,
  //         carbohydrateTargetGrams: data.carbohydrateTargetGrams ?? null,
  //         fatTargetGrams: data.fatTargetGrams ?? null,
  //       },
  //     });
  //     return editedGoal;
  //   } catch (error) {
  //     throw normalizeError(error, "NUTRITION");
  //   }
  // }
  async updateGoal(
    userId: string,
    goalId: string,
    data: NutitionaGoalInput,
    // data: {
    //   calorieTarget: number;
    //   proteinTargetGrams: number;
    //   carbohydrateTargetGrams?: number;
    //   fatTargetGrams?: number;
    // },
  ) {
    try {
      const goal = await prisma.nutritionGoal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });

      if (!goal) {
        throw new Error("Nutrition goal not found.");
      }

      return prisma.nutritionGoal.update({
        where: {
          id: goal.id,
        },
        data: {
          effectiveFrom: data.effectiveFrom,
          calorieTarget: data.calorieTarget,
          proteinTargetGrams: data.proteinTargetGrams,
          carbohydrateTargetGrams: data.carbohydrateTargetGrams ?? null,
          fatTargetGrams: data.fatTargetGrams ?? null,
        },
      });
    } catch (error) {
      throw normalizeError(error, "GOAL");
    }
  }
  async deleteGoal(userId: string, goalId: string) {
    try {
      const goal = await prisma.nutritionGoal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });
      if (!goal) throw Errors.notFound("Nutrition goal not found", "GOAL");

      return prisma.nutritionGoal.delete({
        where: {
          id: goal.id,
        },
      });
    } catch (error) {
      throw normalizeError(error, "GOAL");
    }
  }
}
export const goalsService = new GoalService();
