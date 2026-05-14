"use client";

import { TeacherAppShell } from "@/components/layout/TeacherAppShell";
import { RoleGate } from "@/components/auth/RoleGate";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowedRoles={['teacher']}>
      <TeacherAppShell>{children}</TeacherAppShell>
    </RoleGate>
  );
}
