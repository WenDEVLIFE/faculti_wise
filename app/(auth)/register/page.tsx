import type { Metadata } from "next";
import RegisterPageView from "@/features/auth/register/RegisterPageView";

export const metadata: Metadata = {
  title: "Register | Faculty Wise",
  description: "Create an account to manage faculty schedules and teaching load.",
};

export default function RegisterPage() {
  return <RegisterPageView />;
}
