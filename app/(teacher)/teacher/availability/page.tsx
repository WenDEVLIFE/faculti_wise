import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Availability Submission</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teaching Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Availability selection UI is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
