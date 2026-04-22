export type LoadStatus = "underloaded" | "normal" | "overloaded";

export interface LoadAssignment {
  courseCode: string;
  courseName: string;
  units: number;
  section: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  totalUnits: number;
  targetUnits: number;
  status: LoadStatus;
  assignments: LoadAssignment[];
}

export interface FacultyLoadSummary {
  totalFaculty: number;
  totalUnits: number;
  overloadedCount: number;
  underloadedCount: number;
}
