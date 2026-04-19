import type { Metadata } from "next";

import LoginPageView from "@/features/auth/login/LoginPageView";

export const metadata: Metadata = {
  title: "Login | Faculty Wise",
  description: "Sign in to manage faculty schedules and teaching load.",
};

export default function LoginPage() {
  return <LoginPageView />;
}