"use client";

import { Calendar, X, Flame } from "lucide-react";
import { NutritionGoalDTO } from "@/types/nutrition-goals";
import { DeleteGoals } from "./DeleteGoals";
import { EditGoals } from "./EditGoals";

type Props = {
  open: boolean;
  onClose: () => void;
  goals: NutritionGoalDTO[];
};

export function UpcomingGoalModal({ open, onClose, goals }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Upcoming nutrition goals
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your scheduled nutrition targets
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Goals */}
        <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
          <div className="space-y-3">
            {goals.map((goal) => {
              const effectiveDate = new Date(goal.effectiveFrom);
              const formattedDate = effectiveDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              return (
                <div
                  key={goal.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-500">
                        <Calendar className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formattedDate}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Scheduled goal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <DeleteGoals goalId={goal.id} />
                      <EditGoals goal={goal} />
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-bold text-slate-900">
                        {goal.calorieTarget}
                      </span>
                      <span className="text-[11px] text-slate-400">kcal</span>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Protein
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {goal.proteinTargetGrams}g
                      </p>
                    </div>

                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Carbs
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {goal.carbohydrateTargetGrams}g
                      </p>
                    </div>

                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Fat
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {goal.fatTargetGrams}g
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
