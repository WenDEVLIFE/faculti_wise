"use client";

import React from "react";
import { TimetableEntry } from "@/lib/types/timetable.types";
import { cn } from "@/lib/utils";

interface TimetableEntryCardProps {
  entry: TimetableEntry;
  style?: React.CSSProperties;
}

const typeColors = {
  lecture: "bg-blue-50 border-blue-200 text-blue-700",
  lab: "bg-purple-50 border-purple-200 text-purple-700",
  seminar: "bg-emerald-50 border-emerald-200 text-emerald-700",
  other: "bg-stone-50 border-stone-200 text-stone-700",
};

export function TimetableEntryCard({ entry, style }: TimetableEntryCardProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-1 rounded-lg border p-2 text-xs transition-all hover:z-10 hover:shadow-md",
        typeColors[entry.type] || typeColors.other
      )}
      style={style}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="font-bold truncate" title={entry.courseName}>
          {entry.courseCode}
        </div>
        <div className="truncate text-[10px] opacity-80">{entry.courseName}</div>
        <div className="mt-1 flex items-center justify-between font-medium">
          <span className="truncate">{entry.room}</span>
          <span className="shrink-0">{entry.startTime}</span>
        </div>
      </div>
    </div>
  );
}
