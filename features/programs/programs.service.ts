import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Program } from "@/lib/types/department-schedule.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "@/features/audit/audit.service";
import { mockData } from "@/lib/constants/mockData";

export const programsService = {
  subscribePrograms(
    onUpdate: (programs: Program[]) => void
  ): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Immediately callback with mockData
      onUpdate((mockData.programs || []) as unknown as Program[]);
      // Return a dummy unsubscribe
      return () => {};
    }

    const programsRef = collection(db, "programs");
    const q = query(programsRef, orderBy("code", "asc"));

    return onSnapshot(q, (querySnapshot) => {
      const programs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || "",
          name: data.name || "",
          departmentId: data.departmentId || "",
        } as Program;
      });
      onUpdate(programs);
    });
  },

  subscribeProgramsByDepartment(
    departmentId: string,
    onUpdate: (programs: Program[]) => void
  ): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Filter mockData
      const filtered = (mockData.programs || []).filter(
        (p: any) => p.departmentId === departmentId
      ) as unknown as Program[];
      onUpdate(filtered);
      return () => {};
    }

    const programsRef = collection(db, "programs");
    const q = query(
      programsRef,
      where("departmentId", "==", departmentId),
      orderBy("code", "asc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const programs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || "",
          name: data.name || "",
          departmentId: data.departmentId || "",
        } as Program;
      });
      onUpdate(programs);
    });
  },

  async createProgram(
    data: Omit<Program, "id">,
    performingUser?: User
  ): Promise<Program> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Add to mockData
      const newProgram: Program = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      if (!mockData.programs) mockData.programs = [];
      (mockData.programs as any).push(newProgram);
      return newProgram;
    }

    const programsRef = collection(db, "programs");
    const docRef = await addDoc(programsRef, {
      ...data,
      createdAt: serverTimestamp(),
    });

    const newProgram: Program = {
      id: docRef.id,
      ...data,
    };

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: docRef.id,
        targetType: "program",
        details: { code: data.code, name: data.name, departmentId: data.departmentId },
        performedBy: performingUser,
      });
    }

    return newProgram;
  },

  async updateProgram(
    programId: string,
    data: Partial<Program>,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Update in mockData
      const index = (mockData.programs || []).findIndex((p: any) => p.id === programId);
      if (index !== -1) {
        (mockData.programs as any)[index] = {
          ...(mockData.programs as any)[index],
          ...data,
        };
      }
      return;
    }

    const programRef = doc(db, "programs", programId);
    await updateDoc(programRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: programId,
        targetType: "program",
        details: data,
        performedBy: performingUser,
      });
    }
  },

  async deleteProgram(
    programId: string,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Remove from mockData
      const index = (mockData.programs || []).findIndex((p: any) => p.id === programId);
      if (index !== -1) {
        (mockData.programs as any).splice(index, 1);
      }
      return;
    }

    const programRef = doc(db, "programs", programId);
    await deleteDoc(programRef);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: programId,
        targetType: "program",
        details: { action: "deleted" },
        performedBy: performingUser,
      });
    }
  },
};
