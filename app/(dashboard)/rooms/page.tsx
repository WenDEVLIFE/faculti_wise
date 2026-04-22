import * as React from "react";
import RoomsView from "@/features/rooms/RoomsView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse bg-surface-alt rounded-2xl" />
      ))}
    </div>}>
      <RoomsView />
    </Suspense>
  );
}
