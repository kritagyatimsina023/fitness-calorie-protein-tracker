import { z } from "zod";
import { MealType } from "@/generated/prisma/enums";

export const foodLogSchema = z.object({
  foodId: z.string().min(1, "Food is required."),
  mealType: z.nativeEnum(MealType, {
    message: "Invalid meal type.",
  }),
  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than zero.")
    .max(999, "Quantity is too large."),
});

export type FoodLogInput = z.infer<typeof foodLogSchema>;
