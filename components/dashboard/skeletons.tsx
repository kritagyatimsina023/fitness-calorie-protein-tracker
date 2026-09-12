/**
 * Skeleton fallback for <CalorieCard> while data streams in.
 */
export function CalorieCardSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1b2534] p-6 text-white sm:p-7">
      <div className="absolute -right-16 -top-24 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <div className="h-3 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-44 animate-pulse rounded-full bg-white/10" />
          <div className="h-3 w-48 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="relative mx-auto h-36 w-36 animate-pulse rounded-full bg-white/10" />
      </div>
    </section>
  );
}

/**
 * Skeleton fallback for <MacroOverview> while data streams in.
 */
export function MacroOverviewSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-36 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-14 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton fallback for <TodaysMeals> while data streams in.
 */
export function TodaysMealsSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-44 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton fallback for <WeeklyProgress> while data streams in.
 */
export function WeeklyProgressSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-7 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="flex h-44 items-end justify-between gap-2 border-b border-slate-100 pb-0">
        {[53, 76, 62, 84, 66, 48, 71].map((h, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span
              className="w-full max-w-7 animate-pulse rounded-t-md bg-slate-100"
              style={{ height: `${h}%` }}
            />
            <span className="pb-2">
              <span className="block h-2 w-5 animate-pulse rounded-full bg-slate-100" />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
    </section>
  );
}

/**
 * Skeleton fallback for <GoalCard> while data streams in.
 */
export function GoalCardSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-36 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="rounded-xl bg-slate-50 p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="h-2 flex-1 animate-pulse rounded-full bg-slate-200" />
          ))}
        </div>
      </div>
      <div className="mt-5 h-4 w-36 animate-pulse rounded-full bg-slate-100" />
    </section>
  );
}
