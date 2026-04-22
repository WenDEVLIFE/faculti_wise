import { StudentAppShell } from "@/components/layout/StudentAppShell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentAppShell>{children}</StudentAppShell>;
}
