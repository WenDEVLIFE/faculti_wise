import { TeacherAppShell } from "@/components/layout/TeacherAppShell";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherAppShell>{children}</TeacherAppShell>;
}
