import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Async server component — streams in independently via Suspense.
 * Renders the weekly calorie bar chart from real DailyNutrition records.
 */
export async function WeeklyProgress() {
  const user = await requireUser();
  const records = await dashboardService.getWeeklyNutrition(user.id);

  // Build a map of ISO date string → total calories
  const byDate = new Map(
    records.map((r) => [
      r.loggedFor.toISOString().slice(0, 10),
      r.totalCalories,
    ]),
  );

  // Generate the last 7 days (oldest first) as display slots
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const slots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);

    return {
      day: SHORT_DAYS[d.getUTCDay()],
      calories: byDate.get(key) ?? 0,
      isToday: i === 6,
    };
  });

  // Find the max to normalise bar heights (min 1 to avoid divide-by-zero)
  const max = Math.max(1, ...slots.map((s) => s.calories));

  const totalWithData = slots.filter((s) => s.calories > 0);
  const avg =
    totalWithData.length > 0
      ? Math.round(
          totalWithData.reduce((sum, s) => sum + s.calories, 0) /
            totalWithData.length,
        )
      : 0;

  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold">Weekly progress</h2>
          <p className="mt-1 text-sm text-slate-400">Calories consumed</p>
        </div>
        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500">
          This week
        </button>
      </div>
      <div className="flex h-44 items-end justify-between gap-2 border-b border-slate-100 pb-0">
        {slots.map((slot, i) => {
          const heightPct =
            slot.calories > 0
              ? Math.max(4, Math.round((slot.calories / max) * 100))
              : 4;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              title={
                slot.calories > 0
                  ? `${slot.calories.toLocaleString()} kcal`
                  : "No data"
              }
            >
              <span
                className={`w-full max-w-7 rounded-t-md transition-all ${
                  slot.isToday
                    ? "bg-orange-500 shadow-[0_0_14px_rgba(249,115,54,.38)]"
                    : slot.calories > 0
                      ? "bg-orange-200"
                      : "bg-slate-100"
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span
                className={`pb-2 text-[11px] ${
                  slot.isToday ? "font-bold text-orange-500" : "text-slate-400"
                }`}
              >
                {slot.day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-sm">
        <span className="text-slate-500">Daily average</span>
        <span className="font-bold text-orange-600">
          {avg > 0 ? `${avg.toLocaleString()} kcal` : "No data yet"}
        </span>
      </div>
    </section>
  );
}
