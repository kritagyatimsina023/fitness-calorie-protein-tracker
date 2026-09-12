"use server";

import { requireUser } from "@/lib/auth/session";
import { handleError } from "@/lib/errors";
import { foodLogSchema } from "@/schemas/food-log.schema";
import { foodService } from "@/services/log-food/food.service";

export type FoodLogActionState = {
  success: boolean;
  message?: string;
};

export async function addFoodLogAction(
  _prevState: FoodLogActionState,
  formData: FormData,
): Promise<FoodLogActionState> {
  try {
    const user = await requireUser();
    const rawData = {
      foodId: formData.get("foodId"),
      mealType: formData.get("mealType"),
      quantity: formData.get("quantity"),
    };
    const parsed = foodLogSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid food log input.",
      };
    }
    const timezone = user.profile?.timezone ?? "UTC";
    await foodService.logFood(user.id, parsed.data, timezone);
    return {
      success: true,
      message: "Food logged successfully.",
    };
  } catch (error) {
    const handledError = handleError(error);
    console.error("addFoodLogAction:", error);
    return {
      success: false,
      message: handledError.message,
    };
  }
}
