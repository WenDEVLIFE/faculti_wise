export const appRoutes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  timetables: "/timetables",
  facultyLoad: "/faculty-load",
  courses: "/courses",
  rooms: "/rooms",
  settings: "/settings",
  users: "/users",

  // Teacher Routes
  teacherDashboard: "/teacher",
  teacherSchedule: "/teacher/schedule",
  teacherAvailability: "/teacher/availability",
  teacherDepartmentSchedule: "/teacher/department-schedule",
  teacherSettings: "/teacher/settings",

  // Student Routes
  studentDashboard: "/student",
  studentSchedule: "/student/schedule",
  studentDepartmentSchedule: "/student/department-schedule",
  studentSettings: "/student/settings",
  studentChecklist: "/student/checklist",
} as const;
