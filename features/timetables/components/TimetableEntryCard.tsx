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
        "absolute inset-x-1 rounded-xl border p-2 text-[10px] md:text-xs transition-all hover:z-30 hover:shadow-lg flex flex-col justify-between overflow-hidden group border-l-4 shadow-sm",
        typeColors[entry.type] || typeColors.other
      )}
      style={style}
    >
      <div className="flex flex-col h-full justify-between min-w-0 space-y-1">
        {/* Course Code and Section/Set Info */}
        <div className="flex items-center justify-between gap-1 shrink-0">
          <span 
            className="font-extrabold tracking-wider uppercase truncate text-[9px] md:text-[10px] bg-white/70 px-1.5 py-0.5 rounded-md border border-black/5" 
            title={entry.courseName}
          >
            {entry.courseCode}
          </span>
          <span 
            className="text-[9px] font-bold text-black/60 bg-black/5 px-1.5 py-0.5 rounded-md truncate max-w-[80px]" 
            title={`Section/Set: ${displaySet}`}
          >
            {displaySet}
          </span>
        </div>

        {/* Subject Name */}
        <div 
          className="font-bold text-text truncate leading-snug text-[10px] md:text-[11px] group-hover:text-primary transition-colors shrink-0" 
          title={entry.courseName}
        >
          {entry.courseName}
        </div>

        {/* Instructor */}
        <div 
          className="flex items-center gap-1 text-[9px] md:text-[10px] font-medium opacity-80 truncate shrink-0" 
          title={`Instructor: ${entry.teacherName}`}
        >
          <User className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate">{entry.teacherName || "Unassigned"}</span>
        </div>

        {/* Room & Building Location */}
        <div 
          className="flex items-center gap-1 text-[9px] md:text-[10px] font-medium opacity-80 truncate shrink-0" 
          title={`Location: ${entry.room}`}
        >
          <MapPin className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate">{entry.room || "TBA"}</span>
        </div>

        {/* Time (Start & End) */}
        <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-semibold opacity-90 pt-1 border-t border-black/5 mt-0.5 shrink-0">
          <Clock className="h-3 w-3 shrink-0 opacity-75" />
          <span className="truncate">{entry.startTime} - {entry.endTime}</span>
        </div>
      </div>
    </div>
  );
}
