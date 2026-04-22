"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  Settings,
  GraduationCap,
  ClipboardList
} from "lucide-react";
import { appRoutes } from "@/lib/constants/routes.constants";

const navigation = [
  { name: "My Dashboard", href: appRoutes.teacherDashboard, icon: LayoutDashboard },
  { name: "My Schedule", href: appRoutes.teacherSchedule, icon: Calendar },
  { name: "Availability", href: appRoutes.teacherAvailability, icon: Clock },
  { name: "Department Schedule", href: appRoutes.teacherDepartmentSchedule, icon: ClipboardList },
  { name: "My Profile", href: appRoutes.teacherSettings, icon: User },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={appRoutes.teacherDashboard} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-white shadow-sm">
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
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-600 text-white"
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
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text">Prof. Jane Doe</span>
              <span className="text-[10px] text-text-muted">Faculty Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
