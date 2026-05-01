export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  departmentId: string | null;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  photoURL?: string | null;
}

// Schedule collection schema
export interface Schedule {
  id: string;
  courseId: string;
  teacherId: string;
  roomId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  semester: string;
}

// Course collection schema
export interface Course {
  id: string;
  name: string;
  department: string;
  credits: number;
  capacity: number;
}

// Room collection schema
export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'laboratory' | 'seminar';
  building: string;
}
