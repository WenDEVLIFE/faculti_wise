"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { getDb } from "@/lib/firebase";
import { mockData } from "@/lib/constants/mockData";
import { TimetableGrid } from "@/features/timetables/components/TimetableGrid";
import { TimetableEntry, DayOfWeek } from "@/lib/types/timetable.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";
import { Calendar, BookOpen, Clock, MapPin, Award, CheckCircle2 } from "lucide-react";

export function StudentScheduleView() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [sectionInfo, setSectionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode fallback with continuous synchronization
      const triggerMockUpdate = () => {
        const mockStudent = mockData.students.find(
          (s) => s.uid === profile.id || s.uid === (profile as any).uid
        );

        if (mockStudent) {
          setStudentInfo(mockStudent);
          const mockSec = mockData.sections.find((s) => s.id === mockStudent.sectionId);
          setSectionInfo(mockSec);

          const sectionName = mockSec?.name || "BSCS-3A";
          // Filter schedules relevant to this student's section
          const filteredSchedules = mockData.schedules.filter(s => {
            if (sectionName === "BSCS-3A") {
              return s.courseId === "CS-101" || s.courseId === "CS-202";
            } else if (sectionName === "BSMATH-2B") {
              return s.courseId === "MATH-101";
            }
            return true;
          });

          const enriched: TimetableEntry[] = filteredSchedules.map(s => {
            const course = mockData.courses.find(c => c.id === s.courseId);
            const room = mockData.rooms.find(r => r.id === s.roomId);
            const matchingUser = mockData.users.find(u => u.id === s.teacherId);
            const teacherDisplayName = matchingUser ? matchingUser.displayName : "Instructor";

            return {
              id: s.id,
              courseCode: s.courseId,
              courseName: course?.name || s.courseId,
              teacherName: teacherDisplayName,
              room: room ? `${room.name} (${room.building})` : s.roomId,
              day: s.dayOfWeek as DayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              type: room?.type === "laboratory" ? "lab" : "lecture",
            };
          });

          setEntries(enriched);
        }
        setLoading(false);
      };

      triggerMockUpdate();
      const interval = setInterval(triggerMockUpdate, 1000);
      return () => clearInterval(interval);
    }

    setLoading(true);
    setError(null);

    // Live Firebase Synced Query Mode
    const studentsRef = collection(db, "students");
    const studentQuery = query(studentsRef, where("uid", "==", profile.id));

    const unsubscribeStudent = onSnapshot(studentQuery, async (snapshot) => {
      try {
        if (!snapshot.empty) {
          const sData = snapshot.docs[0].data();
          setStudentInfo(sData);

          let sectionName = "BSCS-3A";
          if (sData.sectionId) {
            const secSnap = await getDoc(doc(db, "sections", sData.sectionId));
            if (secSnap.exists()) {
              const secData = secSnap.data();
              setSectionInfo(secData);
              sectionName = secData.name || "BSCS-3A";
            }
          }

          // Fetch schedules collection and filter programmatically for the section
          const scheduleQuery = collection(db, "schedules");
          const unsubscribeSchedules = onSnapshot(scheduleQuery, async (schedSnapshot) => {
            const scheduleData = schedSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as any[];

            // Apply section boundaries to schedules matching courses
            const filteredScheds = scheduleData.filter(s => {
              if (sectionName === "BSCS-3A") {
                return s.courseId === "CS-101" || s.courseId === "CS-202";
              } else if (sectionName === "BSMATH-2B") {
                return s.courseId === "MATH-101";
              }
              return true;
            });

            const enrichedEntries: TimetableEntry[] = await Promise.all(
              filteredScheds.map(async (s) => {
                const courseDoc = await getDoc(doc(db, "courses", s.courseId));
                const course = courseDoc.exists() ? courseDoc.data() : null;

                const roomDoc = await getDoc(doc(db, "rooms", s.roomId));
                const room = roomDoc.exists() ? roomDoc.data() : null;

                const userDoc = await getDoc(doc(db, "users", s.teacherId));
                const user = userDoc.exists() ? userDoc.data() : null;

                return {
                  id: s.id,
                  courseCode: s.courseId,
                  courseName: course?.name || s.courseId,
                  teacherName: user?.displayName || "Instructor",
                  room: room ? `${room.name} (${room.building})` : s.roomId,
                  day: s.dayOfWeek as DayOfWeek,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  type: room?.type === "laboratory" ? "lab" : "lecture",
                };
              })
            );

            setEntries(enrichedEntries);
            setLoading(false);
          });

          return () => unsubscribeSchedules();
        } else {
          setError("No matching student profile found for your account.");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error loading student schedule:", err);
        setError("Failed to fetch schedule updates.");
        setLoading(false);
      }
    });

    return () => unsubscribeStudent();
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 bg-surface-alt rounded-2xl" />
        <div className="h-[500px] bg-surface-alt rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-100">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-550 to-violet-600 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white/90">
            Student Timetable
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 font-source-serif">
            My Class Schedule
          </h1>
          <p className="text-white/80 text-sm mt-1 max-w-xl">
            View weekly lectures, laboratory sessions, and assigned classrooms for class section{" "}
            <strong className="text-white underline decoration-wavy decoration-indigo-200">
              {sectionInfo?.name || "BSCS-3A"}
            </strong>.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 self-start md:self-end flex items-center gap-1.5 py-1 px-3">
            <Calendar className="h-3.5 w-3.5" />
            First Semester AY 2024-2025
          </Badge>
          <span className="text-[10px] text-white/70 self-start md:self-end">
            Advisor: {mockData.users.find(u => u.id === sectionInfo?.advisorUid)?.displayName || "Dr. John Smith"}
          </span>
        </div>
      </div>

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-650/10 text-indigo-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Enrolled Courses</p>
                <p className="text-2xl font-bold text-text mt-0.5">{entries.length} Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-650/10 text-teal-650 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Weekly Hours</p>
                <p className="text-2xl font-bold text-text mt-0.5">
                  {(entries.length * 1.5).toFixed(1)} Hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-650/10 text-violet-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Classrooms</p>
                <p className="text-2xl font-bold text-text mt-0.5">
                  {new Set(entries.map(e => e.room)).size} Rooms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Timetable Calendar Grid Card */}
      <Card className="border-none shadow-xl overflow-hidden bg-white/40 backdrop-blur-md">
        <CardContent className="p-0">
          <TimetableGrid entries={entries} />
        </CardContent>
      </Card>

      {/* Schedule Advisory Note */}
      <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 flex items-start gap-4">
        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Student Schedule Advisory</h4>
          <p className="text-sm text-indigo-800/80 leading-relaxed mt-1">
            Weekly class sessions, lectures, and laboratory configurations are published and updated in real-time by the academic registrar. Classroom transfers or room reassignments (e.g. moving from a lecture room to a computer science lab) will trigger instant update alerts on this timetable dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
