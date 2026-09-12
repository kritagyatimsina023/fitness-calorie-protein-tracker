import { NutritionGoal } from "@/generated/prisma/client";
import { Calendar, ChevronRight, Flame } from "lucide-react";
import { UpcomingGoalTrigger } from "./UpcomingGoalTrigger";
import { NutritionGoalDTO } from "@/types/nutrition-goals";

type Props = {
  upcomingGoals: NutritionGoal[];
};

const UpcomingGoal = ({ upcomingGoals }: Props) => {
  if (upcomingGoals.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Upcoming</h2>
            <p className="mt-1 text-xs text-slate-400">
              Your next nutrition goal
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-400">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            No upcoming goals
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your current nutrition goal will remain active until you schedule
            another one.
          </p>
        </div>
      </section>
    );
  }

  const nextGoal = upcomingGoals[0];
  const today = new Date();
  const effectiveDate = new Date(nextGoal.effectiveFrom);
  const diffTime = effectiveDate.getTime() - today.getTime();
  const daysUntil = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const formattedDate = effectiveDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const upcomingGoalDTOs: NutritionGoalDTO[] = upcomingGoals.map((goal) => ({
    id: goal.id,
    effectiveFrom: goal.effectiveFrom.toISOString(),
    calorieTarget: goal.calorieTarget,
    proteinTargetGrams: Number(goal.proteinTargetGrams),
    carbohydrateTargetGrams: Number(goal.carbohydrateTargetGrams ?? 0),
    fatTargetGrams: Number(goal.fatTargetGrams ?? 0),
  }));
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Upcoming</h2>

          <p className="mt-1 text-xs text-slate-400">
            Your next nutrition goal
          </p>
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <UpcomingGoalTrigger goals={upcomingGoalDTOs} />
          </div>
        </div>
      </div>

      {/* Next goal */}
      <div className="mt-5 overflow-hidden rounded-xl border border-orange-100 bg-orange-50/50">
        <div className="flex items-center justify-between border-b border-orange-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-orange-500 shadow-sm">
              <Calendar className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-900">
                {formattedDate}
              </p>

              <p className="text-[11px] text-orange-600">
                In {daysUntil} {daysUntil === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
            Next
          </span>
        </div>

        {/* Calories */}
        <div className="px-4 py-4">
          <div className="flex items-baseline gap-2">
            <Flame className="h-4 w-4 text-orange-500" />

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {nextGoal.calorieTarget}
            </span>

            <span className="text-xs font-medium text-slate-400">
              kcal / day
            </span>
          </div>

          {/* Macros */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Protein
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {Number(nextGoal.proteinTargetGrams)}g
              </p>
            </div>

            <div className="rounded-lg bg-white px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Carbs
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {Number(nextGoal.carbohydrateTargetGrams ?? 0)}g
              </p>
            </div>

            <div className="rounded-lg bg-white px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Fat
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {Number(nextGoal.fatTargetGrams ?? 0)}g
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional goals indicator */}
      {upcomingGoals.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            +{upcomingGoals.length - 1} more scheduled{" "}
            {upcomingGoals.length - 1 === 1 ? "goal" : "goals"}
          </p>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </div>
      )}
    </section>
  );
};

export default UpcomingGoal;
