"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginAction,
  type LoginActionState,
} from "@/actions/auth/login.action";

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    loginAction,
    undefined as LoginActionState,
  );

  useEffect(() => {
    if (state?.success) router.replace(state.data.redirectTo);
  }, [router, state]);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-semibold text-slate-700">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="alex@nourish.app"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        />
      </label>
      {!state?.success && state?.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {state.error.message}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-slate-400">
        Demo account: alex@nourish.app · Password123!
      </p>
    </form>
  );
}
