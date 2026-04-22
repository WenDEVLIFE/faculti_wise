import * as React from "react";
import TimetableView from "@/features/timetables/TimetableView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function TimetablesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
      <TimetableView 
        title="Institutional Timetables" 
        subtitle="Manage and view department-wide schedules and academic planning."
      />
    </Suspense>
  );
}
