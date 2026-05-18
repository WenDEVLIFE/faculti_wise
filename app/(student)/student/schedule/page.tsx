import * as React from "react";
import { StudentScheduleView } from "@/features/student-profile/components/StudentScheduleView";
import { Suspense } from "react";

export default function StudentSchedulePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-3xl" />}>
      <StudentScheduleView />
    </Suspense>
  );
}
