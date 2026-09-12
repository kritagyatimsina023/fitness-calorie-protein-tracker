import { FoodSource } from "@/generated/prisma/enums";

export type FoodWithNutrition = {
  id: string;
  source: FoodSource;
  externalId: string | null;
  name: string;
  brandName: string | null;
  servingSize: number;
  servingUnit: string;
  nutrition: {
    caloriesPerServing: number;
    proteinGrams: number;
    carbohydrateGrams: number;
    fatGrams: number;
  } | null;
};
export type FoodData = {
  id: string;
  source: string;
  externalId: string | null;
  name: string;
  brandName: string | null;
  servingSize: number;
  servingUnit: string;
  nutrition: {
    caloriesPerServing: number;
    proteinGrams: number;
    carbohydrateGrams: number;
    fatGrams: number;
  } | null;
};
