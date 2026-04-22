import React from "react";
import { FacultyLoadTable } from "./components/FacultyLoadTable";
import { FacultyLoadStats } from "./components/FacultyLoadStats";
import { FacultyMember } from "@/lib/types/faculty-load.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Filter, Download, Plus } from "lucide-react";

async function getFacultyLoadData(): Promise<FacultyMember[]> {
  "use cache";
  return [
    {
      id: "1",
      name: "Dr. Sarah Miller",
      department: "Computer Science",
      designation: "Professor",
      totalUnits: 21,
      targetUnits: 18,
      status: "overloaded",
      assignments: [],
    },
    {
      id: "2",
      name: "Prof. Robert Chen",
      department: "Information Technology",
      designation: "Associate Professor",
      totalUnits: 18,
      targetUnits: 18,
      status: "normal",
      assignments: [],
    },
    {
      id: "3",
      name: "Ms. Elena Rodriguez",
      department: "Computer Science",
      designation: "Assistant Professor",
      totalUnits: 12,
      targetUnits: 18,
      status: "underloaded",
      assignments: [],
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      department: "Data Science",
      designation: "Professor",
      totalUnits: 18,
      targetUnits: 18,
      status: "normal",
      assignments: [],
    },
    {
      id: "5",
      name: "Prof. Lisa Thompson",
      department: "Computer Science",
      designation: "Associate Professor",
      totalUnits: 24,
      targetUnits: 18,
      status: "overloaded",
      assignments: [],
    },
  ];
}

export default async function FacultyLoadView() {
  const faculty = await getFacultyLoadData();

  const stats = {
    totalFaculty: faculty.length,
    totalUnits: faculty.reduce((acc, curr) => acc + curr.totalUnits, 0),
    overloadedCount: faculty.filter(f => f.status === "overloaded").length,
    underloadedCount: faculty.filter(f => f.status === "underloaded").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Faculty Load</h1>
          <p className="text-text-muted mt-1">Manage teaching assignments and track faculty utilization across departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md">
            <Plus className="h-4 w-4" /> New Assignment
          </Button>
        </div>
      </div>

      <FacultyLoadStats {...stats} />

      <Card className="border-none shadow-md bg-white/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-border bg-white/50 px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">Faculty Utilization List</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <select className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer min-w-[160px]">
                  <option>All Departments</option>
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <FacultyLoadTable faculty={faculty} />
        </CardContent>
      </Card>
    </div>
  );
}
