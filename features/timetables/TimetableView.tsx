"use client";

import React, { useEffect, useState } from "react";
import { TimetableGrid } from "./components/TimetableGrid";
import { TimetableEntry, DayOfWeek } from "@/lib/types/timetable.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/context/AuthContext";
import { getDb } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { Schedule, Course, Room } from "@/lib/types/firestore.types";

interface TimetableViewProps {
  title: string;
  subtitle?: string;
}

export default function TimetableView({ title, subtitle }: TimetableViewProps) {
  const { profile, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!profile) return;

      const db = getDb();
      if (!db) {
        setError("Firebase database not initialized");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Fetch schedules for this user
        // If teacher, fetch by teacherId. If student, we'd need enrollments (for now let's assume teacher)
        let scheduleQuery;
        if (profile.role === 'teacher') {
          scheduleQuery = query(
            collection(db, "schedules"),
            where("teacherId", "==", profile.id)
          );
        } else if (profile.role === 'student') {
          // For MVP, if they are student, maybe they see all schedules for their section?
          // Since we don't have enrollments yet, let's just fetch all or specific if possible.
          scheduleQuery = collection(db, "schedules"); // Temporary: fetch all for students
        } else {
          scheduleQuery = collection(db, "schedules");
        }

        const scheduleSnap = await getDocs(scheduleQuery);
        const scheduleData = scheduleSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[];

        // 2. Fetch related data (Courses, Rooms) to enrich the display
        // We do this in parallel or as needed. For simplicity, let's map them.
        const enrichedEntries: TimetableEntry[] = await Promise.all(
          scheduleData.map(async (s) => {
            // Fetch Course
            const courseDoc = await getDoc(doc(db, "courses", s.courseId));
            const course = courseDoc.exists() ? (courseDoc.data() as Course) : null;

            // Fetch Room
            const roomDoc = await getDoc(doc(db, "rooms", s.roomId));
            const room = roomDoc.exists() ? (roomDoc.data() as Room) : null;

            return {
              id: s.id,
              courseCode: s.courseId,
              courseName: course?.name || s.courseId,
              teacherName: profile.displayName, // Current user is the teacher
              room: room ? `${room.name} (${room.building})` : s.roomId,
              day: s.dayOfWeek as DayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              type: room?.type === "laboratory" ? "lab" : (room?.type as any) || "lecture",
            };
          })
        );

        setEntries(enrichedEntries);
      } catch (err: any) {
        console.error("Error fetching timetable:", err);
        setError("Failed to load timetable data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && profile) {
      fetchData();
    } else if (!authLoading && !profile) {
      setLoading(false);
    }
  }, [profile, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-surface-alt rounded-xl" />
        <div className="h-[500px] bg-surface-alt rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-amber-600 font-medium">Please log in to view your schedule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">{title}</h1>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {entries.length > 0 ? entries[0].type.toUpperCase() : "Semester 1, 2026"}
          </Badge>
          <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">Published</Badge>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white/40 backdrop-blur-md">
        <CardContent className="p-0">
          <TimetableGrid entries={entries} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/30 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 uppercase tracking-wider">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{entries.length} Classes</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Lectures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {entries.filter(e => e.type === "lecture").length} Sessions
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/30 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 uppercase tracking-wider">Labs / Practicals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {entries.filter(e => e.type === "lab").length} Sessions
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
