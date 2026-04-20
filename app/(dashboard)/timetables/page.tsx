import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TimetablesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Timetables</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Schedule management module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
