import { Icon } from "@/components/ui/icon";
import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import Link from "next/link";

const GOAL_LABELS: Record<string, string> = {
  LOSE_WEIGHT: "Lose weight",
  MAINTAIN_WEIGHT: "Maintain a healthy weight",
  GAIN_WEIGHT: "Gain weight",
  BUILD_MUSCLE: "Build muscle",
};

/**
 * Async server component — streams in independently via Suspense.
 * Shows goal type + weekly consistency dots.
 * Shows a CTA to set goals when none exist.
 */
export async function GoalCard() {
  const user = await requireUser();
  const [goal, weeklyRecords] = await Promise.all([
    dashboardService.getCurrentGoal(user.id),
    dashboardService.getWeeklyNutrition(user.id),
  ]);
  console.log(goal, "Is Goals");
  console.log(weeklyRecords, "weekly Reocrds");
  // Count how many of the last 7 days had any calories logged
  const daysWithData = weeklyRecords.filter((r) => r.totalCalories > 0).length;

  // Build a 7-slot boolean array (oldest → newest) to render the dots
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const byDate = new Set(
    weeklyRecords
      .filter((r) => r.totalCalories > 0)
      .map((r) => r.loggedFor.toISOString().slice(0, 10)),
  );
  console.log(byDate, "By date data");
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (6 - i));
    return byDate.has(d.toISOString().slice(0, 10));
  });
  // No goal set yet — show a prompt
  if (!goal) {
    return (
      <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Your goal</h2>
            <p className="mt-1 text-sm text-slate-400">No goal set yet</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500">
            <Icon name="target" />
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Weekly consistency</span>
            <span className="font-bold text-orange-500">
              {daysWithData} / 7 days
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {dots.map((complete, i) => (
              <span
                key={i}
                className={`h-2 flex-1 rounded-full ${complete ? "bg-orange-500" : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>
        <Link
          href="/goals"
          className="mt-5 flex items-center justify-between text-sm font-semibold text-orange-500"
        >
          Set your nutrition goals{" "}
          <Icon name="arrow" className="h-4 w-4 text-orange-500" />
        </Link>
      </section>
    );
  }
  const profileGoal = user.profile?.goal ?? "MAINTAIN_WEIGHT";
  const goalLabel = GOAL_LABELS[profileGoal] ?? "Reach your goals";

  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Your goal</h2>
          <p className="mt-1 text-sm text-slate-400">{goalLabel}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500">
          <Icon name="target" />
        </span>
      </div>
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Weekly consistency</span>
          <span className="font-bold text-orange-500">
            {daysWithData} / 7 days
          </span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {dots.map((complete, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full ${complete ? "bg-orange-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
      <a
        href="#"
        className="mt-5 flex items-center justify-between text-sm font-semibold text-slate-700"
      >
        Update your goals{" "}
        <Icon name="arrow" className="h-4 w-4 text-orange-500" />
      </a>
    </section>
  );
}
