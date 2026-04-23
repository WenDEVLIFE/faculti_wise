"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Mail, MapPin, Camera, Pencil } from "lucide-react";

export function TeacherPersonalInfo() {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Pencil className="h-3.5 w-3.5" /> Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.02]">
              <User className="h-16 w-16 text-primary/30" />
            </div>
            <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-strong transition-all scale-0 group-hover:scale-100 duration-200">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text font-source-serif">Dr. Sarah Miller</h2>
            <p className="text-primary font-semibold">Senior Professor • Computer Science</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <Mail className="h-3.5 w-3.5" /> sarah.miller@facultywise.edu
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <MapPin className="h-3.5 w-3.5" /> Office 402, Science Hall
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Specialization</p>
            <p className="text-sm font-semibold text-text">Artificial Intelligence, Machine Learning</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Employment Type</p>
            <p className="text-sm font-semibold text-text">Full-time Permanent</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Joining Date</p>
            <p className="text-sm font-semibold text-text">August 15, 2018</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Employee ID</p>
            <p className="text-sm font-semibold text-text">FW-2018-0042</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
