import * as React from "react";
import TimetableView from "@/features/timetables/TimetableView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function MySchedulePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
      <TimetableView 
        title="My Schedule" 
        subtitle="Individual academic timetable for the current semester."
      />
    </Suspense>
  );
}
