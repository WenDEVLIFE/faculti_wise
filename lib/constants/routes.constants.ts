export const appRoutes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  timetables: "/timetables",
  facultyLoad: "/faculty-load",
  courses: "/courses",
  rooms: "/rooms",
  settings: "/settings",

  // Teacher Routes
  teacherDashboard: "/teacher",
  teacherSchedule: "/teacher/schedule",
  teacherAvailability: "/teacher/availability",
  teacherDepartmentSchedule: "/teacher/department-schedule",
  teacherSettings: "/teacher/settings",
} as const;
