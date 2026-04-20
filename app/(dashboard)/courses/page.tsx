import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Courses</h1>
      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Course management module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
