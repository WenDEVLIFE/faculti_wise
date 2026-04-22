"use client";

import React from "react";
import { Room, RoomStatus } from "@/lib/types/room.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, Cpu, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
}

const statusConfig: Record<RoomStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  occupied: { label: "Occupied", className: "bg-rose-100 text-rose-700 border-rose-200" },
  maintenance: { label: "Maintenance", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-white/80 backdrop-blur-sm">
      <div className={cn(
        "h-1.5 w-full",
        room.status === "available" ? "bg-emerald-500" : 
        room.status === "occupied" ? "bg-rose-500" : "bg-amber-500"
      )} />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-text">
            {room.name}
          </CardTitle>
          <Badge variant="outline" className={statusConfig[room.status].className}>
            {statusConfig[room.status].label}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
          <MapPin className="h-3 w-3" />
          {room.building} • Floor {room.floor}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Capacity</span>
              <span className="text-sm font-bold text-text">{room.capacity} Pax</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {room.type === "laboratory" ? <Cpu className="h-4 w-4 text-primary" /> : <Monitor className="h-4 w-4 text-primary" />}
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Type</span>
              <span className="text-sm font-bold text-text capitalize">{room.type}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Features</p>
          <div className="flex flex-wrap gap-1.5">
            {room.features.map((feature) => (
              <span key={feature} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-text-muted border border-border">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {room.status === "occupied" && room.currentClass && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 mt-2 animate-in fade-in zoom-in duration-300">
            <p className="text-[10px] text-rose-600 uppercase font-bold tracking-wider">Current Class</p>
            <p className="text-sm font-bold text-rose-900 truncate">{room.currentClass}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
