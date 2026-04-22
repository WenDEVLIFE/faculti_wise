import React from "react";
import { CourseGrid } from "./components/CourseGrid";
import { Course } from "@/lib/types/course.types";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter } from "lucide-react";

async function getCoursesData(): Promise<Course[]> {
  "use cache";
  return [
    {
      id: "1",
      code: "CS101",
      name: "Introduction to Computer Science",
      description: "Fundamental concepts of programming, algorithms, and data structures using Python.",
      units: 3,
      lectureHours: 3,
      labHours: 0,
      category: "major",
      department: "Computer Science",
    },
    {
      id: "2",
      code: "MATH202",
      name: "Calculus II",
      description: "Techniques of integration, infinite series, and polar coordinates.",
      units: 4,
      lectureHours: 4,
      labHours: 0,
      category: "major",
      department: "Mathematics",
    },
    {
      id: "3",
      code: "CS205",
      name: "Data Structures & Algorithms",
      description: "Advanced data organization and algorithmic efficiency analysis.",
      units: 3,
      lectureHours: 2,
      labHours: 3,
      category: "major",
      department: "Computer Science",
    },
    {
      id: "4",
      code: "ENG105",
      name: "Academic Writing",
      description: "Essential skills for professional and academic research writing.",
      units: 3,
      lectureHours: 3,
      labHours: 0,
      category: "general",
      department: "English",
    },
    {
      id: "5",
      code: "PHYS101",
      name: "General Physics I",
      description: "Mechanics, heat, and sound with laboratory experiments.",
      units: 4,
      lectureHours: 3,
      labHours: 3,
      category: "general",
      department: "Physics",
    },
    {
      id: "6",
      code: "ART110",
      name: "Digital Arts",
      description: "Introduction to digital media creation and graphic design principles.",
      units: 3,
      lectureHours: 1,
      labHours: 4,
      category: "elective",
      department: "Arts & Media",
    },
    {
      id: "7",
      code: "IT301",
      name: "Network Security",
      description: "Principles of securing computer networks and data communication.",
      units: 3,
      lectureHours: 3,
      labHours: 0,
      category: "major",
      department: "Information Technology",
    },
    {
      id: "8",
      code: "ECON201",
      name: "Microeconomics",
      description: "Analysis of individual markets and consumer behavior.",
      units: 3,
      lectureHours: 3,
      labHours: 0,
      category: "minor",
      department: "Economics",
    },
  ];
}

export default async function CoursesView() {
  const courses = await getCoursesData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Course Catalog</h1>
          <p className="text-text-muted mt-1">Browse and manage the full directory of institutional courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by name, code or description..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2 border-border/50">
            <Filter className="h-4 w-4" /> Category
          </Button>
          <Button variant="secondary" className="gap-2 border-border/50">
            <Filter className="h-4 w-4" /> Department
          </Button>
        </div>
      </div>

      <CourseGrid courses={courses} />
    </div>
  );
}
