"use client";

import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { RoleGate } from "@/components/auth/RoleGate";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowedRoles={['student']}>
      <StudentAppShell>{children}</StudentAppShell>
    </RoleGate>
  );
}
