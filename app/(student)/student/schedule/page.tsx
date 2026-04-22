import * as React from "react";
import TimetableView from "@/features/timetables/TimetableView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function StudentSchedulePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
      <TimetableView 
        title="Student Schedule" 
        subtitle="Your personalized class schedule for the current term."
      />
    </Suspense>
  );
}
