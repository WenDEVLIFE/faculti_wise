import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text font-source-serif">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted italic">Settings and configuration module is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
