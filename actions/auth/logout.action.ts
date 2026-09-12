"use server";
import { deleteSession } from "@/lib/auth/session";
import { handleError, normalizeError } from "@/lib/errors";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types/action-result";

export async function logoutAction(): Promise<ActionResult<null>> {
  try {
    await deleteSession();
  } catch (error) {
    const appError = normalizeError(error, "AUTH");
    return { success: false, error: handleError(appError) };
  }

  // Redirect only after the session has been revoked and its cookie removed.
  redirect("/login");
}
