"use client";

import {
  createGoalAction,
  GoalActionState,
  updateGoalAction,
} from "@/actions/nutritions/nutritions.action";
import { NutritionGoalDTO } from "@/types/nutrition-goals";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface GoalSetProps {
  open: boolean;
  goal?: NutritionGoalDTO;
  mode?: "create" | "edit";
  onClose: () => void;
}
const initialState: GoalActionState = {
  success: false,
  message: "",
  errors: {},
};

export function GoalSet({
  open,
  onClose,
  goal,
  mode = "create",
}: GoalSetProps) {
  const router = useRouter();
  const action = mode === "edit" ? updateGoalAction : createGoalAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handledMessage = useRef<string | null>(null);

  useEffect(() => {
    if (!state.message && !Object.keys(state.errors ?? {}).length) {
      return;
    }
    const messageKey = `${state.success}-${state.message}`;
    if (handledMessage.current === messageKey) {
      return;
    }
    handledMessage.current = messageKey;
    if (state.success) {
      toast.success(state.message ?? "Goal saved successfully.");

      onClose();
      router.refresh();

      return;
    }
    if (state.errors) {
      const errors = Object.values(state.errors).flat();

      errors.forEach((error, index) => {
        setTimeout(() => {
          toast.error(error);
        }, index * 1000);
      });

      return;
    }

    if (state.message) {
      toast.error(state.message);
    }
  }, [state, router, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === "edit" ? "Edit current goal" : "Set nutrition goal"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "edit"
                ? "Update your current calorie and macro targets."
                : "Set your daily calorie and macro targets."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Form */}
        <form action={formAction} className="space-y-5 p-6">
          {mode === "edit" && goal && (
            <input type="hidden" name="goalId" value={goal.id} />
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {mode === "edit" ? "Active from" : "Effective from"}
            </label>
            <input
              type="date"
              name="effectiveFrom"
              defaultValue={
                mode === "edit" ? goal?.effectiveFrom.slice(0, 10) : undefined
              }
              // disabled={mode === "edit"}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Daily calories
            </label>
            <div className="relative">
              <input
                type="number"
                name="calorieTarget"
                min="800"
                max="10000"
                placeholder="2100"
                defaultValue={mode === "edit" ? goal?.calorieTarget : undefined}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                kcal
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Protein
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="proteinTargetGrams"
                  min="0"
                  step="0.01"
                  placeholder="110"
                  defaultValue={
                    mode === "edit" ? goal?.proteinTargetGrams : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-8 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  g
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Carbs
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="carbohydrateTargetGrams"
                  min="0"
                  step="0.01"
                  placeholder="250"
                  defaultValue={
                    mode === "edit" ? goal?.carbohydrateTargetGrams : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-8 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  g
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Fat
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="fatTargetGrams"
                  min="0"
                  step="0.01"
                  placeholder="70"
                  defaultValue={
                    mode === "edit" ? goal?.fatTargetGrams : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-8 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  g
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : mode === "edit" ? (
                "Update Goal"
              ) : (
                "Save Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
