import type { SafeError } from "@/lib/errors";

export type ActionSuccess<T> = { success: true; data: T };
export type ActionFailure = { success: false; error: SafeError };
export type ActionResult<T> = ActionSuccess<T> | ActionFailure;
