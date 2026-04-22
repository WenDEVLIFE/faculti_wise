"use client";

import React from "react";
import { TimetableEntry, DayOfWeek } from "@/lib/types/timetable.types";
import { TimetableEntryCard } from "./TimetableEntryCard";

interface TimetableGridProps {
  entries: TimetableEntry[];
  days?: DayOfWeek[];
  startHour?: number;
  endHour?: number;
}

const DEFAULT_DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_START_HOUR = 7;
const DEFAULT_END_HOUR = 20;

export function TimetableGrid({
  entries,
  days = DEFAULT_DAYS,
  startHour = DEFAULT_START_HOUR,
  endHour = DEFAULT_END_HOUR,
}: TimetableGridProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const calculatePosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startTotalMinutes = (startH - startHour) * 60 + startM;
    const endTotalMinutes = (endH - startHour) * 60 + endM;
    const duration = endTotalMinutes - startTotalMinutes;

    return {
      top: `${(startTotalMinutes / 60) * 4}rem`, // 4rem per hour
      height: `${(duration / 60) * 4}rem`,
    };
  };

  return (
    <div className="relative overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-border bg-surface-alt/50 sticky top-0 z-20 backdrop-blur-sm">
          <div className="p-3"></div>
          {days.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-text border-l border-border first:border-l-0">
              {day}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="relative grid grid-cols-[80px_repeat(6,1fr)]">
          {/* Time Labels */}
          <div className="bg-surface-alt/20">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-border/50 text-right pr-4 text-[10px] font-medium text-text-muted flex items-start pt-2">
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {days.map((day) => (
            <div key={day} className="relative border-l border-border/50 bg-white/50">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b border-border/50" />
              ))}
              
              {/* Entries for this day */}
              {entries
                .filter((e) => e.day === day)
                .map((entry) => (
                  <TimetableEntryCard
                    key={entry.id}
                    entry={entry}
                    style={calculatePosition(entry.startTime, entry.endTime)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
