import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { FacultyMember, LoadAssignment } from "@/lib/types/faculty-load.types";

export const facultyLoadService = {
  /**
   * Subscribe to real-time faculty load data from Firebase
   * Calculates total units from schedules and determines load status
   */
  subscribeFacultyLoad(onUpdate: (faculty: FacultyMember[]) => void): () => void {
    const db = getDb();

    if (!db) {
      // Demo/Sandbox mode - return empty array (no fallback to mockData)
      console.warn("No Firestore connection available");
      onUpdate([]);
      return () => {};
    }

    // Firebase real-time subscription
    const scheduleUnsubscribe = onSnapshot(
      collection(db, "schedules"),
      async () => {
        try {
          // Get all users with teacher role
          const usersRef = collection(db, "users");
          const teacherQuery = query(usersRef, where("role", "==", "teacher"));
          const usersSnapshot = await getDocs(teacherQuery);
          const teachers = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Get all schedules
          const schedulesSnapshot = await getDocs(collection(db, "schedules"));
          const schedules = schedulesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Get courses for unit calculation
          const coursesSnapshot = await getDocs(collection(db, "courses"));
          const coursesMap = new Map();
          coursesSnapshot.docs.forEach((doc) => {
            coursesMap.set(doc.id, { id: doc.id, ...doc.data() });
          });

          // Get departments
          const deptsSnapshot = await getDocs(collection(db, "departments"));
          const deptsMap = new Map();
          deptsSnapshot.docs.forEach((doc) => {
            deptsMap.set(doc.id, { id: doc.id, ...doc.data() });
          });

          // Calculate faculty load
          const facultyMap = new Map<string, FacultyMember>();

          (teachers as any[]).forEach((teacher) => {
            const targetUnits = 18; // Default target
            facultyMap.set(teacher.id, {
              id: teacher.id,
              name: teacher.displayName || teacher.email || "Unknown",
              department: deptsMap.get(teacher.departmentId)?.name || "Unknown",
              designation: teacher.designation || "Faculty",
              totalUnits: 0,
              targetUnits,
              status: "normal",
              assignments: [],
            });
          });

          // Accumulate units from schedules
          (schedules as any[]).forEach((schedule) => {
            const faculty = facultyMap.get(schedule.teacherId);
            if (faculty) {
              const course = coursesMap.get(schedule.courseId);
              if (course) {
                const units = course.units || 3;
                faculty.totalUnits += units;
                faculty.assignments.push({
                  courseCode: course.code || "",
                  courseName: course.name,
                  units,
                  section: schedule.sectionId || "A",
                });
              }
            }
          });

          // Determine load status
          facultyMap.forEach((faculty) => {
            if (faculty.totalUnits > faculty.targetUnits + 3) {
              faculty.status = "overloaded";
            } else if (faculty.totalUnits < faculty.targetUnits - 3) {
              faculty.status = "underloaded";
            } else {
              faculty.status = "normal";
            }
          });

          onUpdate(Array.from(facultyMap.values()));
        } catch (err) {
          console.error("Error calculating faculty load:", err);
          onUpdate([]);
        }
      }
    );

    return scheduleUnsubscribe;
  },

  /**
   * Create a new assignment for a faculty member
   */
  async createAssignment(
    teacherId: string,
    courseId: string,
    roomId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    sectionId?: string
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Demo mode
      const schedule: any = {
        id: Math.random().toString(36).substr(2, 9),
        teacherId,
        courseId,
        roomId,
        dayOfWeek,
        startTime,
        endTime,
        sectionId: sectionId || "A",
        createdAt: new Date(),
      };
      if (!mockData.schedules) mockData.schedules = [];
      mockData.schedules.push(schedule);
      return;
    }

    const schedulesRef = collection(db, "schedules");
    await addDoc(schedulesRef, {
      teacherId,
      courseId,
      roomId,
      dayOfWeek,
      startTime,
      endTime,
      sectionId: sectionId || "A",
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Export faculty load as CSV
   */
  exportAsCSV(faculty: FacultyMember[]): string {
    const headers = [
      "Faculty Member",
      "Designation",
      "Department",
      "Total Units",
      "Target Units",
      "Status",
      "Assignments",
    ];

    const rows = faculty.map((member) => [
      member.name,
      member.designation,
      member.department,
      member.totalUnits.toString(),
      member.targetUnits.toString(),
      member.status,
      member.assignments
        .map((a) => `${a.courseName} (${a.units} units)`)
        .join("; "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return csvContent;
  },

  /**
   * Download faculty load as CSV file
   */
  downloadAsCSV(faculty: FacultyMember[]): void {
    const csv = this.exportAsCSV(faculty);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `faculty-load-${new Date().toISOString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Get all teachers from Firebase (no mockData fallback)
   */
  async getTeachers(): Promise<any[]> {
    const db = getDb();
    
    try {
      if (!db) {
        console.warn("No Firestore connection - no teachers available");
        return [];
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "teacher"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName || doc.data().email || "Unknown Teacher",
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error fetching teachers:", err);
      return [];
    }
  },

  /**
   * Get all courses from Firebase (no mockData fallback)
   */
  async getCourses(): Promise<any[]> {
    const db = getDb();
    
    try {
      if (!db) {
        console.warn("No Firestore connection - no courses available");
        return [];
      }

      const coursesRef = collection(db, "courses");
      const querySnapshot = await getDocs(coursesRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        code: doc.data().code || "",
        name: doc.data().name || "Unknown Course",
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error fetching courses:", err);
      return [];
    }
  },

  /**
   * Get all rooms from Firebase (no mockData fallback)
   */
  async getRooms(): Promise<any[]> {
    const db = getDb();
    
    try {
      if (!db) {
        console.warn("No Firestore connection - no rooms available");
        return [];
      }

      const roomsRef = collection(db, "rooms");
      const querySnapshot = await getDocs(roomsRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unknown Room",
        building: doc.data().building || "",
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error fetching rooms:", err);
      return [];
    }
  },
};
