"use client";

import { Loader2, Plus } from "lucide-react";
import type { RefObject } from "react";

import SummaryMacro from "./SummaryMarco";
import { FoodWithNutrition } from "@/types/foodwithnutrition.type";

type Props = {
  selectedMeal: string;
  selectedFood: FoodWithNutrition | null;

  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  quantity: number;
  mealType: string;

  isPending: boolean;

  formRef: RefObject<HTMLFormElement | null>;
  formAction: (formData: FormData) => void;
};

const FoodSummary = ({
  selectedMeal,
  selectedFood,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  quantity,
  mealType,
  isPending,
  formRef,
  formAction,
}: Props) => {
  return (
    <aside className="lg:sticky lg:top-6 lg:h-fit lg:self-start">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Adding to
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {selectedMeal}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Today</p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500">Calories</span>

              <span className="text-2xl font-bold text-slate-900">
                {totalCalories}

                <span className="ml-1 text-sm font-normal text-slate-400">
                  kcal
                </span>
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-orange-400 transition-all"
                style={{
                  width: `${Math.min((totalCalories / 2500) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SummaryMacro label="Protein" value={`${totalProtein}g`} />

            <SummaryMacro label="Carbs" value={`${totalCarbs}g`} />

            <SummaryMacro label="Fat" value={`${totalFat}g`} />
          </div>

          <form ref={formRef} action={formAction}>
            <input type="hidden" name="foodId" value={selectedFood?.id ?? ""} />
            <input type="hidden" name="mealType" value={mealType} />
            <input type="hidden" name="quantity" value={quantity} />
            <button
              type="submit"
              disabled={!selectedFood || isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to {selectedMeal}
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </aside>
  );
};

export default FoodSummary;
