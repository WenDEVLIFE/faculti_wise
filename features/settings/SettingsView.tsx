"use client";

import React, { useState } from "react";
import { ProfileSettings } from "./components/ProfileSettings";
import { InstitutionSettings } from "./components/InstitutionSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { cn } from "@/lib/utils";
import { User, Building2, Shield } from "lucide-react";

type SettingsTab = "profile" | "institution" | "security";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "institution", label: "Institution", icon: Building2 },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Settings</h1>
        <p className="text-text-muted mt-1">Configure your personal preferences and system-wide institutional parameters.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-text-muted hover:bg-white hover:text-primary hover:shadow-sm"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 max-w-3xl">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "institution" && <InstitutionSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
}
