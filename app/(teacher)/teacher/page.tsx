import * as React from "react";
import { 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RealtimeTeacherDashboard } from "@/features/teacher-profile/RealtimeTeacherDashboard";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome & Overview Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text font-source-serif">Welcome</h1>
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
      </div>

      {/* Real-time Dashboard Content */}
      <RealtimeTeacherDashboard />
    </div>
  );
}
