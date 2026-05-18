"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Building2,
  User,
  GraduationCap,
  ClipboardList
} from "lucide-react";
import { appRoutes } from "@/lib/constants/routes.constants";

const navigation = [
  { name: "My Class Schedule", href: appRoutes.studentSchedule, icon: LayoutDashboard },
  { name: "Faculty Search", href: appRoutes.studentDashboard, icon: Calendar },
  { name: "Department Schedule", href: appRoutes.studentDepartmentSchedule, icon: Building2 },
  { name: "Credit Checklist", href: appRoutes.studentChecklist, icon: ClipboardList },
  { name: "Settings", href: appRoutes.studentSettings, icon: User },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={appRoutes.studentDashboard} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm">
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
                    ? "bg-indigo-600 text-white"
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
    </div>
  );
}

