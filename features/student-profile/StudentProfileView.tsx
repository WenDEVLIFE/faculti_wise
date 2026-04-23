import React from "react";
import { StudentPersonalInfo } from "./components/StudentPersonalInfo";
import { StudentAcademicOverview } from "./components/StudentAcademicOverview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, Shield, LogOut, ChevronRight, BookOpen } from "lucide-react";

export default function StudentProfileView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">My Profile</h1>
          <p className="text-text-muted mt-1">Manage your student information and track your academic journey.</p>
        </div>
      </div>

      <StudentAcademicOverview />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <StudentPersonalInfo />
          
          <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-surface-alt/30 border-b border-border/50">
              <CardTitle className="text-lg">Recent Academic Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { title: "Grade Published", course: "Data Structures", date: "4 hours ago", status: "high" },
                  { title: "Exam Schedule Updated", course: "Calculus III", date: "Yesterday", status: "neutral" },
                  { title: "Attendance Marked", course: "Physics Lab", date: "2 days ago", status: "neutral" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-surface-alt flex items-center justify-center text-primary border border-border/50">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">{item.title}</p>
                        <p className="text-xs text-text-muted">{item.course} • {item.date}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-all" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-surface-alt/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start gap-3 h-11 border-border/50">
                  <Bell className="h-4 w-4" /> Notification Settings
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-3 h-11 border-border/50">
                  <Shield className="h-4 w-4" /> Privacy Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-danger hover:bg-danger/10 hover:text-danger">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150">
              <BookOpen className="h-24 w-24" />
            </div>
            <CardContent className="p-6 relative z-10 space-y-4">
              <p className="text-sm font-semibold opacity-80">Quick Resources</p>
              <div className="space-y-2">
                <button className="w-full text-left text-xs hover:underline decoration-white/30 flex items-center justify-between">
                  Download Transcript <ChevronRight className="h-3 w-3" />
                </button>
                <button className="w-full text-left text-xs hover:underline decoration-white/30 flex items-center justify-between">
                  Enrollment Certificate <ChevronRight className="h-3 w-3" />
                </button>
                <button className="w-full text-left text-xs hover:underline decoration-white/30 flex items-center justify-between">
                  Academic Calendar <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
