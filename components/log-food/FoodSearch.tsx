"use client";

import { FoodWithNutrition } from "@/types/foodwithnutrition.type";
import { Check, Plus, Search } from "lucide-react";
import Link from "next/link";

// import type { FoodData } from "./types";

type Props = {
  foodData: FoodWithNutrition[];
  search: string;
  selectedFood: FoodWithNutrition | null;
  onSearchChange: (value: string) => void;
  onSelectFood: (food: FoodWithNutrition) => void;
};

const FoodSearch = ({
  foodData,
  search,
  selectedFood,
  onSearchChange,
  onSelectFood,
}: Props) => {
  const query = search.toLowerCase().trim();

  const filteredFoods = foodData.filter((food) => {
    if (!query) return true;

    return (
      food.name.toLowerCase().includes(query) ||
      food.brandName?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">Find a food</h2>

        <p className="mt-1 text-sm text-slate-500">
          Search your food library to add something to your meal.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search food, brand, or ingredient..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        />
      </div>

      {/* Results */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {search ? "Search results" : "Recent foods"}
          </p>

          <Link
            href="/dashboard/library"
            className="text-xs font-semibold text-orange-500 hover:text-orange-600"
          >
            Browse library
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFoods.map((food) => {
            const active = selectedFood?.id === food.id;

            return (
              <button
                key={food.id}
                type="button"
                onClick={() => onSelectFood(food)}
                className={`flex w-full items-center gap-4 rounded-xl px-3 py-4 text-left transition ${
                  active ? "bg-orange-50" : "hover:bg-slate-50"
                }`}
              >
                {/* Food icon */}
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-500">
                  <span className="text-lg">🍽️</span>
                </div>

                {/* Food information */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {food.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {food.servingSize} {food.servingUnit}
                    {food.nutrition && (
                      <>
                        {" · "}
                        {food.nutrition.caloriesPerServing} kcal
                      </>
                    )}
                  </p>

                  {food.brandName && (
                    <p className="mt-1 text-xs text-slate-400">
                      {food.brandName}
                    </p>
                  )}
                </div>

                {/* Selected indicator */}
                {active ? (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <Plus className="h-5 w-5 text-slate-400" />
                )}
              </button>
            );
          })}

          {/* Empty state */}
          {filteredFoods.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                No foods found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try another food or browse your food library.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FoodSearch;
