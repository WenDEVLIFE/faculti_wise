import React from "react";
import { AvailabilityGrid } from "./components/AvailabilityGrid";
import { AvailabilityLegend } from "./components/AvailabilityLegend";
import { Button } from "@/components/ui/Button";
import { Info, Save, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AvailabilityStatus } from "@/lib/types/availability.types";

async function getInitialAvailability() {
  "use cache";
  // Simulated initial data
  return {
    "Monday-9": "preferred",
    "Monday-10": "preferred",
    "Wednesday-14": "available",
    "Friday-16": "available",
  };
}

export default async function AvailabilityView() {
  const initialSlots = await getInitialAvailability() as Record<string, AvailabilityStatus>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Availability Submission</h1>
          <p className="text-text-muted mt-1">Specify your preferred teaching hours and availability constraints for the next semester.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md">
            <Save className="h-4 w-4" /> Save Preferences
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AvailabilityLegend />
          <AvailabilityGrid initialSlots={initialSlots} />
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="bg-surface-alt/30 border-b border-border/50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">1</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Click on a slot to cycle through statuses: <br/>
                    <span className="font-bold text-text">Available &rarr; Preferred &rarr; Unavailable</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">2</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Preferred slots are given priority during the automated scheduling process.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">3</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Ensure at least 18 hours are marked as &quot;Available&quot; or &quot;Preferred&quot;.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-primary/5 shadow-sm overflow-hidden border-dashed">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-primary/20 flex items-center justify-center shadow-sm">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Deadline</p>
                <p className="text-sm font-bold text-text">April 30, 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
