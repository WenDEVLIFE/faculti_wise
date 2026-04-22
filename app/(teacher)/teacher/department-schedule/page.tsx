import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TeacherDepartmentSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Department Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Published Timetables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Department-wide schedule view is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
