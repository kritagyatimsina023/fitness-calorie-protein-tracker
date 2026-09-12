"use client";

import { useState } from "react";
import { UpcomingGoalModal } from "./UpcomingGoalModal";
import { NutritionGoalDTO } from "@/types/nutrition-goals";
import { MoreHorizontal } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";

type Props = {
  goals: NutritionGoalDTO[];
};

export function UpcomingGoalTrigger({ goals }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex cursor-pointer text-left"
      >
        <Tooltip content="see Upcoming goals" side="bottom">
          <div className="rounded-xl transition hover:ring-1 hover:ring-orange-200">
            <MoreHorizontal color="" />
          </div>
        </Tooltip>
      </button>
      <UpcomingGoalModal
        open={open}
        onClose={() => setOpen(false)}
        goals={goals}
      />
    </>
  );
}
