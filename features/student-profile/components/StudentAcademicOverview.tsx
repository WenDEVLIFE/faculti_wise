"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen, Award, CheckCircle2, TrendingUp } from "lucide-react";

export function StudentAcademicOverview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Cumulative GPA</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">3.85</span>
                <span className="text-xs text-text-muted">/ 4.0</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Enrolled Units</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">18</span>
                <span className="text-xs text-text-muted">Units</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Credits</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">92</span>
                <span className="text-xs text-text-muted">Completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-amber-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Rank</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">Top 5%</span>
                <span className="text-xs text-text-muted">of Class</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
