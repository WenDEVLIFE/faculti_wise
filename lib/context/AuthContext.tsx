"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { getAuthInstance, getDb } from '@/lib/firebase';
import { User as UserProfile } from '@/lib/types/firestore.types';
import { mockData } from '@/lib/constants/mockData';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  setDemoProfile: (role: 'admin' | 'teacher' | 'student') => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
  login: async () => { },
  setDemoProfile: () => { },
  isDemoMode: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemoMode = !getAuthInstance();

  useEffect(() => {
    const auth = getAuthInstance();
    const db = getDb();

    if (!auth) {
      // Local/Sandbox Demo Mode - Restore from localStorage if present
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed.firebaseUser);
            setProfile(parsed.profile);
          } catch (e) {
            console.error("Error parsing demo_user from localStorage", e);
          }
        }
      }
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Clean up previous profile listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user && db) {
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen to profile changes in real-time
        unsubscribeProfile = onSnapshot(userDocRef, async (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as any;
            // Ensure displayName is populated with fallbacks
            if (!userData.displayName) {
              userData.displayName = user.displayName || user.email?.split('@')[0] || 'User';
            }
            setProfile(userData);
            setLoading(false);
          } else {
            // Initial profile for new user if it doesn't exist yet
            const displayNameFallback = user.displayName || user.email?.split('@')[0] || 'User';
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: displayNameFallback,
              photoURL: user.photoURL,
              role: 'student',
              status: 'active',
              departmentId: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            try {
              await setDoc(userDocRef, newProfile);
              // Profile will be set by the next onSnapshot trigger
            } catch (err) {
              console.error("Error creating profile:", err);
              setLoading(false);
            }
          }
        }, (err) => {
          console.error("Profile subscription error:", err);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getAuthInstance();
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Local/Sandbox Demo Login
      const matched = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched && password === 'Password123!') {
        const mockFirebaseUser = {
          uid: matched.uid,
          email: matched.email,
          displayName: matched.displayName,
          emailVerified: true,
        } as any;

        setUser(mockFirebaseUser);
        setProfile(matched);

        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_user', JSON.stringify({
            firebaseUser: mockFirebaseUser,
            profile: matched
          }));
        }
      } else {
        throw new Error(
          "Invalid credentials. Hint: In Sandbox Demo mode, use 'Password123!' with a pre-configured email: 'wwen485@gmail.com' (Admin), 'john.smith@university.edu' (Teacher), or 'alice.brown@university.edu' (Student)."
        );
      }
    }
  };

  const setDemoProfile = (role: 'admin' | 'teacher' | 'student') => {
    const matched = mockData.users.find(u => u.role === role);
    if (matched) {
      const mockFirebaseUser = {
        uid: matched.uid,
        email: matched.email,
        displayName: matched.displayName,
        emailVerified: true,
      } as any;

      setUser(mockFirebaseUser);
      setProfile(matched);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify({
          firebaseUser: mockFirebaseUser,
          profile: matched
        }));
      }

      // Force push router to corresponding dashboard
      const redirectPath =
        role === 'admin' ? '/dashboard' :
        role === 'teacher' ? '/teacher' : '/student';
      window.location.href = redirectPath;
    }
  };

  const signOut = async () => {
    const auth = getAuthInstance();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    
    // Clear demo local state
    setUser(null);
    setProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user');
    }
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, login, setDemoProfile, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

