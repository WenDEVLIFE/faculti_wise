import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Query,
  QuerySnapshot,
  writeBatch,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { CourseOffering, CourseOfferingWithCourse, OfferingFilter, OfferingStatus } from "@/lib/types/offering.types";
import { Course } from "@/lib/types/course.types";
import { Term } from "@/lib/types/section-term.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "../audit/audit.service";
import { coursesService } from "../courses/courses.service";
import { mockData } from "@/lib/constants/mockData";

// Initialize mock data for offerings if not already present
if (!mockData.courseOfferings) {
  mockData.courseOfferings = [];
}

export const courseOfferingsService = {
  /**
   * Subscribe to course offerings for a specific term with real-time updates
   */
  subscribeOfferingsByTerm(
    termId: string,
    onUpdate: (offerings: CourseOfferingWithCourse[]) => void
  ): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode
      const offeringsForTerm = (mockData.courseOfferings as any[])
        .filter((o) => o.termId === termId)
        .map((o) => this.enrichOfferingWithCourse(o));
      onUpdate(offeringsForTerm);
      return () => {};
    }

    const offeringsRef = collection(db, "courseOfferings");
    const q = query(
      offeringsRef,
      where("termId", "==", termId),
      orderBy("status", "asc"),
      orderBy("courseId", "asc")
    );

    return onSnapshot(q, async (querySnapshot) => {
      const offerings = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const offering = this.parseOfferingDoc(doc);
          return await this.enrichOfferingWithCourse(offering);
        })
      );
      onUpdate(offerings);
    });
  },

  /**
   * Get all offerings for a term (non-real-time)
   */
  async getOfferingsByTerm(termId: string): Promise<CourseOfferingWithCourse[]> {
    const db = getDb();
    if (!db) {
      return (mockData.courseOfferings as any[])
        .filter((o) => o.termId === termId)
        .map((o) => this.enrichOfferingWithCourse(o));
    }

    const offeringsRef = collection(db, "courseOfferings");
    const q = query(offeringsRef, where("termId", "==", termId));
    const snapshot = await getDocs(q);

    const offerings = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const offering = this.parseOfferingDoc(doc);
        return await this.enrichOfferingWithCourse(offering);
      })
    );

    return offerings;
  },

  /**
   * Get all available courses for offering (courses not yet offered in this term)
   */
  async getAvailableCoursesForTerm(
    termId: string,
    allCourses: Course[]
  ): Promise<Course[]> {
    const offerings = await this.getOfferingsByTerm(termId);
    const offeredCourseIds = new Set(offerings.map((o) => o.courseId));

    return allCourses.filter((course) => !offeredCourseIds.has(course.id));
  },

  /**
   * Create a new course offering
   */
  async createOffering(
    data: Omit<CourseOffering, "id" | "createdAt" | "updatedAt">,
    performingUser?: User
  ): Promise<CourseOffering> {
    // Validate that course is not already offered in this term
    const existingOfferings = await this.getOfferingsByTerm(data.termId);
    if (existingOfferings.some((o) => o.courseId === data.courseId)) {
      throw new Error(`Course is already offered in this term`);
    }

    const db = getDb();
    if (!db) {
      // Demo Mode
      const newOffering: CourseOffering = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: performingUser?.uid,
      };
      (mockData.courseOfferings as any).push(newOffering);
      return newOffering;
    }

    const offeringsRef = collection(db, "courseOfferings");
    // Filter out undefined values to avoid Firebase errors
    const documentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: performingUser?.uid,
    };
    // Remove undefined fields
    Object.keys(documentData).forEach(
      (key) => documentData[key as keyof typeof documentData] === undefined && delete documentData[key as keyof typeof documentData]
    );
    const docRef = await addDoc(offeringsRef, documentData);

    const newOffering: CourseOffering = {
      id: docRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: performingUser?.uid,
    };

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: docRef.id,
        targetType: "courseOffering",
        details: { courseId: data.courseId, termId: data.termId, status: data.status },
        performedBy: performingUser,
      });
    }

    return newOffering;
  },

  /**
   * Update an existing course offering
   */
  async updateOffering(
    offeringId: string,
    data: Partial<CourseOffering>,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Demo Mode
      const index = (mockData.courseOfferings as any).findIndex((o) => o.id === offeringId);
      if (index !== -1) {
        (mockData.courseOfferings as any)[index] = {
          ...(mockData.courseOfferings as any)[index],
          ...data,
          updatedAt: new Date(),
        };
      }
      return;
    }

    const offeringRef = doc(db, "courseOfferings", offeringId);
    await updateDoc(offeringRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: offeringId,
        targetType: "courseOffering",
        details: data,
        performedBy: performingUser,
      });
    }
  },

  /**
   * Delete a course offering
   */
  async deleteOffering(offeringId: string, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      // Demo Mode
      const index = (mockData.courseOfferings as any).findIndex((o) => o.id === offeringId);
      if (index !== -1) {
        (mockData.courseOfferings as any).splice(index, 1);
      }
      return;
    }

    const offeringRef = doc(db, "courseOfferings", offeringId);
    await deleteDoc(offeringRef);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: offeringId,
        targetType: "courseOffering",
        details: { deleted: true },
        performedBy: performingUser,
      });
    }
  },

  /**
   * Publish all draft offerings for a term
   */
  async publishOfferingsForTerm(termId: string, performingUser?: User): Promise<void> {
    const db = getDb();
    const offerings = await this.getOfferingsByTerm(termId);
    const draftOfferings = offerings.filter((o) => o.status === "draft");

    if (draftOfferings.length === 0) {
      return;
    }

    if (!db) {
      // Demo Mode
      draftOfferings.forEach((offering) => {
        const index = (mockData.courseOfferings as any).findIndex((o) => o.id === offering.id);
        if (index !== -1) {
          (mockData.courseOfferings as any)[index].status = "published";
        }
      });
      return;
    }

    // Use batch write for atomic operation
    const batch = writeBatch(db);
    draftOfferings.forEach((offering) => {
      const offeringRef = doc(db, "courseOfferings", offering.id);
      batch.update(offeringRef, { status: "published", updatedAt: serverTimestamp() });
    });
    await batch.commit();

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: termId,
        targetType: "term",
        details: { action: "publishOfferings", count: draftOfferings.length },
        performedBy: performingUser,
      });
    }
  },

  /**
   * Get offering statistics for a term
   */
  async getOfferingStats(termId: string): Promise<{
    total: number;
    draft: number;
    published: number;
    archived: number;
    totalUnits: number;
  }> {
    const offerings = await this.getOfferingsByTerm(termId);

    return {
      total: offerings.length,
      draft: offerings.filter((o) => o.status === "draft").length,
      published: offerings.filter((o) => o.status === "published").length,
      archived: offerings.filter((o) => o.status === "archived").length,
      totalUnits: offerings.reduce((sum, o) => sum + o.assignedUnits, 0),
    };
  },

  /**
   * Validate offerings for completeness
   */
  validateOfferings(offerings: CourseOfferingWithCourse[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (offerings.length === 0) {
      errors.push("At least one course must be offered in the term");
    }

    offerings.forEach((offering, index) => {
      if (!offering.courseId) {
        errors.push(`Offering ${index + 1}: Missing course`);
      }
      if (!offering.assignedUnits || offering.assignedUnits <= 0) {
        errors.push(`Offering ${index + 1}: Must have positive assigned units`);
      }
      if (offering.assignedUnits > offering.courseUnits) {
        warnings.push(
          `Offering ${index + 1}: Assigned units (${offering.assignedUnits}) exceed course units (${offering.courseUnits})`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * Helper: Enrich offering with course details
   */
  async enrichOfferingWithCourse(offering: CourseOffering): Promise<CourseOfferingWithCourse> {
    const courseId = offering.courseId;
    let course = null;

    const db = getDb();
    
    // Try to fetch from Firestore first
    if (db) {
      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          const data = courseSnap.data();
          course = {
            id: courseSnap.id,
            code: data.code || "",
            name: data.name || "",
            description: data.description || "",
            units: Number(data.units) || 0,
            lectureHours: Number(data.lectureHours) || 0,
            labHours: Number(data.labHours) || 0,
            category: data.category || "major",
            department: data.department || "",
          } as Course;
        }
      } catch (error) {
        console.error(`Failed to fetch course ${courseId} from Firestore:`, error);
      }
    }

    // Fall back to mockData if not found in Firestore
    if (!course && mockData.courses) {
      // First try exact ID match
      course = (mockData.courses as any).find((c) => c.id === courseId);
      
      // If not found, log for debugging
      if (!course) {
        console.warn(`Course ${courseId} not found in mockData. Available courses:`, 
          (mockData.courses as any).map((c: any) => ({ id: c.id, code: c.code, name: c.name }))
        );
      }
    }

    if (!course) {
      // Fallback for missing course data
      return {
        ...offering,
        courseName: "Unknown Course",
        courseCode: "N/A",
        courseLectureHours: 0,
        courseLabHours: 0,
        courseUnits: 0,
      };
    }

    return {
      ...offering,
      courseName: course.name,
      courseCode: course.code,
      courseLectureHours: course.lectureHours,
      courseLabHours: course.labHours,
      courseUnits: course.units,
    };
  },

  /**
   * Helper: Parse Firestore document to CourseOffering
   */
  parseOfferingDoc(doc: any): CourseOffering {
    const data = doc.data();
    return {
      id: doc.id,
      courseId: data.courseId || "",
      termId: data.termId || "",
      sectionId: data.sectionId,
      maxSlots: data.maxSlots,
      assignedUnits: Number(data.assignedUnits) || 0,
      status: (data.status || "draft") as OfferingStatus,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
    };
  },

  /**
   * Export offerings as CSV
   */
  exportAsCSV(offerings: CourseOfferingWithCourse[]): string {
    const headers = ["Course Code", "Course Name", "Status", "Assigned Units", "Max Slots", "Notes"];
    const rows = offerings.map((o) => [
      o.courseCode,
      o.courseName,
      o.status,
      o.assignedUnits,
      o.maxSlots || "-",
      o.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    return csv;
  },
};
