import React from "react";
import { useSearchParams } from "react-router-dom";
import { TimetableGrid } from "@/features/timetables/components/TimetableGrid";
import { FacultySearch } from "./components/FacultySearch";
import { TimetableEntry } from "@/lib/types/timetable.types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, User, Info } from "lucide-react";

const DEPARTMENTS = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Information Technology" },
  { id: "3", name: "Engineering" },
  { id: "4", name: "Mathematics" },
];

const SCHEDULES: TimetableEntry[] = [
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
    courseCode: "CS102",
    courseName: "Data Structures",
    teacherName: "Dr. Smith",
    room: "LAB-102",
    day: "Wednesday",
    startTime: "13:00",
    endTime: "15:00",
    type: "lab",
  },
  {
    id: "3",
    courseCode: "CS201",
    courseName: "Algorithms",
    teacherName: "Dr. Smith",
    room: "RM-305",
    day: "Friday",
    startTime: "10:00",
    endTime: "12:00",
    type: "lecture",
  },
];

export function FacultyScheduleView() {
  const [searchParams] = useSearchParams();
  const instructor = searchParams.get("instructor") || "Dr. Smith";
  const deptId = searchParams.get("dept") || "1";
  
  const currentDept = DEPARTMENTS.find(d => d.id === deptId)?.name || "Department of Computer Science";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Faculty Schedule Viewer
          </h1>
          <p className="text-text-muted text-lg">
            Search for an instructor to view their weekly teaching availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-indigo-700 border-indigo-200 flex items-center gap-1.5 py-1.5 px-4 rounded-full shadow-sm">
            <Calendar className="h-4 w-4" />
            First Semester 2024-2025
          </Badge>
        </div>
      </div>

      <FacultySearch departments={DEPARTMENTS} />

      <div className="grid gap-8">
        <div className="flex items-center gap-4 px-2">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{instructor}</h2>
            <p className="text-text-muted font-medium">{currentDept}</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white/40 backdrop-blur-xl ring-1 ring-white/20">
          <CardContent className="p-0">
            <TimetableGrid entries={SCHEDULES} />
          </CardContent>
        </Card>
      </div>
      
      <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">About this View</h4>
          <p className="text-sm text-indigo-800/80 leading-relaxed mt-1">
            This schedule is provided to help you find instructors during their teaching hours or office consultations. Room assignments are subject to change; please verify with the department office if an instructor is not found in the listed room.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacultyScheduleView;
