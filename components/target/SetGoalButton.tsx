"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GoalSet } from "./GoalSet";

export function SetGoalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Set a goal
      </button>
      <GoalSet mode="create" open={open} onClose={() => setOpen(false)} />
    </>
  );
}
