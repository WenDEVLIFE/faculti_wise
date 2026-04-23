import * as React from "react";
import AvailabilityView from "@/features/availability/AvailabilityView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
      <AvailabilityView />
    </Suspense>
  );
}
