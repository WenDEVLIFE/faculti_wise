import * as React from "react";
import { 
  AlertTriangle, 
  Calendar, 
  Users, 
  Zap, 
  CheckCircle2, 
  Clock, 
  History,
  MoreVertical,
  Plus
} from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero / KPI Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text font-source-serif">Operations Dashboard</h1>
            <p className="text-text-muted mt-1">Academic Year 2024-2025 • First Semester</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule Run
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatTile
            title="Schedule Conflicts"
            value="12"
            icon={AlertTriangle}
            description="Across all departments"
            trend={{ value: "-4 from last run", positive: true }}
          />
          <StatTile
            title="Unassigned Classes"
            value="8"
            icon={Calendar}
            description="Waitlisted for faculty"
            trend={{ value: "+2 new courses", positive: false }}
          />
          <StatTile
            title="Overloaded Faculty"
            value="5"
            icon={Users}
            description="Exceeding unit limit"
            trend={{ value: "Stable", positive: true }}
          />
          <StatTile
            title="Optimization Score"
            value="94.2%"
            icon={Zap}
            description="Overall efficiency"
            trend={{ value: "+1.2% improvement", positive: true }}
          />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Schedule Health Overview */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule Health Overview</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Room Utilization</span>
                  <span className="text-text-muted">78%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Faculty Preference Match</span>
                  <span className="text-text-muted">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Constraint Compliance</span>
                  <span className="text-text-muted">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-6">
              <h4 className="text-sm font-semibold mb-4 font-manrope">Department Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-surface">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span className="text-sm">Computer Science</span>
                  <Badge variant="success" className="ml-auto text-[10px]">Balanced</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-surface">
                  <div className="h-2 w-2 rounded-full bg-warning"></div>
                  <span className="text-sm">Information Tech</span>
                  <Badge variant="warning" className="ml-auto text-[10px]">Conflicts</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-surface">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span className="text-sm">Engineering</span>
                  <Badge variant="success" className="ml-auto text-[10px]">Balanced</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-surface">
                  <div className="h-2 w-2 rounded-full bg-info"></div>
                  <span className="text-sm">Humanities</span>
                  <Badge variant="info" className="ml-auto text-[10px]">Reviewing</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Optimization run completed</p>
                  <p className="text-xs text-text-muted">V2.4 generated with 0 hard conflicts.</p>
                  <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    10 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Schedule Published</p>
                  <p className="text-xs text-text-muted">CS Department schedule is now live.</p>
                  <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium">Critical Conflict Detected</p>
                  <p className="text-xs text-text-muted">Room L302 double-booked at 10 AM.</p>
                  <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-surface-alt flex items-center justify-center">
                  <History className="h-4 w-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium">Faculty availability updated</p>
                  <p className="text-xs text-text-muted">Dr. Aris added preferred afternoon slots.</p>
                  <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Yesterday
                  </p>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary text-xs">
              View Activity Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
