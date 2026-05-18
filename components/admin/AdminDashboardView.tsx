"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { OperationsDashboardView } from "@/components/admin/OperationsDashboardView";
import AuditLogsView from "@/features/audit/AuditLogsView";
import CoursesView from "@/features/courses/CoursesView";
import FacultyLoadView from "@/features/faculty-load/FacultyLoadView";
import CourseOfferingsView from "@/features/course-offerings/CourseOfferingsView";
import RoomsView from "@/features/rooms/RoomsView";
import SettingsView from "@/features/settings/SettingsView";
import TimetableView from "@/features/timetables/TimetableView";
import UserManagementView from "@/features/user-management/UserManagementView";

export function AdminDashboardView() {
  const [searchParamsHook] = useSearchParams();
  const tab = searchParamsHook.get("tab") || "dashboard";

  switch (tab) {
    case "timetables":
      return (
        <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
          <TimetableView 
            title="Institutional Timetables" 
            subtitle="Manage and view department-wide schedules and academic planning."
          />
        </Suspense>
      );
    case "faculty-load":
      return (
        <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
          <FacultyLoadView />
        </Suspense>
      );
    case "courses":
      return (
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-surface-alt rounded-2xl" />
            ))}
          </div>
        }>
          <CoursesView />
        </Suspense>
      );
    case "offerings":
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
    case "rooms":
      return (
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse bg-surface-alt rounded-2xl" />
            ))}
          </div>
        }>
          <RoomsView />
        </Suspense>
      );
    case "users":
      return <UserManagementView />;
    case "audit":
      return <AuditLogsView />;
    case "settings":
      return (
        <Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-xl" />}>
          <SettingsView />
        </Suspense>
      );
    case "dashboard":
    default:
      return <OperationsDashboardView />;
  }
}

export default AdminDashboardView;
