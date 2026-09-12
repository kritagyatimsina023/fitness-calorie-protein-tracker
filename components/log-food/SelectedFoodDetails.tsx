"use client";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import NutritionItem from "./NutritionItem";
import { FoodWithNutrition } from "@/types/foodwithnutrition.type";

type Props = {
  selectedFood: FoodWithNutrition;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

const SelectedFoodDetails = forwardRef<HTMLElement, Props>(
  (
    {
      selectedFood,
      quantity,
      onQuantityChange,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Selected food
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {selectedFood.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedFood.servingSize} {selectedFood.servingUnit} per serving
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 px-3 py-2 text-right">
            <p className="text-xs text-orange-500">Calories</p>

            <p className="text-lg font-bold text-orange-600">{totalCalories}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Quantity
          </label>

          <div className="flex gap-3">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) =>
                onQuantityChange(Math.max(0.1, Number(e.target.value)))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            <div className="flex min-w-32 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700">
              {selectedFood.servingSize} {selectedFood.servingUnit}
            </div>

            <button
              type="button"
              className="flex min-w-32 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700"
            >
              {selectedFood.servingSize} {selectedFood.servingUnit}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-3 gap-3">
          <NutritionItem label="Protein" value={`${totalProtein}g`} />

          <NutritionItem label="Carbs" value={`${totalCarbs}g`} />

          <NutritionItem label="Fat" value={`${totalFat}g`} />
        </div>
      </section>
    );
  },
);

SelectedFoodDetails.displayName = "SelectedFoodDetails";

export default SelectedFoodDetails;
