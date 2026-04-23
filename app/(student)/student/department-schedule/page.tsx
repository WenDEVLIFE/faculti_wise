import * as React from "react";
import DepartmentScheduleView from "@/features/department-schedule/DepartmentScheduleView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function StudentDepartmentSchedulePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
      <DepartmentScheduleView />
    </Suspense>
  );
}
