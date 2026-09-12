import { Icon } from "@/components/ui/icon";
import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import Link from "next/link";

/**
 * Async server component — streams in independently via Suspense.
 * Shows protein / carbs / fats consumed vs goal as progress bars.
 * Falls back to consumed-only display when no goal is set.
 */
export async function MacroOverview() {
  const user = await requireUser();
  const [daily, goal] = await Promise.all([
    dashboardService.getDailyNutrition(user.id),
    dashboardService.getCurrentGoal(user.id),
  ]);

  const protein = Number(daily?.totalProteinGrams ?? 0);
  const carbs = Number(daily?.totalCarbohydrateGrams ?? 0);
  const fat = Number(daily?.totalFatGrams ?? 0);

  // When no goal exists: show raw consumed values without a progress bar target
  if (!goal) {
    const items = [
      { label: "Protein", value: `${protein.toFixed(1)}g`, color: "bg-orange-500" },
      { label: "Carbs",   value: `${carbs.toFixed(0)}g`,   color: "bg-[#6d8bec]" },
      { label: "Fats",    value: `${fat.toFixed(1)}g`,      color: "bg-[#e5ad4b]" },
    ];
    return (
      <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Daily overview</h2>
            <p className="mt-1 text-sm text-slate-400">Your macros for today</p>
          </div>
          <Link
            href="/goals"
            className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-500 hover:bg-orange-50"
          >
            Set goals
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-3 flex justify-between text-sm">
                <span className="font-semibold">{item.label}</span>
                <strong className="font-semibold text-slate-700">{item.value}</strong>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full w-full rounded-full opacity-30 ${item.color}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const proteinGoal = Number(goal.proteinTargetGrams);
  const carbsGoal = Number(goal.carbohydrateTargetGrams ?? 250);
  const fatGoal = Number(goal.fatTargetGrams ?? 70);

  const macros = [
    {
      label: "Protein",
      value: `${protein.toFixed(1)}g`,
      goal: `${proteinGoal}g`,
      pct: Math.min(100, Math.round((protein / proteinGoal) * 100)),
      color: "bg-orange-500",
    },
    {
      label: "Carbs",
      value: `${carbs.toFixed(0)}g`,
      goal: `${carbsGoal}g`,
      pct: Math.min(100, Math.round((carbs / carbsGoal) * 100)),
      color: "bg-[#6d8bec]",
    },
    {
      label: "Fats",
      value: `${fat.toFixed(1)}g`,
      goal: `${fatGoal}g`,
      pct: Math.min(100, Math.round((fat / fatGoal) * 100)),
      color: "bg-[#e5ad4b]",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Daily overview</h2>
          <p className="mt-1 text-sm text-slate-400">Your macros for today</p>
        </div>
        <button
          aria-label="More options"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
        >
          <Icon name="more" />
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {macros.map((macro) => (
          <div key={macro.label}>
            <div className="mb-3 flex justify-between text-sm">
              <span className="font-semibold">{macro.label}</span>
              <span className="text-slate-400">
                <strong className="font-semibold text-slate-700">
                  {macro.value}
                </strong>{" "}
                / {macro.goal}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${macro.color}`}
                style={{ width: `${macro.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
