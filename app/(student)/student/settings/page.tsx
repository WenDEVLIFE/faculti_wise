import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Info & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Profile management module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
