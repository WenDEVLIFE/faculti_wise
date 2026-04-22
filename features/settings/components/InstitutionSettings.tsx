"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Calendar, Globe, Bell } from "lucide-react";

export function InstitutionSettings() {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Institution Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="text" 
                  defaultValue="FacultyWise University"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Academic Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>2024 - 2025</option>
                    <option>2023 - 2024</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Locale</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>English (United States)</option>
                    <option>Filipino (Philippines)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-text">System Notifications</span>
              </div>
              <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Enable automated email notifications for faculty load alerts and schedule conflicts.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" className="px-8 shadow-md">Update Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
