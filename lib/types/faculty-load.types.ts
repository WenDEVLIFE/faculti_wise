export type LoadStatus = "underloaded" | "normal" | "overloaded";

export interface LoadAssignment {
  id?: string;
  courseCode: string;
  courseName: string;
  units: number;
  section: string;
  roomId?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
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
  
  // Detailed Faculty Profile properties
  specialization?: string;
  major?: string;
  certifications?: string[];
  skills?: string[];
  teachingExperience?: string;
  eligibleSubjects?: string[];
  employeeNo?: string;
  employmentType?: string;
  officeLocation?: string;
}

export interface FacultyLoadSummary {
  totalFaculty: number;
  totalUnits: number;
  overloadedCount: number;
  underloadedCount: number;
}
