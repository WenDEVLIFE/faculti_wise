import React from "react";
import { RoomGrid } from "./components/RoomGrid";
import { Room } from "@/lib/types/room.types";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { Plus, Filter, LayoutGrid, List } from "lucide-react";

async function getRoomsData(): Promise<Room[]> {
  "use cache";
  return [
    {
      id: "1",
      name: "RM-201",
      building: "Main Academic Building",
      floor: 2,
      capacity: 45,
      type: "lecture",
      status: "occupied",
      features: ["Smart Board", "Air Conditioning", "PA System"],
      currentClass: "CS101: Intro to Computer Science",
    },
    {
      id: "2",
      name: "LAB-102",
      building: "Innovation Center",
      floor: 1,
      capacity: 30,
      type: "laboratory",
      status: "available",
      features: ["High-end PCs", "Dual Monitors", "Fiber Internet"],
    },
    {
      id: "3",
      name: "AUD-B",
      building: "Science Hall",
      floor: 1,
      capacity: 120,
      type: "auditorium",
      status: "available",
      features: ["Projector", "Sound System", "Stage"],
    },
    {
      id: "4",
      name: "SEM-404",
      building: "Research Tower",
      floor: 4,
      capacity: 20,
      type: "seminar",
      status: "maintenance",
      features: ["Video Conferencing", "Glass Board"],
    },
    {
      id: "5",
      name: "RM-305",
      building: "Main Academic Building",
      floor: 3,
      capacity: 50,
      type: "lecture",
      status: "occupied",
      features: ["Smart Board", "AC"],
      currentClass: "MATH202: Calculus II",
    },
    {
      id: "6",
      name: "LAB-205",
      building: "Innovation Center",
      floor: 2,
      capacity: 25,
      type: "laboratory",
      status: "occupied",
      features: ["iMacs", "Graphic Tablets"],
      currentClass: "ART110: Digital Arts",
    },
  ];
}

export default async function RoomsView() {
  const rooms = await getRoomsData();
  
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">Rooms & Labs</h1>
          <p className="text-text-muted mt-1">Monitor and manage physical resources and laboratory environments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md">
            <Plus className="h-4 w-4" /> Add Room
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatTile title="Total Resources" value={stats.total.toString()} icon={LayoutGrid} />
        <StatTile title="Available Now" value={stats.available.toString()} icon={LayoutGrid} />
        <StatTile title="Currently Occupied" value={stats.occupied.toString()} icon={LayoutGrid} />
        <StatTile title="In Maintenance" value={stats.maintenance.toString()} icon={LayoutGrid} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2 border-border/50">
            <Filter className="h-4 w-4" /> Filter by Building
          </Button>
          <Button variant="secondary" className="gap-2 border-border/50">
            <Filter className="h-4 w-4" /> Room Type
          </Button>
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-alt/50 rounded-lg border border-border">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white shadow-sm border border-border">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-text-muted">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RoomGrid rooms={rooms} />
    </div>
  );
}
