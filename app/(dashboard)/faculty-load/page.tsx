import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function FacultyLoadPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Faculty Load</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teaching Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Faculty load tracking module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
