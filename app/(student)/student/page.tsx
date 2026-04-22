import * as React from "react";
import { 
  BookOpen, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-text font-source-serif">Hello, John Smith</h1>
            <p className="text-text-muted">Third Year • Computer Science • Semester 1</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            View Full Timetable
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatTile
            title="Total Credits"
            value="21.0"
            icon={BookOpen}
            description="Minimum needed: 18.0"
          />
          <StatTile
            title="Weekly Hours"
            value="32h"
            icon={Clock}
            description="Class & Laboratory time"
          />
          <StatTile
            title="Schedule Status"
            value="Published"
            icon={Calendar}
            description="Effective Oct 1, 2024"
            trend={{ value: "Confirmed", positive: true }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Timeline</CardTitle>
              <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                Monday, Oct 22
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 before:content-['']">
              {/* Event 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-600 group-[.is-active]:bg-indigo-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-white shadow-sm ml-4">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-text">Data Structures</div>
                    <time className="text-xs font-semibold text-indigo-600 uppercase">9:00 AM</time>
                  </div>
                  <div className="text-text-muted text-sm flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3" /> Room 201 • Main Bldg
                  </div>
                  <Badge variant="outline" className="text-[10px]">Upcoming</Badge>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-white shadow-sm ml-4 opacity-75">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-text">Database Systems</div>
                    <time className="text-xs font-semibold text-slate-500 uppercase">1:30 PM</time>
                  </div>
                  <div className="text-text-muted text-sm flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3" /> Lab 402 • IT Center
                  </div>
                  <Badge variant="secondary" className="text-[10px]">1h 30m session</Badge>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-white shadow-sm ml-4 opacity-75">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-text">Software Engineering</div>
                    <time className="text-xs font-semibold text-slate-500 uppercase">4:00 PM</time>
                  </div>
                  <div className="text-text-muted text-sm flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3" /> Aud B • Science Bldg
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-between h-auto py-3 px-4 group">
                <div className="text-left">
                  <p className="font-semibold text-sm">Download PDF</p>
                  <p className="text-[10px] text-text-muted italic">Individual Schedule</p>
                </div>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="secondary" className="w-full justify-between h-auto py-3 px-4 group">
                <div className="text-left">
                  <p className="font-semibold text-sm">Department Schedule</p>
                  <p className="text-[10px] text-text-muted italic">View all class sections</p>
                </div>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Helper Teaser */}
          <Card className="bg-indigo-900 border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-20 h-20 text-white" />
            </div>
            <CardContent className="p-6 text-white text-center space-y-4">
              <div className="mx-auto w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">AI Course Planner</p>
                <p className="text-xs text-indigo-200">Get personalized load recommendations based on your major.</p>
              </div>
              <Button size="sm" className="bg-white text-indigo-900 hover:bg-white/90 font-bold px-6">
                Explore Beta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
