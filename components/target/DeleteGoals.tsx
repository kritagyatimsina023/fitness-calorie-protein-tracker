"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Tooltip } from "../ui/Tooltip";
import { DeleteModal } from "./DeleteModal";
import {
  deleteGoalAction,
  DeleteGoalState,
} from "@/actions/nutritions/nutritions.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  goalId: string;
};

const initialState: DeleteGoalState = {
  success: false,
  message: "",
};

export function DeleteGoals({ goalId }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteGoalAction,
    initialState,
  );
  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? "Goal deleted Successfully");
      router.refresh();

      return;
    }
    if (!state.success && state.message) {
      toast.error(state.message);
      return;
    }
  }, [state, router]);
  const handleDelete = () => {
    setOpen(false);

    const formData = new FormData();
    formData.append("goalId", goalId);
    // formAction(formData);

    formAction(formData);
  };

  return (
    <>
      <Tooltip content="Delete Goal" side="bottom">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Tooltip>
      <DeleteModal
        open={open}
        onClose={() => setOpen(false)}
        isPending={isPending}
        title="Delete nutrition goal?"
        description="This action cannot be undone. The selected nutrition goal will be permanently deleted."
        onConfirm={handleDelete}
      />
    </>
  );
}
