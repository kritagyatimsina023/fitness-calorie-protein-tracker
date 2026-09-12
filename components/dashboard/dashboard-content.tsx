import { Suspense } from "react";
import { Icon } from "@/components/ui/icon";
import { logoutAction } from "@/actions/auth/logout.action";
import { requireUser } from "@/lib/auth/session";

import { CalorieCard } from "@/components/dashboard/calorie-card";
import { MacroOverview } from "@/components/dashboard/macro-overview";
import { TodaysMeals } from "@/components/dashboard/todays-meals";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { GoalCard } from "@/components/dashboard/goal-card";

import {
  CalorieCardSkeleton,
  MacroOverviewSkeleton,
  TodaysMealsSkeleton,
  WeeklyProgressSkeleton,
  GoalCardSkeleton,
} from "@/components/dashboard/skeletons";
import Link from "next/link";

function DashboardGreeting({ name }: { name: string }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";

  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-sm font-medium text-orange-500 uppercase tracking-wide">
          {dateLabel}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {greeting}, {name.split(" ")[0]}{" "}
          <span aria-hidden="true">{emoji}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Here&apos;s a snapshot of your nutrition today.
        </p>
      </div>
      <Link href={"/dashboard/log-food"}>
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/15">
          <Icon name="plus" className="h-4 w-4" />
          Log food
        </button>
      </Link>
    </div>
  );
}

function StreakBanner() {
  return (
    <section className="flex items-center gap-4 rounded-2xl bg-[#fff4ee] p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-500">
        <Icon name="flame" />
      </span>
      <p className="text-sm leading-5 text-slate-600">
        <strong className="block text-slate-900">
          You&apos;re doing great!
        </strong>
        Keep logging to build your healthy eating streak.
      </p>
    </section>
  );
}

export async function DashboardContent() {
  const user = await requireUser();
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-[76px] items-center justify-between border-b pb-3 border-slate-100 ">
        <a className="flex items-center gap-2 lg:hidden" href="#">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 font-black text-white">
            N
          </span>
          <span className="font-bold">
            Nourish<span className="text-orange-500">.</span>
          </span>
        </a>
        <div className="hidden max-w-[330px] flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-slate-400 md:flex">
          <Icon name="search" className="h-[18px] w-[18px]" />
          <span className="text-sm">Search food, meals...</span>
        </div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <button
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-50"
          >
            <Icon name="bell" className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <span className="hidden text-right text-sm sm:block">
              <span className="block font-semibold text-slate-800">
                {user.name}
              </span>
              <span className="text-xs text-slate-400">Free plan</span>
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f2d2bd] text-sm font-bold text-[#8c553c]">
              {initials}
            </span>
          </div>
          <form
            action={
              logoutAction as unknown as (
                formData: FormData,
              ) => void | Promise<void>
            }
          >
            <button
              type="submit"
              className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 sm:px-3"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex-1 py-4 ">
        {/* Static greeting — no DB, appears instantly */}
        <DashboardGreeting name={user.name} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.48fr)_minmax(330px,0.82fr)]">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Calorie ring — streams in independently */}
            <Suspense fallback={<CalorieCardSkeleton />}>
              <CalorieCard />
            </Suspense>
            {/* Macro bars — streams in independently */}
            <Suspense fallback={<MacroOverviewSkeleton />}>
              <MacroOverview />
            </Suspense>

            {/* Today's meals — streams in independently */}
            <Suspense fallback={<TodaysMealsSkeleton />}>
              <TodaysMeals />
            </Suspense>
          </div>

          {/* ── Right column ────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Weekly bar chart — streams in independently */}
            <Suspense fallback={<WeeklyProgressSkeleton />}>
              <WeeklyProgress />
            </Suspense>

            {/* Goal card — streams in independently */}
            <Suspense fallback={<GoalCardSkeleton />}>
              <GoalCard />
            </Suspense>

            {/* Static streak banner — no DB, always instant */}
            <StreakBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
