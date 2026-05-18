"use client";

import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { TeacherAppShell } from "@/components/layout/TeacherAppShell";
import { RoleGate } from "@/components/auth/RoleGate";
import LoginPageView from "@/features/auth/login/LoginPageView";
import RegisterPageView from "@/features/auth/register/RegisterPageView";

// Feature imports
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { StudentDashboardView } from "@/components/student-profile/StudentDashboardView";

// Teacher imports
import { RealtimeTeacherDashboard } from "@/features/teacher-profile/RealtimeTeacherDashboard";
import { MySchedulePage } from "@/features/teacher-profile/MySchedulePage";
import AvailabilityView from "@/features/availability/AvailabilityView";
import TeacherProfileView from "@/features/teacher-profile/TeacherProfileView";
import DepartmentScheduleView from "@/features/department-schedule/DepartmentScheduleView";
import { Button } from "@/components/ui/Button";

// Layout Wrapper Route elements for nested routing
function AdminLayout() {
  return (
    <RoleGate allowedRoles={['admin']}>
      <AppShell>
        <AdminDashboardView />
      </AppShell>
    </RoleGate>
  );
}

function StudentLayout() {
  return (
    <RoleGate allowedRoles={['student']}>
      <StudentAppShell>
        <StudentDashboardView />
      </StudentAppShell>
    </RoleGate>
  );
}

function TeacherLayout() {
  return (
    <RoleGate allowedRoles={['teacher']}>
      <TeacherAppShell>
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-text font-source-serif">Welcome</h1>
                    <p className="text-text-muted mt-1">First Semester • AY 2024-2025</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary">
                      Download Schedule (PDF)
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      Update Availability
                    </Button>
                  </div>
                </div>
              </div>
              <RealtimeTeacherDashboard />
            </div>
          } />
          <Route path="/schedule" element={<MySchedulePage />} />
          <Route path="/availability" element={
            <React.Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
              <AvailabilityView />
            </React.Suspense>
          } />
          <Route path="/department-schedule" element={
            <React.Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
              <DepartmentScheduleView />
            </React.Suspense>
          } />
          <Route path="/settings" element={
            <React.Suspense fallback={<div className="animate-pulse h-[600px] bg-surface-alt rounded-2xl" />}>
              <TeacherProfileView />
            </React.Suspense>
          } />
        </Routes>
      </TeacherAppShell>
    </RoleGate>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<LoginPageView />} />
        <Route path="/register" element={<RegisterPageView />} />

        {/* Dashboard admin routing */}
        <Route path="/dashboard/*" element={<AdminLayout />} />
        <Route path="/timetables" element={<Navigate to="/dashboard?tab=timetables" replace />} />
        <Route path="/faculty-load" element={<Navigate to="/dashboard?tab=faculty-load" replace />} />
        <Route path="/courses" element={<Navigate to="/dashboard?tab=courses" replace />} />
        <Route path="/offerings" element={<Navigate to="/dashboard?tab=offerings" replace />} />
        <Route path="/rooms" element={<Navigate to="/dashboard?tab=rooms" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard?tab=settings" replace />} />
        <Route path="/users" element={<Navigate to="/dashboard?tab=users" replace />} />
        <Route path="/audit" element={<Navigate to="/dashboard?tab=audit" replace />} />

        {/* Student portal routing */}
        <Route path="/student/*" element={<StudentLayout />} />

        {/* Teacher portal routing */}
        <Route path="/teacher/*" element={<TeacherLayout />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
