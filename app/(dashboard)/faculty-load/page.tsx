import * as React from "react";
import FacultyLoadView from "@/features/faculty-load/FacultyLoadView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function FacultyLoadPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
      <FacultyLoadView />
    </Suspense>
  );
}
