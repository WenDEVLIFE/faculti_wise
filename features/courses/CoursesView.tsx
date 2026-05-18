"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CourseGrid } from "./components/CourseGrid";
import { Course, CourseCategory } from "@/lib/types/course.types";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter, Loader2, BookOpen, Layers, Award } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { coursesService } from "./courses.service";
import { AddEditCourseModal } from "./components/AddEditCourseModal";
import { cn } from "@/lib/utils";

export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    setLoading(true);
    const unsubscribe = coursesService.subscribeCourses((data) => {
      setCourses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Compute unique departments dynamically
  const departmentsList = useMemo(() => {
    const depts = courses.map((c) => c.department).filter(Boolean);
    return Array.from(new Set(depts)).sort();
  }, [courses]);

  // Handle Search and Filter logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;

      return matchesSearch && matchesCategory && matchesDepartment;
    });
  }, [courses, searchQuery, selectedCategory, selectedDepartment]);

  const handleAddCourse = () => {
    setCourseToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await coursesService.deleteCourse(courseId, profile || undefined);
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading Course Catalog in real-time...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Course Catalog</h1>
          <p className="text-text-muted mt-1">Browse and manage the full directory of institutional courses.</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleAddCourse}
              className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md h-12 px-6 rounded-2xl"
            >
              <Plus className="h-5 w-5" /> Add Course
            </Button>
          </div>
        )}
      </div>

      {/* Filter and control bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-4 rounded-3xl bg-white/50 border border-border/50 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by name, code or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full text-text"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm text-text-muted outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="all">All Categories</option>
              <option value="major">Major Course</option>
              <option value="minor">Minor Course</option>
              <option value="general">General Ed</option>
              <option value="elective">Elective</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm text-text-muted outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none min-w-[180px]"
            >
              <option value="all">All Departments</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <CourseGrid 
        courses={filteredCourses} 
        isAdmin={isAdmin}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />

      {/* Add / Edit Course Modal */}
      <AddEditCourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseToEdit={courseToEdit}
      />
    </div>
  );
}
