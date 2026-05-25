import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Course } from "@/lib/types/course.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "../audit/audit.service";
import { mockData } from "@/lib/constants/mockData";

export const coursesService = {
  subscribeCourses(onUpdate: (courses: Course[]) => void): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Immediately callback with mockData
      onUpdate(mockData.courses as unknown as Course[]);
      // Return a dummy unsubscribe
      return () => {};
    }

    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("code", "asc"));
    
    return onSnapshot(q, (querySnapshot) => {
      const courses = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || "",
          name: data.name || "",
          description: data.description || "",
          units: Number(data.units) || 0,
          lectureHours: Number(data.lectureHours) || 0,
          labHours: Number(data.labHours) || 0,
          category: data.category || "major",
          department: data.department || "",
        } as Course;
      });
      onUpdate(courses);
    });
  },

  async createCourse(data: Omit<Course, 'id'>, performingUser?: User): Promise<Course> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Add to mockData
      const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      (mockData.courses as any).push(newCourse);
      return newCourse;
    }

    const coursesRef = collection(db, "courses");
    const docRef = await addDoc(coursesRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newCourse: Course = {
      id: docRef.id,
      ...data,
    };

    // Keep mockData in sync for fallback lookups
    (mockData.courses as any).push(newCourse);

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE', // Using settings update for catalog changes
        targetId: docRef.id,
        targetType: 'course',
        details: { code: data.code, name: data.name },
        performedBy: performingUser
      });
    }

    return newCourse;
  },

  async updateCourse(courseId: string, data: Partial<Course>, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Update in mockData
      const index = mockData.courses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        mockData.courses[index] = {
          ...mockData.courses[index],
          ...data,
        } as any;
      }
      return;
    }

    const courseRef = doc(db, "courses", courseId);
    // Filter out undefined values
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    await updateDoc(courseRef, updateData);

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE',
        targetId: courseId,
        targetType: 'course',
        details: { code: data.code, name: data.name },
        performedBy: performingUser
      });
    }
  },

  async deleteCourse(courseId: string, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Delete from mockData
      const index = mockData.courses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        mockData.courses.splice(index, 1);
      }
      return;
    }

    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE',
        targetId: courseId,
        targetType: 'course',
        details: { action: 'delete' },
        performedBy: performingUser
      });
    }
  }
};
