import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">My Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Individual class grid view is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
