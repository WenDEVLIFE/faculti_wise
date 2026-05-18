import * as React from "react";
import CourseOfferingsView from "@/features/course-offerings/CourseOfferingsView";
import { Suspense } from "react";

export default function CourseOfferingsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-20 animate-pulse bg-surface-alt rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse bg-surface-alt rounded-2xl" />
          ))}
        </div>
        <div className="h-96 animate-pulse bg-surface-alt rounded-2xl" />
      </div>
    }>
      <CourseOfferingsView />
    </Suspense>
  );
}
