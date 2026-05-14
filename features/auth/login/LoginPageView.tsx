"use client";

import Link from "next/link";

import { appRoutes } from "@/lib/constants/routes.constants";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, getAuthInstance } from "@/lib/firebase";
import { User as UserProfile } from "@/lib/types/firestore.types";

export default function LoginPageView() {
  const router = useRouter();
  const { profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      const redirectPath =
        profile.role === 'admin' ? appRoutes.dashboard :
          profile.role === 'teacher' ? appRoutes.teacherDashboard :
            appRoutes.studentDashboard;
      router.push(redirectPath);
    }
  }, [profile, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is handled by the useEffect watching the profile
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.16),_transparent_34%),linear-gradient(180deg,_#fffaf1_0%,_#f3efe6_100%)] px-6 py-8 text-stone-900 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <section className="w-full max-w-lg">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(100,75,35,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
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

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}
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
                  required
                  autoComplete="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/*
              <Link
                href={appRoutes.dashboard}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 px-5 text-sm font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300 text-[10px] font-bold text-amber-600">
                  A
                </span>
                Test Access (Admin)
              </Link>

              <Link
                href={appRoutes.teacherDashboard}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 px-5 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-teal-300 text-[10px] font-bold text-teal-600">
                  T
                </span>
                Test Access (Teacher)
              </Link>

              <Link
                href={appRoutes.studentDashboard}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 px-5 text-sm font-semibold text-indigo-900 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-indigo-300 text-[10px] font-bold text-indigo-600">
                  S
                </span>
                Test Access (Student)
              </Link>

              <p className="text-center text-sm text-stone-600">
                New here?{" "}
                <Link href="/register" className="font-medium text-amber-700">
                  Create an account
                </Link>
              </p>
              */}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
