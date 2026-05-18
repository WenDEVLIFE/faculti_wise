"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Mail, GraduationCap, MapPin, Camera, Pencil, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { mockData } from "@/lib/constants/mockData";

export function StudentPersonalInfo() {
  const { profile } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [programData, setProgramData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;

    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Look up from mockData
      const mockStudent = mockData.students.find(
        (s) => s.uid === profile.id || s.uid === (profile as any).uid
      );
      if (mockStudent) {
        setStudentData(mockStudent);
        const mockProg = mockData.programs.find((p) => p.id === mockStudent.programId);
        setProgramData(mockProg);
        const mockSec = mockData.sections.find((s) => s.id === mockStudent.sectionId);
        setSectionData(mockSec);
      }
      return;
    }

    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("uid", "==", profile.id));

    const unsubscribeStudent = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const sData = snapshot.docs[0].data();
        setStudentData(sData);

        // Fetch/Subscribe to Program in real-time
        if (sData.programId) {
          const progRef = doc(db, "programs", sData.programId);
          onSnapshot(progRef, (progSnap) => {
            if (progSnap.exists()) {
              setProgramData(progSnap.data());
            }
          });
        }

        // Fetch/Subscribe to Section in real-time
        if (sData.sectionId) {
          const secRef = doc(db, "sections", sData.sectionId);
          onSnapshot(secRef, (secSnap) => {
            if (secSnap.exists()) {
              setSectionData(secSnap.data());
            }
          });
        }
      } else {
        setStudentData(null);
      }
    });

    return () => {
      unsubscribeStudent();
    };
  }, [profile]);

  if (!profile) return null;

  const yearSuffix = (year: number) => {
    if (year === 1) return "1st";
    if (year === 2) return "2nd";
    if (year === 3) return "3rd";
    return `${year}th`;
  };

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Pencil className="h-3.5 w-3.5" /> Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.02]">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-16 w-16 text-primary/30" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-strong transition-all scale-0 group-hover:scale-100 duration-200">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text font-source-serif">{profile.displayName}</h2>
            <p className="text-primary font-semibold">
              {programData?.name || "BS Computer Science"} • {studentData?.yearLevel ? `${yearSuffix(studentData.yearLevel)} Year` : "3rd Year"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <GraduationCap className="h-3.5 w-3.5" /> Student ID: {studentData?.studentNo || profile.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Department</p>
            <p className="text-sm font-semibold text-text">
              {programData?.name?.includes("Math") ? "Mathematics Department" : "Computer Science & Engineering"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Major</p>
            <p className="text-sm font-semibold text-text">{studentData?.major || "Software Engineering"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Section</p>
            <p className="text-sm font-semibold text-text">{sectionData?.name || "BSCS-3A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Campus Address</p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-text">
              <MapPin className="h-3.5 w-3.5 text-text-muted" /> {studentData?.campusAddress || "East Wing, Dorm 4"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
