import { Course, Room, User, Schedule } from "./types/firestore.types";

/** A single decision log entry explaining one schedule assignment */
export interface ScheduleDecision {
  courseCode: string;
  courseName: string;
  assignedTeacher: string;
  teacherReason: string;
  assignedRoom: string;
  roomReason: string;
  day: string;
  timeSlot: string;
  conflictsAvoided: number;
}

/** Full report returned alongside the generated schedules */
export interface AiScheduleReport {
  totalCourses: number;
  totalScheduled: number;
  totalSkipped: number;
  skippedCourses: { name: string; reason: string }[];
  decisions: ScheduleDecision[];
  conflictsAvoided: number;
  teacherLoadSummary: Record<string, number>; // teacherName -> count
  roomUsageSummary: Record<string, number>;   // roomName -> count
}

/**
 * AI Scheduling Logic (Native Node.js implementation)
 * Allocates courses to appropriate faculty and rooms while avoiding conflicts.
 * Returns both the schedules AND a detailed report explaining decisions.
 */
export function generateAiSchedule(
  courses: Course[],
  faculty: User[],
  rooms: Room[],
  term: string = "Semester 1, 2026"
): { schedules: Omit<Schedule, "id">[]; report: AiScheduleReport } {
  console.log(`[AI Scheduler] Analyzing ${courses.length} courses, ${faculty.length} faculty, ${rooms.length} rooms...`);

  const schedules: Omit<Schedule, "id">[] = [];
  const decisions: ScheduleDecision[] = [];
  const skippedCourses: { name: string; reason: string }[] = [];
  let totalConflictsAvoided = 0;
  const teacherLoad: Record<string, number> = {};
  const roomUsage: Record<string, number> = {};

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeslots = [
    { start: "08:00", end: "09:30" },
    { start: "09:30", end: "11:00" },
    { start: "11:00", end: "12:30" },
    { start: "13:00", end: "14:30" },
    { start: "14:30", end: "16:00" }
  ];

  // Helper to check for conflicts
  const isConflict = (teacherId: string, roomId: string, day: string, startTime: string) => {
    return schedules.some(
      s => (s.teacherId === teacherId || s.roomId === roomId) &&
           s.dayOfWeek === day &&
           s.startTime === startTime
    );
  };

  // Helper to find a faculty display name
  const getTeacherName = (id: string) => {
    const t = faculty.find(f => f.id === id);
    return t?.displayName || id;
  };
  const getRoomLabel = (id: string) => {
    const r = rooms.find(rm => rm.id === id);
    return r ? `${r.name} (${r.building})` : id;
  };

  for (const course of courses) {
    const courseName = course.name || course.id;
    const courseCode = course.code || course.id;

    // 1. Find suitable teachers
    let suitableTeachers = faculty.filter(f => f.role === 'teacher' && f.status === 'active');
    let teacherReason = "";

    if (suitableTeachers.length === 0) {
      skippedCourses.push({ name: courseName, reason: "No active teachers available in the system." });
      continue;
    }

    if (course.department) {
      const deptTeachers = suitableTeachers.filter(f => f.departmentId === course.department);
      if (deptTeachers.length > 0) {
        suitableTeachers = deptTeachers;
        teacherReason = `Matched to department "${course.department}" (${deptTeachers.length} eligible).`;
      } else {
        teacherReason = `No teachers in dept "${course.department}", using all ${suitableTeachers.length} active teachers.`;
      }
    } else {
      teacherReason = `No department specified, pool of ${suitableTeachers.length} active teachers.`;
    }

    // Prefer teacher with lowest current load for balanced distribution
    suitableTeachers.sort((a, b) => (teacherLoad[a.id] || 0) - (teacherLoad[b.id] || 0));

    // 2. Find suitable rooms
    const needsLab = course.name.toLowerCase().includes('lab') || course.name.toLowerCase().includes('programming');
    let suitableRooms = rooms;
    let roomReason = "";

    if (needsLab) {
      const labRooms = rooms.filter(r => r.type === 'laboratory');
      if (labRooms.length > 0) {
        suitableRooms = labRooms;
        roomReason = `Course requires lab/programming → assigned laboratory room (${labRooms.length} available).`;
      } else {
        roomReason = "Needs lab but none available, using any room.";
      }
    } else {
      const lecRooms = rooms.filter(r => r.type === 'lecture' || r.type === 'seminar');
      if (lecRooms.length > 0) {
        suitableRooms = lecRooms;
        roomReason = `Lecture/seminar course → assigned lecture room (${lecRooms.length} available).`;
      } else {
        roomReason = "No lecture rooms, using any available room.";
      }
    }

    if (suitableRooms.length === 0) {
      skippedCourses.push({ name: courseName, reason: "No suitable rooms available." });
      continue;
    }

    // Prefer room with lowest usage
    suitableRooms.sort((a, b) => (roomUsage[a.id] || 0) - (roomUsage[b.id] || 0));

    let assigned = false;
    let conflictsHit = 0;
    let attempts = 0;

    while (!assigned && attempts < 50) {
      attempts++;
      // Bias towards lower-load teachers/rooms (first in sorted array), but add some randomness
      const teacherIdx = Math.min(
        Math.floor(Math.random() * Math.min(3, suitableTeachers.length)),
        suitableTeachers.length - 1
      );
      const roomIdx = Math.min(
        Math.floor(Math.random() * Math.min(3, suitableRooms.length)),
        suitableRooms.length - 1
      );
      const selectedTeacher = suitableTeachers[teacherIdx];
      const selectedRoom = suitableRooms[roomIdx];

      const day = days[Math.floor(Math.random() * days.length)];
      const slot = timeslots[Math.floor(Math.random() * timeslots.length)];

      if (!isConflict(selectedTeacher.id, selectedRoom.id, day, slot.start)) {
        const entry: Omit<Schedule, "id"> = {
          courseId: course.id,
          teacherId: selectedTeacher.id,
          roomId: selectedRoom.id,
          dayOfWeek: day,
          startTime: slot.start,
          endTime: slot.end,
          semester: term,
          courseName,
          courseCode,
        };
        // Remove any undefined fields (Firestore rejects them)
        const sanitized = Object.fromEntries(
          Object.entries(entry).filter(([, v]) => v !== undefined)
        ) as Omit<Schedule, "id">;
        schedules.push(sanitized);

        // Track load
        teacherLoad[selectedTeacher.id] = (teacherLoad[selectedTeacher.id] || 0) + 1;
        roomUsage[selectedRoom.id] = (roomUsage[selectedRoom.id] || 0) + 1;

        decisions.push({
          courseCode,
          courseName,
          assignedTeacher: getTeacherName(selectedTeacher.id),
          teacherReason: `${teacherReason} Selected "${getTeacherName(selectedTeacher.id)}" (load: ${teacherLoad[selectedTeacher.id]} classes).`,
          assignedRoom: getRoomLabel(selectedRoom.id),
          roomReason,
          day,
          timeSlot: `${slot.start} – ${slot.end}`,
          conflictsAvoided: conflictsHit,
        });

        totalConflictsAvoided += conflictsHit;
        assigned = true;
      } else {
        conflictsHit++;
      }
    }

    if (!assigned) {
      skippedCourses.push({ name: courseName, reason: `Could not find a conflict-free slot after ${attempts} attempts.` });
    }
  }

  // Build friendly summaries
  const teacherLoadSummary: Record<string, number> = {};
  for (const [id, count] of Object.entries(teacherLoad)) {
    teacherLoadSummary[getTeacherName(id)] = count;
  }
  const roomUsageSummary: Record<string, number> = {};
  for (const [id, count] of Object.entries(roomUsage)) {
    roomUsageSummary[getRoomLabel(id)] = count;
  }

  const report: AiScheduleReport = {
    totalCourses: courses.length,
    totalScheduled: schedules.length,
    totalSkipped: skippedCourses.length,
    skippedCourses,
    decisions,
    conflictsAvoided: totalConflictsAvoided,
    teacherLoadSummary,
    roomUsageSummary,
  };

  return { schedules, report };
}
