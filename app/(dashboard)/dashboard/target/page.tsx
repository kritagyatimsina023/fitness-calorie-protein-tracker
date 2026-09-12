import { Suspense } from "react";
import { GoalsPageSkeleton } from "@/components/target/GoalPageSkeleton";
import GoalContent from "@/components/target/GoalContent";
import { SetGoalButton } from "@/components/target/SetGoalButton";

const GoalsPage = async () => {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex-1 ">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-orange-500">
              Nutrition goals
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Goals
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Stay consistent with your daily calorie and macronutrient targets.
            </p>
          </div>
          <div className="space-x-4">
            <SetGoalButton />
          </div>
        </div>
        <Suspense fallback={<GoalsPageSkeleton />}>
          <GoalContent />
        </Suspense>
      </div>
    </div>
  );
};

export default GoalsPage;
