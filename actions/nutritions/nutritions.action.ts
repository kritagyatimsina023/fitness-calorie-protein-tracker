"use server";

import { requireUser } from "@/lib/auth/session";
import { handleError } from "@/lib/errors";
import { nutritionalGoalSchema } from "@/schemas/goal.schema";
import { goalsService } from "@/services/nutritions/nutritions.service";

export type GoalActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
export type DeleteGoalState = {
  success: boolean;
  message?: string;
};

export async function createGoalAction(
  _prevState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  try {
    const user = await requireUser();
    const rawData = {
      effectiveFrom: formData.get("effectiveFrom"),
      calorieTarget: formData.get("calorieTarget"),
      proteinTargetGrams: formData.get("proteinTargetGrams"),
      carbohydrateTargetGrams: formData.get("carbohydrateTargetGrams"),
      fatTargetGrams: formData.get("fatTargetGrams"),
    };
    const parsed = nutritionalGoalSchema.safeParse(rawData);

    if (!parsed.success) {
      console.error(
        "createGoalAction - Validation failed:",
        parsed.error.flatten().fieldErrors,
      );
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }
    await goalsService.createGoal(user.id, parsed.data);
    return {
      success: true,
      message: "Nutrition goal created successfully.",
    };
  } catch (error) {
    const handledError = handleError(error);
    console.error("createGoalAction:", error);
    return {
      success: false,
      message: handledError.message,
    };
  }
}

export async function updateGoalAction(
  _prevState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  try {
    const user = await requireUser();
    const goalId = formData.get("goalId");
    if (!goalId || typeof goalId !== "string") {
      return {
        success: false,
        message: "Goal Id is required",
      };
    }
    const rawData = {
      effectiveFrom: formData.get("effectiveFrom"),
      calorieTarget: formData.get("calorieTarget"),
      proteinTargetGrams: formData.get("proteinTargetGrams"),
      carbohydrateTargetGrams: formData.get("carbohydrateTargetGrams"),
      fatTargetGrams: formData.get("fatTargetGrams"),
    };
    const parsed = nutritionalGoalSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Please fix the highlighted fields.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }
    await goalsService.updateGoal(user.id, goalId, parsed.data);

    return {
      success: true,
      message: "Goals edited",
    };
  } catch (error) {
    const handledError = handleError(error);
    return {
      success: false,
      message: handledError.message,
    };
  }
}
export async function deleteGoalAction(
  _prevState: DeleteGoalState,
  formData: FormData,
): Promise<DeleteGoalState> {
  try {
    const user = await requireUser();
    const goalId = formData.get("goalId");
    if (typeof goalId !== "string" || !goalId) {
      return {
        success: false,
        message: "Goal Id is required",
      };
    }
    await goalsService.deleteGoal(user.id, goalId);
    return {
      success: true,
      message: "Nutrition goal deleted successfully",
    };
  } catch (error) {
    const handledError = handleError(error);
    return {
      success: false,
      message: handledError.message,
    };
  }
}
