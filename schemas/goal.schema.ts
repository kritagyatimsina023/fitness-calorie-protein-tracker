import { z } from "zod";

export const nutritionalGoalSchema = z.object({
  effectiveFrom: z.coerce.date(),
  calorieTarget: z.coerce
    .number()
    .int()
    .min(800, "Calories must be at least 800")
    .max(10000, "Calories cannot exceed 10,000"),
  proteinTargetGrams: z.coerce
    .number()
    .min(0, "Protein cannot be negative")
    .max(1000, "Protein target is too high"),
  carbohydrateTargetGrams: z.coerce
    .number()
    .min(0, "Carbohydrates cannot be negative")
    .max(1000, "Carbohydrate target is too high")
    .optional(),

  fatTargetGrams: z.coerce
    .number()
    .min(0, "Fat cannot be negative")
    .max(1000, "Fat target is too high")
    .optional(),
});

export type NutitionaGoalInput = z.infer<typeof nutritionalGoalSchema>;
