import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Department } from "@/lib/types/department.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "@/features/audit/audit.service";
import { mockData } from "@/lib/constants/mockData";

export const departmentsService = {
  subscribeDepartments(
    onUpdate: (departments: Department[]) => void
  ): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Immediately callback with mockData
      onUpdate(mockData.departments as unknown as Department[]);
      // Return a dummy unsubscribe
      return () => {};
    }

    const departmentsRef = collection(db, "departments");
    const q = query(departmentsRef, orderBy("code", "asc"));

    return onSnapshot(q, (querySnapshot) => {
      const departments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || "",
          name: data.name || "",
          chairUid: data.chairUid || null,
          createdAt: data.createdAt,
        } as Department;
      });
      onUpdate(departments);
    });
  },

  async createDepartment(
    data: Omit<Department, "id">,
    performingUser?: User
  ): Promise<Department> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Add to mockData
      const newDepartment: Department = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      (mockData.departments as any).push(newDepartment);
      return newDepartment;
    }

    const departmentsRef = collection(db, "departments");
    const docRef = await addDoc(departmentsRef, {
      ...data,
      createdAt: serverTimestamp(),
    });

    const newDepartment: Department = {
      id: docRef.id,
      ...data,
    };

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: docRef.id,
        targetType: "department",
        details: { code: data.code, name: data.name },
        performedBy: performingUser,
      });
    }

    return newDepartment;
  },

  async updateDepartment(
    departmentId: string,
    data: Partial<Department>,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Update in mockData
      const index = mockData.departments.findIndex((d) => d.id === departmentId);
      if (index !== -1) {
        mockData.departments[index] = {
          ...mockData.departments[index],
          ...data,
        } as any;
      }
      return;
    }

    const departmentRef = doc(db, "departments", departmentId);
    await updateDoc(departmentRef, {
      ...data,
    });

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: departmentId,
        targetType: "department",
        details: { code: data.code, name: data.name },
        performedBy: performingUser,
      });
    }
  },

  async deleteDepartment(
    departmentId: string,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Delete from mockData
      const index = mockData.departments.findIndex((d) => d.id === departmentId);
      if (index !== -1) {
        mockData.departments.splice(index, 1);
      }
      return;
    }

    const departmentRef = doc(db, "departments", departmentId);
    await deleteDoc(departmentRef);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: departmentId,
        targetType: "department",
        details: { action: "delete" },
        performedBy: performingUser,
      });
    }
  },

  async getTeachers(): Promise<User[]> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Return mock teachers
      return mockData.users.filter((u) => u.role === "teacher");
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "teacher"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  },
};
