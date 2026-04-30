// User collection schema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  department: string;
  createdAt: string;
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
