"use client";

import * as React from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/AuthContext";

export function StudentHeader() {
  const { signOut } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-8 sticky top-0 z-30">
      <div className="flex flex-1 items-center">
        <div className="flex items-center gap-2 text-text-muted italic text-sm">
          <Search className="h-4 w-4" />
          <span>Quick search available in the dashboard below</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-text-muted" />
        </Button>
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-text">Faculty Schedule Viewer</span>
            <span className="text-[10px] text-text-muted">Public Access Mode</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-surface-alt">
            <User className="h-4 w-4 text-primary" />
          </Button>
        </div>
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut}
          className="text-text-muted hover:text-danger hover:bg-danger/5 gap-2 font-semibold"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
