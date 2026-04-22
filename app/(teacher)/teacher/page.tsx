import * as React from "react";
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome & Overview Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text font-source-serif">Welcome, Prof. Doe</h1>
            <p className="text-text-muted mt-1">First Semester • AY 2024-2025</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              Download Schedule (PDF)
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Update Availability
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatTile
            title="Total Assigned Units"
            value="18"
            icon={BookOpen}
            description="Target load: 18 units"
            trend={{ value: "Target met", positive: true }}
          />
          <StatTile
            title="Pending Availability"
            value="Submitted"
            icon={Clock}
            description="Last updated 2 days ago"
          />
          <StatTile
            title="Teaching Hours"
            value="24h"
            icon={Calendar}
            description="Per week"
          />
          <StatTile
            title="Schedule Status"
            value="Finalized"
            icon={CheckCircle2}
            description="Published by Dean"
            trend={{ value: "Active", positive: true }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Your Next Class */}
        <Card className="lg:col-span-3">
          <CardHeader className="bg-teal-600 border-none pb-8 text-white rounded-t-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-teal-50 uppercase tracking-[0.2em] text-[10px] font-bold">Upcoming Session</p>
                <CardTitle className="text-white mt-1">Software Engineering 1</CardTitle>
              </div>
              <Badge className="bg-white/20 border-none text-white backdrop-blur-sm">In 45 mins</Badge>
            </div>
          </CardHeader>
          <CardContent className="-mt-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-border space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-text">1:30 PM - 3:00 PM</p>
                  <p className="text-text-muted text-xs">Monday, Oct 22</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-text">Laboratory 402</p>
                  <p className="text-text-muted text-xs">Innovation Building</p>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-2">
                Launch Session Materials
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Load Summary */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Teaching Load Summary</CardTitle>
              <Button variant="ghost" className="text-teal-600 text-xs">View Full Details</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-surface-alt/50 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-teal-600">CS</div>
                  <div>
                    <p className="text-sm font-semibold">CS 312: Algorithms</p>
                    <p className="text-xs text-text-muted">3 Units • 3 Sections</p>
                  </div>
                </div>
                <Badge variant="outline">Mon/Wed/Fri</Badge>
              </div>
              <div className="p-4 rounded-lg border border-border bg-surface-alt/50 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-teal-600">SE</div>
                  <div>
                    <p className="text-sm font-semibold">SE 101: Intro to SE</p>
                    <p className="text-xs text-text-muted">3 Units • 2 Sections</p>
                  </div>
                </div>
                <Badge variant="outline">Tue/Thu</Badge>
              </div>
              <div className="p-4 rounded-lg border border-border bg-surface-alt/50 flex justify-between items-center opacity-70">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-text-muted">AD</div>
                  <div>
                    <p className="text-sm font-semibold">Departmental Advisory</p>
                    <p className="text-xs text-text-muted">Administrative Load</p>
                  </div>
                </div>
                <Badge variant="outline">Wednesday</Badge>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800">
                Next semester's availability window is currently <strong>open</strong>. Please submit your preferences before Oct 30.
              </p>
              <ArrowRight className="h-4 w-4 text-amber-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
