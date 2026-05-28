"use client";

import React, { useEffect, useState } from "react";
import { TimetableGrid } from "./components/TimetableGrid";
import { TimetableEntry, DayOfWeek } from "@/lib/types/timetable.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/context/AuthContext";
import { getDb } from "@/lib/firebase";
import { mockData } from "@/lib/constants/mockData";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  addDoc,
  writeBatch
} from "firebase/firestore";
import { Schedule, Course, Room, User } from "@/lib/types/firestore.types";
import { generateAiSchedule, AiScheduleReport } from "@/lib/ai-scheduler";
import { Button } from "@/components/ui/Button";
import { Download, Printer, X, ChevronDown, ChevronUp } from "lucide-react";

interface TimetableViewProps {
  title: string;
  subtitle?: string;
}

export default function TimetableView({ title, subtitle }: TimetableViewProps) {
  const { profile, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<AiScheduleReport | null>(null);
  const [expandedDecision, setExpandedDecision] = useState<number | null>(null);

  useEffect(() => {
    if (!profile || !profile.id || authLoading) return;

    const db = getDb();
    if (!db) {
      // Offline/Demo Mode fallback with continuous synchronization
      const triggerMockUpdate = () => {
        const filteredSchedules = profile.role === 'teacher' 
          ? mockData.schedules.filter(s => s.teacherId === profile.id)
          : mockData.schedules;

        const enriched: TimetableEntry[] = filteredSchedules.map(s => {
          const course = mockData.courses.find(c => c.id === s.courseId);
          const room = mockData.rooms.find(r => r.id === s.roomId);
          
          let teacherDisplayName = profile.displayName;
          if (s.teacherId !== profile.id) {
            const matchingUser = mockData.users.find(u => u.id === s.teacherId);
            teacherDisplayName = matchingUser ? matchingUser.displayName : s.teacherId;
          }

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
        setLoading(false);
      };

      triggerMockUpdate();
      const interval = setInterval(triggerMockUpdate, 1000);
      return () => clearInterval(interval);
    }

    setLoading(true);
    setError(null);

    // 1. Define the query for schedules
    let scheduleQuery;
    if (profile.role === 'teacher') {
      scheduleQuery = query(
        collection(db, "schedules"),
        where("teacherId", "==", profile.id)
      );
    } else if (profile.role === 'student') {
      // In a real app, this would be filtered by section or enrollments
      scheduleQuery = collection(db, "schedules");
    } else {
      scheduleQuery = collection(db, "schedules");
    }

    // 2. Listen to changes in real-time
    const unsubscribe = onSnapshot(scheduleQuery, async (snapshot) => {
      try {
        const scheduleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[];

        // 3. Enrich the data (Courses, Rooms)
        const enrichedEntries: TimetableEntry[] = await Promise.all(
          scheduleData.map(async (s) => {
            const courseDoc = await getDoc(doc(db, "courses", s.courseId));
            const course = courseDoc.exists() ? (courseDoc.data() as Course) : null;

            const roomDoc = await getDoc(doc(db, "rooms", s.roomId));
            const room = roomDoc.exists() ? (roomDoc.data() as Room) : null;

            return {
              id: s.id,
              courseCode: s.courseId,
              courseName: course?.name || s.courseId,
              teacherName: profile.displayName,
              room: room ? `${room.name} (${room.building})` : s.roomId,
              day: s.dayOfWeek as DayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              type: room?.type === "laboratory" ? "lab" : (room?.type as any) || "lecture",
            };
          })
        );

        setEntries(enrichedEntries);
        setLoading(false);
      } catch (err: any) {
        console.error("Error enriching timetable data:", err);
        setError("Failed to process schedule updates.");
        setLoading(false);
      }
    }, (err) => {
      console.error("Schedule subscription error:", err);
      setError("Failed to connect to real-time schedule updates.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile, authLoading]);

  const handleGenerateAiSchedule = async () => {
    if (!profile || profile.role !== "admin") return;
    
    setIsGenerating(true);
    setError(null);
    setAiReport(null);
    try {
      const db = getDb();
      if (!db) {
        // Sandbox fallback: use mock data to generate schedule
        const courses = mockData.courses;
        const users = mockData.users;
        const rooms = mockData.rooms;

        const { schedules: newSchedules, report } = generateAiSchedule(courses, users, rooms);

        if (newSchedules.length === 0) {
           setError("AI could not generate a schedule with the current constraints (e.g. not enough teachers or rooms).");
           setIsGenerating(false);
           return;
        }

        // Simulate short optimization delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save to mockData.schedules in-memory
        mockData.schedules = newSchedules.map((s, index) => ({
          id: `schedule-${Date.now()}-${index}`,
          ...s
        }));

        setAiReport(report);
        return;
      }

      // Fetch all required data
      const coursesSnap = await getDocs(collection(db, "courses"));
      const courses = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Course[];
      
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as User[];
      
      const roomsSnap = await getDocs(collection(db, "rooms"));
      const rooms = roomsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Room[];

      // Generate Schedule
      const { schedules: newSchedules, report } = generateAiSchedule(courses, users, rooms);
      
      if (newSchedules.length === 0) {
         setError("AI could not generate a schedule with the current constraints (e.g. not enough teachers or rooms).");
         setIsGenerating(false);
         return;
      }

      // Save to Firebase using a batch
      const batch = writeBatch(db);
      for (const sched of newSchedules) {
        const newDocRef = doc(collection(db, "schedules"));
        batch.set(newDocRef, sched);
      }
      
      await batch.commit();
      setAiReport(report);
      
    } catch (err: any) {
      console.error("Failed to generate AI schedule:", err);
      setError("Failed to generate AI schedule. Ensure you have valid data in Courses, Users, and Rooms.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCsv = () => {
    if (entries.length === 0) return;
    
    const headers = ["Day", "Start Time", "End Time", "Course Code", "Course Name", "Faculty", "Room", "Type"];
    const rows = entries.map(entry => [
      entry.day,
      entry.startTime,
      entry.endTime,
      entry.courseCode,
      `"${entry.courseName.replace(/"/g, '""')}"`,
      `"${entry.teacherName.replace(/"/g, '""')}"`,
      `"${entry.room.replace(/"/g, '""')}"`,
      entry.type
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `timetable_schedule_${profile?.displayName?.toLowerCase().replace(/\s+/g, '_') || 'export'}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    window.print();
  };

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

      <style>{`
        @media print {
          /* Hide sidebar, header, ai chat drawer and export buttons */
          aside,
          header,
          .no-print,
          button,
          .fixed,
          [class*="Sidebar"],
          [class*="Header"],
          [class*="AiChatDrawer"] {
            display: none !important;
          }
          
          html, body {
            background-color: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          main, 
          .flex-1,
          .mx-auto,
          .max-w-7xl {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }

          .shadow-md, .shadow-lg, .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 0.5rem !important;
          }
        }
      `}</style>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">{title}</h1>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {profile.role === "admin" && (
            <Button 
              onClick={handleGenerateAiSchedule} 
              disabled={isGenerating}
              className="bg-accent hover:bg-accent/90 text-white shadow-md animate-in fade-in zoom-in duration-500 no-print"
            >
              {isGenerating ? "AI is Optimizing..." : "✨ Auto-Schedule with AI"}
            </Button>
          )}

          <Button 
            onClick={handleExportCsv}
            disabled={entries.length === 0}
            variant="secondary"
            className="no-print gap-1.5 h-10 text-xs hover:bg-surface-alt font-manrope border border-border"
          >
            <Download className="h-4 w-4 text-text-muted" />
            Export CSV
          </Button>

          <Button 
            onClick={handleExportPdf}
            disabled={entries.length === 0}
            variant="secondary"
            className="no-print gap-1.5 h-10 text-xs hover:bg-surface-alt font-manrope border border-border"
          >
            <Printer className="h-4 w-4 text-text-muted" />
            Print / PDF
          </Button>

          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 no-print">
            {entries.length > 0 ? entries[0].type.toUpperCase() : "Semester 1, 2026"}
          </Badge>
          <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 no-print">Published</Badge>
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

      {/* AI Loading Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold tracking-tight text-text">AI is Analyzing...</h2>
            <p className="text-text-muted">
              Processing courses, calculating faculty loads, and optimizing room allocations based on your institutional data.
            </p>
          </div>
        </div>
      )}

      {/* AI Report Modal */}
      {aiReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">✨ AI Schedule Report</h2>
                <p className="text-sm text-gray-500 mt-0.5">Here&apos;s why the AI made these decisions</p>
              </div>
              <button onClick={() => { setAiReport(null); setExpandedDecision(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{aiReport.totalScheduled}</div>
                  <div className="text-xs text-emerald-600 font-medium">Scheduled</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700">{aiReport.conflictsAvoided}</div>
                  <div className="text-xs text-amber-600 font-medium">Conflicts Avoided</div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">{aiReport.totalSkipped}</div>
                  <div className="text-xs text-red-600 font-medium">Skipped</div>
                </div>
              </div>

              {/* Skipped courses warning */}
              {aiReport.skippedCourses.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">⚠️ Could Not Schedule</h3>
                  {aiReport.skippedCourses.map((s, i) => (
                    <p key={i} className="text-sm text-red-700"><strong>{s.name}:</strong> {s.reason}</p>
                  ))}
                </div>
              )}

              {/* Per-course decisions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Assignment Decisions</h3>
                <div className="space-y-2">
                  {aiReport.decisions.map((d, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden transition-all">
                      <button
                        onClick={() => setExpandedDecision(expandedDecision === i ? null : i)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-md shrink-0">{d.courseCode}</span>
                          <span className="text-sm font-medium text-gray-800 truncate">{d.courseName}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400">{d.day} {d.timeSlot}</span>
                          {expandedDecision === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>
                      {expandedDecision === i && (
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-50 bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="pt-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">👩‍🏫 Faculty Assignment</p>
                            <p className="text-sm text-gray-800 font-medium">{d.assignedTeacher}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{d.teacherReason}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">🏫 Room Assignment</p>
                            <p className="text-sm text-gray-800 font-medium">{d.assignedRoom}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{d.roomReason}</p>
                          </div>
                          {d.conflictsAvoided > 0 && (
                            <div className="bg-amber-50 rounded-lg px-3 py-2">
                              <p className="text-xs text-amber-700">⚡ {d.conflictsAvoided} conflict(s) were detected and avoided before finding this slot.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Load */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Faculty Load Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(aiReport.teacherLoadSummary).sort(([,a],[,b]) => b - a).map(([name, count]) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-40 truncate" title={name}>{name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                          style={{ width: `${Math.min((count / Math.max(...Object.values(aiReport.teacherLoadSummary))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-12 text-right">{count} cls</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Usage */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Room Usage</h3>
                <div className="space-y-2">
                  {Object.entries(aiReport.roomUsageSummary).sort(([,a],[,b]) => b - a).map(([name, count]) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-40 truncate" title={name}>{name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all"
                          style={{ width: `${Math.min((count / Math.max(...Object.values(aiReport.roomUsageSummary))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-12 text-right">{count} cls</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <Button onClick={() => { setAiReport(null); setExpandedDecision(null); }} className="bg-accent hover:bg-accent/90 text-white">
                Got it, close report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
