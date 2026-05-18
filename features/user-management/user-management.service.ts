import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  deleteUser,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  collection, 
  doc, 
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
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDb } from "@/lib/firebase";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "../audit/audit.service";

// Secondary Firebase app for administrative user creation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const getSecondaryAuth = () => {
  const secondaryAppName = "AdminUserManagement";
  const app = getApps().find(a => a.name === secondaryAppName) 
    || initializeApp(firebaseConfig, secondaryAppName);
  return getAuth(app);
};

export const userManagementService = {
  async fetchUsers(): Promise<User[]> {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        displayName: data.displayName || data.name || "Unknown User",
        email: data.email || "",
      } as User;
    });
  },

  subscribeUsers(onUpdate: (users: User[]) => void): () => void {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    
    return onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          displayName: data.displayName || data.name || "Unknown User",
          email: data.email || "",
        } as User;
      });
      onUpdate(users);
    });
  },

  async createManagedUser(data: {
    email: string;
    displayName: string;
    role: 'admin' | 'teacher' | 'student';
    password: string;
    departmentId?: string | null;
  }, performingUser?: User): Promise<User> {
    // 1. Validation
    if (!data.displayName || data.displayName.trim() === "") {
      throw new Error("Display name is required.");
    }

    if (!data.email || !data.email.includes("@")) {
      throw new Error("A valid email address is required.");
    }

    const secondaryAuth = getSecondaryAuth();
    
    try {
      // 2. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        data.email, 
        data.password
      );
      const fbUser = userCredential.user;

      // 3. Set display name in Auth profile
      await updateProfile(fbUser, { displayName: data.displayName });

      // 4. Create profile in Firestore
      const newUser: User = {
        id: fbUser.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        status: 'active',
        departmentId: data.departmentId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const db = getDb();
      if (!db) {
        throw new Error("Firestore not initialized");
      }
      await setDoc(doc(db, "users", fbUser.uid), newUser);

      // 5. Sign out from secondary auth
      await secondaryAuth.signOut();

      // 6. Audit Log
      if (performingUser) {
        await auditService.logAction({
          action: 'USER_CREATE',
          targetId: newUser.id,
          targetType: 'user',
          details: { role: newUser.role, email: newUser.email },
          performedBy: performingUser
        });
      }

      return newUser;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("This email is already registered.");
      }
      if (error.code === 'auth/weak-password') {
        throw new Error("The password is too weak.");
      }
      throw error;
    }
  },

  async deleteUser(userId: string, performingUser?: User): Promise<void> {
    // Note: This only deletes from Firestore. 
    // Deleting from Auth requires Admin SDK or the user being logged in.
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    await deleteDoc(doc(db, "users", userId));

    if (performingUser) {
      await auditService.logAction({
        action: 'USER_DELETE',
        targetId: userId,
        targetType: 'user',
        details: { },
        performedBy: performingUser
      });
    }
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive', performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    await updateDoc(doc(db, "users", userId), {
      status,
      updatedAt: serverTimestamp(),
    });

    if (performingUser) {
      await auditService.logAction({
        action: 'USER_STATUS_CHANGE',
        targetId: userId,
        targetType: 'user',
        details: { status },
        performedBy: performingUser
      });
    }
  },

  async updateUserRole(userId: string, role: 'admin' | 'teacher' | 'student', performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    await updateDoc(doc(db, "users", userId), {
      role,
      updatedAt: serverTimestamp(),
    });

    if (performingUser) {
      await auditService.logAction({
        action: 'USER_ROLE_CHANGE',
        targetId: userId,
        targetType: 'user',
        details: { role },
        performedBy: performingUser
      });
    }
  }
};

