"use client";

import * as React from "react";
import { Bell, Search, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-8 sticky top-0 z-30">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-text-muted" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-border bg-surface py-2 pl-10 pr-3 text-sm placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search schedules, faculty, courses..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-text-muted" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-accent"></span>
        </Button>
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-surface-alt">
            <User className="h-4 w-4 text-primary" />
          </Button>
          <div className="flex flex-col items-start leading-tight hidden lg:flex">
            <span className="text-sm font-semibold text-text">Dr. Elena Cruz</span>
            <span className="text-[10px] text-text-muted">Dean of Computer Science</span>
          </div>
        </div>
      </div>
    </header>
  );
}
