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
  updateDoc
} from "firebase/firestore";
import { initializeApp, getApp, getApps } from "firebase/app";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types/firestore.types";

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

  async createManagedUser(data: {
    email: string;
    displayName: string;
    role: 'admin' | 'teacher' | 'student';
    password: string;
    departmentId?: string | null;
  }): Promise<User> {
    const secondaryAuth = getSecondaryAuth();
    
    // 1. Create account in Firebase Auth (using secondary app to avoid logging out admin)
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth, 
      data.email, 
      data.password
    );
    const fbUser = userCredential.user;

    // 2. Set display name in Auth profile
    await updateProfile(fbUser, { displayName: data.displayName });

    // 3. Create profile in Firestore
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

    await setDoc(doc(db, "users", fbUser.uid), newUser);

    // 4. Sign out from secondary auth immediately
    await secondaryAuth.signOut();

    return newUser;
  },

  async deleteUser(userId: string): Promise<void> {
    // Note: This only deletes from Firestore. 
    // Deleting from Auth requires Admin SDK or the user being logged in.
    // For now, we'll mark as inactive or delete from Firestore.
    await deleteDoc(doc(db, "users", userId));
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<void> {
    await updateDoc(doc(db, "users", userId), {
      status,
      updatedAt: serverTimestamp(),
    });
  }
};
