import React from "react";
import { TimetableGrid } from "@/features/timetables/components/TimetableGrid";
import { DepartmentSelector } from "./components/DepartmentSelector";
import { TimetableEntry } from "@/lib/types/timetable.types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar } from "lucide-react";

async function getMockFilters() {
  "use cache";
  return {
    departments: [
      { id: "1", name: "Computer Science", code: "CS" },
      { id: "2", name: "Information Technology", code: "IT" },
    ],
    programs: [
      { id: "1", name: "BS Computer Science", code: "BSCS", departmentId: "1" },
      { id: "2", name: "BS Information Technology", code: "BSIT", departmentId: "2" },
    ],
    sections: [
      { id: "1", name: "BSCS-1A", yearLevel: 1, programId: "1" },
      { id: "2", name: "BSCS-1B", yearLevel: 1, programId: "1" },
    ],
  };
}

async function getFilteredSchedule(): Promise<TimetableEntry[]> {
  "use cache";
  return [
    {
      id: "1",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      teacherName: "Dr. Smith",
      room: "RM-201",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      type: "lecture",
    },
    {
      id: "2",
      courseCode: "MATH202",
      courseName: "Calculus II",
      teacherName: "Prof. Johnson",
      room: "LAB-102",
      day: "Monday",
      startTime: "11:00",
      endTime: "13:00",
      type: "lab",
    },
  ];
}

export default async function DepartmentScheduleView() {
  const { departments, programs, sections } = await getMockFilters();
  const entries = await getFilteredSchedule();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Department Schedule</h1>
          <p className="text-text-muted mt-1">Browse published timetables across all academic departments and sections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 py-1 px-3">
            <Calendar className="h-3 w-3" />
            AY 2024-2025
          </Badge>
        </div>
      </div>

      <DepartmentSelector 
        departments={departments} 
        programs={programs} 
        sections={sections} 
      />

      <Card className="border-none shadow-md overflow-hidden bg-white/40 backdrop-blur-md">
        <CardContent className="p-0">
          <TimetableGrid entries={entries} />
        </CardContent>
      </Card>
      
      <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Schedule Notice</h4>
          <p className="text-sm text-amber-800/80 leading-relaxed mt-1">
            The schedules displayed here are published and finalized. For any concerns regarding room assignments or time conflicts, please contact your respective Department Head.
          </p>
        </div>
      </div>
    </div>
  );
}
