import * as React from "react";
import TeacherProfileView from "@/features/teacher-profile/TeacherProfileView";
import { Suspense } from "react";


export default function TeacherSettingsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
      <TeacherProfileView />
    </Suspense>
  );
}
