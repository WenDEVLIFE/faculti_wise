"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen, Users, Clock, Award } from "lucide-react";

export function TeacherAcademicStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Current Load</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">21</span>
                <span className="text-xs text-text-muted">Units</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Total Students</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">154</span>
                <span className="text-xs text-text-muted">Enrolled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Weekly Hours</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">18.5</span>
                <span className="text-xs text-text-muted">Hours</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-amber-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Rating</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">4.9</span>
                <span className="text-xs text-text-muted">Avg.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
