import * as React from "react";
import SettingsView from "@/features/settings/SettingsView";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
      <SettingsView />
    </Suspense>
  );
}
