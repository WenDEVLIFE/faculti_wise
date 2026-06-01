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
import { Section, Term } from "@/lib/types/section-term.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "@/features/audit/audit.service";
import { mockData } from "@/lib/constants/mockData";

export const sectionsService = {
  subscribeByProgram(
    programId: string,
    onUpdate: (sections: Section[]) => void
  ): () => void {
    const db = getDb();
    if (!db) {
      const filtered = mockData.sections.filter(
        (s) => !programId || s.programId === programId
      );
      onUpdate(filtered as Section[]);
      return () => {};
    }

    const sectionsRef = collection(db, "sections");
    const q = query(
      sectionsRef,
      where("programId", "==", programId)
    );

    return onSnapshot(q, (querySnapshot) => {
      const sections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Section[];
      // Sort sections by name on the client side to avoid composite index requirements
      sections.sort((a, b) => a.name.localeCompare(b.name));
      onUpdate(sections);
    });
  },

  subscribeAll(onUpdate: (sections: Section[]) => void): () => void {
    const db = getDb();
    if (!db) {
      onUpdate(mockData.sections as Section[]);
      return () => {};
    }

    const sectionsRef = collection(db, "sections");
    const q = query(sectionsRef, orderBy("name", "asc"));

    return onSnapshot(q, (querySnapshot) => {
      const sections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Section[];
      onUpdate(sections);
    });
  },

  async createSection(
    data: Omit<Section, "id">,
    performingUser?: User
  ): Promise<Section> {
    const db = getDb();
    if (!db) {
      const newSection: Section = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      (mockData.sections as any).push(newSection);
      return newSection;
    }

    const sectionsRef = collection(db, "sections");
    const docRef = await addDoc(sectionsRef, {
      ...data,
      createdAt: serverTimestamp(),
    });

    const newSection: Section = {
      id: docRef.id,
      ...data,
    };

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: docRef.id,
        targetType: "section",
        details: { name: data.name, programId: data.programId },
        performedBy: performingUser,
      });
    }

    return newSection;
  },

  async updateSection(
    sectionId: string,
    data: Partial<Section>,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      const index = mockData.sections.findIndex((s) => s.id === sectionId);
      if (index !== -1) {
        mockData.sections[index] = {
          ...mockData.sections[index],
          ...data,
        } as any;
      }
      return;
    }

    const sectionRef = doc(db, "sections", sectionId);
    // Filter out undefined values
    const updateData = { ...data };
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    await updateDoc(sectionRef, updateData);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: sectionId,
        targetType: "section",
        details: { name: data.name },
        performedBy: performingUser,
      });
    }
  },

  async deleteSection(
    sectionId: string,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      const index = mockData.sections.findIndex((s) => s.id === sectionId);
      if (index !== -1) {
        mockData.sections.splice(index, 1);
      }
      return;
    }

    const sectionRef = doc(db, "sections", sectionId);
    await deleteDoc(sectionRef);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: sectionId,
        targetType: "section",
        details: { action: "delete" },
        performedBy: performingUser,
      });
    }
  },
};

export const termsService = {
  subscribeAll(onUpdate: (terms: Term[]) => void): () => void {
    const db = getDb();
    if (!db) {
      const terms = mockData.terms || [];
      onUpdate(terms as Term[]);
      return () => {};
    }

    const termsRef = collection(db, "terms");
    const q = query(termsRef, orderBy("academicYear", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const terms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Term[];
      onUpdate(terms);
    });
  },

  async createTerm(
    data: Omit<Term, "id">,
    performingUser?: User
  ): Promise<Term> {
    const db = getDb();
    if (!db) {
      const newTerm: Term = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      if (!mockData.terms) mockData.terms = [];
      (mockData.terms as any).push(newTerm);
      return newTerm;
    }

    const termsRef = collection(db, "terms");
    const docRef = await addDoc(termsRef, {
      ...data,
      createdAt: serverTimestamp(),
    });

    const newTerm: Term = {
      id: docRef.id,
      ...data,
    };

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: docRef.id,
        targetType: "term",
        details: {
          academicYear: data.academicYear,
          semester: data.semester,
        },
        performedBy: performingUser,
      });
    }

    return newTerm;
  },

  async updateTerm(
    termId: string,
    data: Partial<Term>,
    performingUser?: User
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      if (mockData.terms) {
        const index = mockData.terms.findIndex((t) => t.id === termId);
        if (index !== -1) {
          mockData.terms[index] = {
            ...mockData.terms[index],
            ...data,
          } as any;
        }
      }
      return;
    }

    const termRef = doc(db, "terms", termId);
    // Filter out undefined values
    const updateData = { ...data };
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    await updateDoc(termRef, updateData);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: termId,
        targetType: "term",
        details: { academicYear: data.academicYear, semester: data.semester },
        performedBy: performingUser,
      });
    }
  },

  async deleteTerm(termId: string, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      if (mockData.terms) {
        const index = mockData.terms.findIndex((t) => t.id === termId);
        if (index !== -1) {
          mockData.terms.splice(index, 1);
        }
      }
      return;
    }

    const termRef = doc(db, "terms", termId);
    await deleteDoc(termRef);

    if (performingUser) {
      await auditService.logAction({
        action: "SETTINGS_UPDATE",
        targetId: termId,
        targetType: "term",
        details: { action: "delete" },
        performedBy: performingUser,
      });
    }
  },

  async getTeachers(): Promise<User[]> {
    const db = getDb();
    if (!db) {
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
