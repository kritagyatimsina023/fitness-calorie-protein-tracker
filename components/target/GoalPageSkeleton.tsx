export function GoalsPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex-1 animate-pulse">
        {/* Page heading */}
        {/* <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 h-4 w-32 rounded bg-slate-200" />

            <div className="h-10 w-48 rounded-lg bg-slate-200 sm:w-56" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
          </div>

          <div className="h-12 w-32 rounded-xl bg-slate-200" />
        </div> */}

        {/* Current goal summary */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Section header */}
          {/* <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200" />

              <div>
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
              </div>
            </div>

            <div className="h-7 w-16 rounded-full bg-slate-200" />
          </div> */}

          {/* Goal cards */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-slate-200" />

                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <div className="h-9 w-20 rounded-lg bg-slate-200" />
                  <div className="h-4 w-8 rounded bg-slate-100" />
                </div>

                <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom sections */}
        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Macro distribution */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <div className="h-5 w-36 rounded bg-slate-200" />

              <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-4 w-20 rounded bg-slate-200" />

                    <div className="h-4 w-16 rounded bg-slate-100" />
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-slate-200 ${
                        index === 0
                          ? "w-[65%]"
                          : index === 1
                            ? "w-[45%]"
                            : "w-[30%]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Effective date */}
          <div className="rounded-2xl border border-slate-100 bg-[#fff4ee] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />

              <div>
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
              </div>
            </div>

            <div className="mt-6 h-8 w-48 rounded-lg bg-slate-200" />

            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-[90%] rounded bg-slate-100" />
              <div className="h-3 w-[70%] rounded bg-slate-100" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
