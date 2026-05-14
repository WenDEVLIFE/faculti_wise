import * as React from "react";
import FacultyScheduleView from "@/features/faculty-schedule/FacultyScheduleView";
import { Suspense } from "react";

export default function StudentDashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
      <FacultyScheduleView searchParams={searchParams} />
    </Suspense>
  );
}

