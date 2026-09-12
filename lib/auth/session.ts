import { cache } from "react";
import { cookies } from "next/headers";
import { authService } from "@/services/auth/auth.service";
import { Errors } from "@/lib/errors";
import { getSessionExpiry, signSessionToken, verifySessionToken } from "./session-token";

const COOKIE_NAME = "nourish_session";
const cookieOptions = (expires: Date) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires });

export async function createSession(userId: string) {
  const expiresAt = getSessionExpiry();
  const session = await authService.createSession(userId, expiresAt);
  const token = await signSessionToken({ sessionId: session.id, userId }, session.expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, cookieOptions(session.expiresAt));
}

/**
 * Wrapped with React cache() so that multiple async Server Components
 * calling requireUser() in the same render (e.g. DashboardContent +
 * CalorieCard + MacroOverview + ...) share a single cookie read and
 * a single DB session lookup per request.
 */
export const requireUser = cache(async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const claims = token ? await verifySessionToken(token) : null;
  if (!claims) throw Errors.unauthorized("You must be signed in to continue.", "AUTH");

  const session = await authService.getActiveSession(claims.sessionId, claims.userId);
  if (!session) throw Errors.unauthorized("Your session has expired. Please sign in again.", "AUTH");
  return session.user;
});

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const claims = token ? await verifySessionToken(token) : null;
  if (claims) await authService.revokeSession(claims.sessionId);
  cookieStore.delete(COOKIE_NAME);
}
