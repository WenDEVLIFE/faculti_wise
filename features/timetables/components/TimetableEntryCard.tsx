"use client";

import React from "react";
import { TimetableEntry } from "@/lib/types/timetable.types";
import { cn } from "@/lib/utils";
import { Clock, User, MapPin } from "lucide-react";

interface TimetableEntryCardProps {
  entry: TimetableEntry;
  style?: React.CSSProperties;
}

const typeColors = {
  lecture: "bg-blue-50/95 border-blue-200 text-blue-850 border-l-blue-500",
  lab: "bg-purple-50/95 border-purple-200 text-purple-850 border-l-purple-500",
  seminar: "bg-emerald-50/95 border-emerald-200 text-emerald-850 border-l-emerald-500",
  other: "bg-stone-50/95 border-stone-200 text-stone-850 border-l-stone-500",
};

export function TimetableEntryCard({ entry, style }: TimetableEntryCardProps) {
  const displaySet = entry.sectionName || "A";

  return (
    <div
      className={cn(
        "absolute inset-x-0.5 rounded-xl border p-1.5 text-[10px] md:text-xs transition-all hover:z-30 hover:shadow-lg flex flex-col justify-between overflow-hidden group border-l-4 shadow-sm",
        typeColors[entry.type] || typeColors.other
      )}
      style={style}
    >
      <div className="flex flex-col h-full justify-between min-w-0 space-y-0.5">
        {/* 1. Course Code */}
        <div className="font-extrabold tracking-wider uppercase text-[10px] md:text-[11px] truncate shrink-0">
          {entry.courseCode}
        </div>

        {/* 2. Subject Name */}
        <div 
          className="font-bold text-text truncate leading-tight text-[10px] md:text-[11px] group-hover:text-primary transition-colors shrink-0" 
          title={entry.courseName}
        >
          {entry.courseName}
        </div>

        {/* 3. Instructor Name & Set */}
        <div 
          className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium opacity-90 truncate shrink-0" 
          title={`Instructor: ${entry.teacherName} • Set: ${displaySet}`}
        >
          <User className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate">{entry.teacherName || "Unassigned"} • Set {displaySet}</span>
        </div>

        {/* 4. Room or Building */}
        <div 
          className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium opacity-90 truncate shrink-0" 
          title={`Location: ${entry.room}`}
        >
          <MapPin className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate">{entry.room || "TBA"}</span>
        </div>

        {/* 5. Time (Start & End) */}
        <div 
          className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-semibold opacity-95 shrink-0"
          title={`Time: ${entry.startTime} - ${entry.endTime}`}
        >
          <Clock className="h-3 w-3 shrink-0 opacity-75" />
          <span className="truncate">{entry.startTime} - {entry.endTime}</span>
        </div>
      </div>
    </div>
  );
}
