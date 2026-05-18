"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Mail, MapPin, Camera, Pencil, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { mockData } from "@/lib/constants/mockData";

export function TeacherPersonalInfo() {
  const { profile } = useAuth();
  const [teacherData, setTeacherData] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;

    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Look up from mockData
      const mockTeacher = mockData.teachers.find(
        (t) => t.uid === profile.id || t.uid === (profile as any).uid
      );
      if (mockTeacher) {
        setTeacherData(mockTeacher);
      } else {
        setTeacherData(null);
      }
      return;
    }

    const teachersRef = collection(db, "teachers");
    const q = query(teachersRef, where("uid", "==", profile.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setTeacherData(snapshot.docs[0].data());
        } else {
          setTeacherData(null);
        }
      },
      (err) => {
        console.error("Error subscribing to teacher data in real-time:", err);
      }
    );

    return () => unsubscribe();
  }, [profile]);

  if (!profile) return null;

  const getJoiningDate = () => {
    if (!profile.createdAt) return "N/A";
    const date = profile.createdAt.toDate
      ? profile.createdAt.toDate()
      : new Date(profile.createdAt.seconds ? profile.createdAt.seconds * 1000 : profile.createdAt);
    return date.toLocaleDateString();
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
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} • {teacherData?.designation || profile.departmentId || "General"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                <MapPin className="h-3.5 w-3.5" /> {profile.status === 'active' ? "Active" : "Inactive"}
              </div>
              {teacherData?.officeLocation && (
                <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-alt/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Briefcase className="h-3.5 w-3.5" /> {teacherData.officeLocation}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Specialization</p>
            <p className="text-sm font-semibold text-text">{teacherData?.specialization || "Not specified"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Employment Type</p>
            <p className="text-sm font-semibold text-text">{teacherData?.employmentType || "Not specified"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Joining Date</p>
            <p className="text-sm font-semibold text-text">
              {getJoiningDate()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Employee ID</p>
            <p className="text-sm font-semibold text-text">{teacherData?.employeeNo || profile.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
