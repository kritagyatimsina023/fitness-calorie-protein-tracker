"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { GoalSet } from "./GoalSet";

import { NutritionGoalDTO } from "@/types/nutrition-goals";
import { Tooltip } from "../ui/Tooltip";
type props = {
  goal: NutritionGoalDTO;
};

export function EditGoals({ goal }: props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className=" inline-flex bg-orange-50 items-center px-3 py-1.5 cursor-pointer gap-2 rounded-xl   text-sm font-semibold text-black transition "
      >
        <Tooltip content="Edit Goals" side="bottom">
          <PencilIcon color="orange" className="h-4 w-4" />
          {/* Edit a goal */}
        </Tooltip>
      </button>
      <GoalSet
        mode="edit"
        goal={goal}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
