import Link from "next/link";

import { appRoutes } from "@/lib/constants/routes.constants";

export default function LoginPageView() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.16),_transparent_34%),linear-gradient(180deg,_#fffaf1_0%,_#f3efe6_100%)] px-6 py-8 text-stone-900 sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-stone-950 p-8 text-white shadow-[0_30px_90px_rgba(43,30,12,0.24)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_40%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="max-w-xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Faculty Wise
              </p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Sign in to keep faculty schedules under control.
                </h1>
                <p className="max-w-lg text-base leading-7 text-stone-300 sm:text-lg">
                  Manage assignments, spot overloads, and move faster from
                  planning to publication with one workspace for academic
                  operations.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-stone-300">Departments</p>
                <p className="mt-2 text-2xl font-semibold">12</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-stone-300">Alerts</p>
                <p className="mt-2 text-2xl font-semibold">Real-time</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-stone-300">Planning</p>
                <p className="mt-2 text-2xl font-semibold">Aligned</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(100,75,35,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                Login to your account
              </h2>
              <p className="text-sm leading-6 text-stone-600">
                Use your institution email to continue.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-stone-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@university.edu"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-stone-600">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="font-medium text-amber-700 transition hover:text-amber-800"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Sign in
              </button>

              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-stone-400">
                <span className="h-px flex-1 bg-stone-200" />
                or
                <span className="h-px flex-1 bg-stone-200" />
              </div>

              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:bg-stone-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-[10px] font-bold text-stone-500">
                  G
                </span>
                Continue with Google
              </button>

              <p className="text-center text-sm text-stone-600">
                New here?{" "}
                <Link href={appRoutes.home} className="font-medium text-amber-700">
                  Learn more about Faculty Wise
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
