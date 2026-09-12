import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import Link from "next/link";

/**
 * Async server component — streams in independently via Suspense.
 * Displays today's calorie intake vs goal with a conic-gradient ring.
 * Shows a "Set your goals" prompt when the user has no goal configured.
 */
export async function CalorieCard() {
  const user = await requireUser();
  const [daily, goal] = await Promise.all([
    dashboardService.getDailyNutrition(user.id),
    dashboardService.getCurrentGoal(user.id),
  ]);
  console.log("daily", daily);
  console.log("goals", goal);

  const consumed = daily?.totalCalories ?? 0;

  // No goal set yet — show a prompt
  if (!goal) {
    return (
      <section className="relative overflow-hidden rounded-2xl bg-[#1b2534] p-6 text-white sm:p-7">
        <div className="absolute -right-16 -top-24 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-300">
              Today&apos;s calorie intake
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <strong className="text-4xl tracking-tight">
                {consumed.toLocaleString()}
              </strong>
              <span className="text-sm text-slate-400">kcal logged</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              No calorie goal set yet.
            </p>
          </div>
          <Link
            href="/goals"
            className="shrink-0 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
          >
            Set your goal →
          </Link>
        </div>
      </section>
    );
  }

  const target = goal.calorieTarget;
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  const deg = Math.round((pct / 100) * 360);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1b2534] p-6 text-white sm:p-7">
      <div className="absolute -right-16 -top-24 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-300">Today&apos;s calorie intake</p>
          <div className="mt-2 flex items-baseline gap-2">
            <strong className="text-4xl tracking-tight">
              {consumed.toLocaleString()}
            </strong>
            <span className="text-sm text-slate-400">
              / {target.toLocaleString()} kcal
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            <span className="font-semibold text-orange-400">
              {remaining.toLocaleString()} kcal
            </span>{" "}
            remaining for today
          </p>
        </div>
        <div
          className="relative mx-auto grid h-36 w-36 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#fb7336 0deg ${deg}deg, rgba(255,255,255,.13) ${deg}deg 360deg)`,
          }}
        >
          <div className="grid h-[110px] w-[110px] place-items-center rounded-full bg-[#1b2534] text-center">
            <strong className="text-2xl">{pct}%</strong>
            <span className="-mt-1 text-xs text-slate-400">of your goal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
