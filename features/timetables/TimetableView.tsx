import React from "react";
import { TimetableGrid } from "./components/TimetableGrid";
import { TimetableEntry } from "@/lib/types/timetable.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Mock data generator
async function getTimetableData(): Promise<TimetableEntry[]> {
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
    {
      id: "3",
      courseCode: "PHYS101",
      courseName: "General Physics",
      teacherName: "Dr. Brown",
      room: "RM-305",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:30",
      type: "lecture",
    },
    {
      id: "4",
      courseCode: "ENG105",
      courseName: "Academic Writing",
      teacherName: "Ms. Davis",
      room: "SEM-404",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:30",
      type: "seminar",
    },
    {
      id: "5",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      teacherName: "Dr. Smith",
      room: "LAB-205",
      day: "Thursday",
      startTime: "09:00",
      endTime: "11:00",
      type: "lab",
    },
    {
      id: "6",
      courseCode: "MATH202",
      courseName: "Calculus II",
      teacherName: "Prof. Johnson",
      room: "RM-201",
      day: "Friday",
      startTime: "10:00",
      endTime: "11:30",
      type: "lecture",
    },
  ];
}

interface TimetableViewProps {
  title: string;
  subtitle?: string;
}

export default async function TimetableView({ title, subtitle }: TimetableViewProps) {
  const entries = await getTimetableData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">{title}</h1>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Semester 1, 2024</Badge>
          <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">Published</Badge>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white/40 backdrop-blur-md">
        <CardContent className="p-0">
          <TimetableGrid entries={entries} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/30 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 uppercase tracking-wider">Total Weekly Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">18.5 hrs</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Lectures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">4 Sessions</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/30 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 uppercase tracking-wider">Labs / Practicals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">2 Sessions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
