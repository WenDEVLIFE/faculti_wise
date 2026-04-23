import * as React from "react";
import StudentProfileView from "@/features/student-profile/StudentProfileView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function StudentSettingsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
      <StudentProfileView />
    </Suspense>
  );
}
