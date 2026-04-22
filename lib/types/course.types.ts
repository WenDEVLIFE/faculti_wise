export type CourseCategory = "major" | "minor" | "general" | "elective";

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  units: number;
  lectureHours: number;
  labHours: number;
  category: CourseCategory;
  department: string;
}

export interface CourseFilter {
  search?: string;
  category?: CourseCategory;
  department?: string;
}
