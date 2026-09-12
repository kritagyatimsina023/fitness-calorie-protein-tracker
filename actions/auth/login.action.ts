"use server";

import { createSession } from "@/lib/auth/session";
import { handleError, normalizeError } from "@/lib/errors";
import { LoginSchema } from "@/schemas/auth";
import { authService } from "@/services/auth/auth.service";
import type { ActionResult } from "@/types/action-result";

export type LoginActionState = ActionResult<{ redirectTo: string }> | undefined;

export async function loginAction(
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  try {
    const input = LoginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const user = await authService.login(input);
    await createSession(user.id);
    return { success: true, data: { redirectTo: "/dashboard" } };
  } catch (error) {
    const appError = normalizeError(error, "AUTH");
    return { success: false, error: handleError(appError) };
  }
}
