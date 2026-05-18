"use client";

import Link from "next/link";

import { appRoutes } from "@/lib/constants/routes.constants";
import { Eye, EyeOff } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPageView() {
  const router = useRouter();
  const { profile, login, setDemoProfile, isDemoMode, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await login(email, password);
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
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 pr-12 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
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

              {isDemoMode && (
                <div className="mt-6 pt-6 border-t border-stone-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Developer Sandbox Mode
                    </p>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Firebase is currently offline/unconfigured. You can instantly log in as any role with a single click below, or use the pre-configured credentials.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDemoProfile('admin')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 text-xs font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-50 cursor-pointer"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-300 text-[9px] font-bold text-amber-600">A</span>
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoProfile('teacher')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50/50 text-xs font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-teal-50 cursor-pointer"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-teal-300 text-[9px] font-bold text-teal-600">T</span>
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoProfile('student')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs font-semibold text-indigo-900 transition hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-indigo-300 text-[9px] font-bold text-indigo-600">S</span>
                      Student
                    </button>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-3 text-[11px] text-stone-500 border border-stone-100 flex flex-col gap-1 font-mono">
                    <div><strong>Admin:</strong> wwen485@gmail.com</div>
                    <div><strong>Teacher:</strong> john.smith@university.edu</div>
                    <div><strong>Student:</strong> alice.brown@university.edu</div>
                    <div className="text-stone-400 mt-1">🔑 Password for all: Password123!</div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

