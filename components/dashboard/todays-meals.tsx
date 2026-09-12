import { requireUser } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import { MealType } from "@/generated/prisma/client";

const MEAL_META: Record<MealType, { icon: string; color: string }> = {
  BREAKFAST: { icon: "◒", color: "bg-amber-100 text-amber-600" },
  LUNCH: { icon: "⌁", color: "bg-orange-100 text-orange-600" },
  DINNER: { icon: "◔", color: "bg-violet-100 text-violet-600" },
  SNACK: { icon: "◇", color: "bg-green-100 text-green-600" },
};

const MEAL_LABEL: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Async server component — streams in independently via Suspense.
 * Displays today's logged meals with real food entries from the database.
 */
export async function TodaysMeals() {
  const user = await requireUser();
  const meals = await dashboardService.getTodaysMeals(user.id);

  // Ensure all 3 main meal types are represented
  const mealTypes: MealType[] = [
    MealType.BREAKFAST,
    MealType.LUNCH,
    MealType.DINNER,
  ];
  const mealByType = new Map(meals.map((m) => [m.type, m]));

  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Today&apos;s meals</h2>
          <p className="mt-1 text-sm text-slate-400">
            Keep logging to stay on track
          </p>
        </div>
        <a href="#" className="text-sm font-semibold text-orange-500">
          View diary
        </a>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {mealTypes.map((type) => {
          const meal = mealByType.get(type);
          const meta = MEAL_META[type];
          const label = MEAL_LABEL[type];
          const totalCals = meal
            ? meal.entries.reduce(
                (sum, e) => sum + e.caloriesSnapshot * Number(e.quantity),
                0,
              )
            : 0;

          const hasEntries = meal && meal.entries.length > 0;
          return (
            <div
              key={type}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${meta.color}`}
              >
                {meta.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-slate-400">
                  {hasEntries
                    ? formatTime(
                        meal.entries[meal.entries.length - 1].createdAt,
                      )
                    : "Not logged yet"}
                </span>
              </span>
              <span className="ml-auto whitespace-nowrap text-xs font-semibold text-slate-500">
                {hasEntries ? `${Math.round(totalCals)} kcal` : "Add meal"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
