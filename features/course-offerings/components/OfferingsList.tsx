"use client";

import React from "react";
import { CourseOfferingWithCourse, OfferingStatus } from "@/lib/types/offering.types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trash2, FileText } from "lucide-react";

interface OfferingsListProps {
  offerings: CourseOfferingWithCourse[];
  onDelete: (offeringId: string) => void;
  onStatusChange?: (offeringId: string, newStatus: OfferingStatus) => void;
}

const statusConfig: Record<OfferingStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-blue-700", bgColor: "bg-blue-50" },
  published: { label: "Published", color: "text-emerald-700", bgColor: "bg-emerald-50" },
  archived: { label: "Archived", color: "text-gray-700", bgColor: "bg-gray-50" },
};

export function OfferingsList({ offerings, onDelete, onStatusChange }: OfferingsListProps) {
  const handleStatusClick = (offeringId: string, currentStatus: OfferingStatus) => {
    if (!onStatusChange) return;
    
    // Cycle through statuses: draft -> published -> archived -> draft
    const statusSequence: OfferingStatus[] = ["draft", "published", "archived"];
    const currentIndex = statusSequence.indexOf(currentStatus);
    const nextStatus = statusSequence[(currentIndex + 1) % statusSequence.length];
    
    onStatusChange(offeringId, nextStatus);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text mb-4">Course Offerings</h3>

      {/* Table View on Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Course Name</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Units</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Assigned</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">Notes</th>
              <th className="text-right px-4 py-3 font-semibold text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offerings.map((offering) => (
              <tr
                key={offering.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-text">{offering.courseCode}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-text">{offering.courseName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-text-muted">{offering.courseUnits}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-primary">{offering.assignedUnits}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusClick(offering.id, offering.status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition ${
                      statusConfig[offering.status].bgColor
                    } ${statusConfig[offering.status].color} hover:opacity-80`}
                  >
                    {statusConfig[offering.status].label}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {offering.notes ? (
                    <div className="flex items-center gap-1 text-text-muted group relative">
                      <FileText className="w-4 h-4" />
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        {offering.notes}
                      </div>
                    </div>
                  ) : (
                    <span className="text-text-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onDelete(offering.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete offering"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View on Mobile */}
      <div className="md:hidden space-y-3">
        {offerings.map((offering) => (
          <Card key={offering.id} className="hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text">{offering.courseCode}</p>
                    <p className="text-sm text-text-muted">{offering.courseName}</p>
                  </div>
                  <button
                    onClick={() => onDelete(offering.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-text-muted">Total Units</p>
                    <p className="font-medium text-text">{offering.courseUnits}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Assigned Units</p>
                    <p className="font-medium text-primary">{offering.assignedUnits}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Lecture</p>
                    <p className="font-medium text-text">{offering.courseLectureHours}h</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Lab</p>
                    <p className="font-medium text-text">{offering.courseLabHours}h</p>
                  </div>
                </div>

                {/* Status */}
                <button
                  onClick={() => handleStatusClick(offering.id, offering.status)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
                    statusConfig[offering.status].bgColor
                  } ${statusConfig[offering.status].color} hover:opacity-80`}
                >
                  {statusConfig[offering.status].label}
                </button>

                {/* Notes */}
                {offering.notes && (
                  <div className="bg-gray-50 border-l-4 border-blue-400 p-3 rounded text-sm">
                    <p className="text-gray-700">{offering.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
