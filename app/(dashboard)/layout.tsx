"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RoleGate } from "@/components/auth/RoleGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowedRoles={['admin']}>
      <AppShell>{children}</AppShell>
    </RoleGate>
  );
}
