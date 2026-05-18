"use client";

import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BookOpen,
  Building2,
  Settings,
  Menu,
  GraduationCap,
  History as HistoryIcon,
  ListChecks,
  School
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navigation = [
  { name: "Dashboard", tab: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Timetables", tab: "timetables", href: "/dashboard?tab=timetables", icon: CalendarDays },
  { name: "Faculty Load", tab: "faculty-load", href: "/dashboard?tab=faculty-load", icon: Users },
  { name: "Courses", tab: "courses", href: "/dashboard?tab=courses", icon: BookOpen },
  { name: "Course Offerings", tab: "offerings", href: "/dashboard?tab=offerings", icon: ListChecks },
  { name: "Departments", tab: "departments", href: "/dashboard?tab=departments", icon: Building2 },
  { name: "Rooms & Labs", tab: "rooms", href: "/dashboard?tab=rooms", icon: School },
  { name: "Users", tab: "users", href: "/dashboard?tab=users", icon: Users },
  { name: "Audit Logs", tab: "audit", href: "/dashboard?tab=audit", icon: HistoryIcon },
  { name: "Settings", tab: "settings", href: "/dashboard?tab=settings", icon: Settings },
];

export function Sidebar() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Get initials for the avatar placeholder
  const initials = profile?.displayName
    ? profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : "FW";

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold font-source-serif text-text tracking-tight">
            Faculty_Wise
          </span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-surface-alt hover:text-text"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-text-muted group-hover:text-text"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <div className="rounded-md bg-surface-alt p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] overflow-hidden">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="h-full w-full object-cover" />
              ) : initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text truncate max-w-[120px]">
                {profile?.displayName || "System User"}
              </span>
              <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                {profile?.role || "Staff"} {profile?.departmentId ? `• ${profile.departmentId}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
