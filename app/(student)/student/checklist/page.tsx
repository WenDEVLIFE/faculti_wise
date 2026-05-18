import * as React from "react";
import { CreditChecklistView } from "@/features/student-profile/components/CreditChecklistView";
import { Suspense } from "react";

export default function StudentChecklistPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-3xl" />}>
      <CreditChecklistView />
    </Suspense>
  );
}
