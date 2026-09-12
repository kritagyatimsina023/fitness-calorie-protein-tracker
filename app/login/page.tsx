import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f7f5] p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_24px_80px_rgba(50,37,26,0.12)] sm:p-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-xl font-black text-white">
            N
          </span>
          <span className="text-xl font-bold">
            Nourish<span className="text-orange-500">.</span>
          </span>
        </Link>
        <p className="mt-10 text-sm font-semibold text-orange-500">
          WELCOME BACK
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Sign in to Nourish
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Continue tracking the meals and progress that matter to you.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
