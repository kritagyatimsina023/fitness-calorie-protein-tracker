import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import { Beef, Droplets, Flame, Target, Wheat } from "lucide-react";
import { SetGoalButton } from "./SetGoalButton";
import UpComingGoal from "./UpComingGoal";
import { EditGoals } from "./EditGoals";
import { DeleteGoals } from "./DeleteGoals";

const GoalContent = async () => {
  const user = await requireUser();
  const [goal, comingGoals] = await Promise.all([
    dashboardService.getCurrentGoal(user.id),
    dashboardService.getUpcomingGoals(user.id),
  ]);
  if (!goal) {
    return (
      <div className="flex  flex-1 flex-col">
        <div className="flex-1">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-orange-50 text-orange-500">
              <Target className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No nutrition goal yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven&apos;t set a nutrition goal yet. Create one to start
              tracking your daily calorie and macro targets.
            </p>
            <SetGoalButton />
          </div>
        </div>
      </div>
    );
  }
  const currentGoal = {
    id: goal.id,
    effectiveFrom: goal.effectiveFrom.toISOString(),
    calorieTarget: goal.calorieTarget,
    proteinTargetGrams: Number(goal.proteinTargetGrams),
    carbohydrateTargetGrams: Number(goal.carbohydrateTargetGrams ?? 0),
    fatTargetGrams: Number(goal.fatTargetGrams ?? 0),
  };

  const upcomingGoals = comingGoals;
  console.log("Is the current goals", currentGoal);

  const proteinTarget = Number(goal.proteinTargetGrams);
  const carbohydrateTarget = Number(goal.carbohydrateTargetGrams ?? 0);
  const fatTarget = Number(goal.fatTargetGrams ?? 0);

  const goals = [
    {
      label: "Calories",
      value: goal.calorieTarget,
      unit: "kcal",
      icon: Flame,
      description: "Daily calorie target",
    },
    {
      label: "Protein",
      value: proteinTarget,
      unit: "g",
      icon: Beef,
      description: "Daily protein target",
    },
    {
      label: "Carbohydrates",
      value: carbohydrateTarget,
      unit: "g",
      icon: Wheat,
      description: "Daily carbohydrate target",
    },
    {
      label: "Fat",
      value: fatTarget,
      unit: "g",
      icon: Droplets,
      description: "Daily fat target",
    },
  ] as const;
  return (
    <>
      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-500">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">
                Current daily targets
              </h2>
              <p className="text-xs text-slate-400">
                Your active nutrition goal
              </p>
            </div>
          </div>
          <div className="space-x-3">
            <DeleteGoals goalId={currentGoal.id} />
            <EditGoals goal={currentGoal} />
            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
              Active
            </span>
          </div>
        </div>

        {/* Goal cards */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {goals.map((item) => (
            <div
              key={item.label}
              className="p-5 transition hover:bg-slate-50 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {item.label}
                </span>

                <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-500">
                  {<item.icon className="w-4 h-4" />}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </span>

                <span className="text-sm font-medium text-slate-400">
                  {item.unit}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Macro distribution */}

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-900">Macro distribution</h2>
            <p className="mt-1 text-xs text-slate-400">
              Your daily carbohydrate, protein, and fat targets.
            </p>
          </div>
          <div className="space-y-5">
            <MacroRow
              label="Protein"
              value={proteinTarget}
              unit="g"
              percentage={calculateMacroPercentage(
                proteinTarget,
                4,
                carbohydrateTarget,
                4,
                fatTarget,
                9,
              )}
            />
            <MacroRow
              label="Carbohydrates"
              value={carbohydrateTarget}
              unit="g"
              percentage={calculateMacroPercentage(
                carbohydrateTarget,
                4,
                carbohydrateTarget,
                4,
                fatTarget,
                9,
                proteinTarget,
              )}
            />
            <MacroRow
              label="Fat"
              value={fatTarget}
              unit="g"
              percentage={calculateMacroPercentage(
                fatTarget,
                9,
                carbohydrateTarget,
                4,
                fatTarget,
                9,
                proteinTarget,
              )}
            />
          </div>
        </div>
        <UpComingGoal upcomingGoals={upcomingGoals} />
      </section>
    </>
  );
};
function calculateMacroPercentage(
  value: number,
  valueCaloriesPerGram: number,
  carbs: number,
  carbsCaloriesPerGram: number,
  fat: number,
  fatCaloriesPerGram: number,
  protein?: number,
) {
  const proteinCalories = protein ? protein * 4 : 0;
  const totalCalories =
    carbs * carbsCaloriesPerGram + fat * fatCaloriesPerGram + proteinCalories;

  if (!totalCalories) return 0;

  return Math.round(((value * valueCaloriesPerGram) / totalCalories) * 100);
}

function MacroRow({
  label,
  value,
  unit,
  percentage,
}: {
  label: string;
  value: number;
  unit: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-800">{label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {value}
          {unit}
          <span className="ml-1 text-xs font-normal text-slate-400">
            ({percentage}%)
          </span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-orange-400 transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default GoalContent;
