import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Rooms & Labs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Room and laboratory management module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
