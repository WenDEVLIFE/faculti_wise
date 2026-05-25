"use client";

import React, { useState } from "react";
import { Course } from "@/lib/types/course.types";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Search } from "lucide-react";

interface AddOfferingModalProps {
  termId: string;
  allCourses: Course[];
  offeredCourseIds: string[];
  onAdd: (courseId: string, assignedUnits: number, notes?: string) => void;
  onClose: () => void;
}

export function AddOfferingModal({
  termId,
  allCourses,
  offeredCourseIds,
  onAdd,
  onClose,
}: AddOfferingModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignedUnits, setAssignedUnits] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  // Filter courses: remove already offered ones, apply search
  const availableCourses = allCourses
    .filter((c) => !offeredCourseIds.includes(c.id))
    .filter(
      (c) =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAdd = () => {
    if (!selectedCourse || !assignedUnits || assignedUnits <= 0) {
      return;
    }
    // Only pass notes if it's not empty
    onAdd(selectedCourse.id, Number(assignedUnits), notes.trim() || undefined);
    setSelectedCourse(null);
    setAssignedUnits("");
    setNotes("");
  };

  const isValid = selectedCourse && assignedUnits && assignedUnits > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardContent className="pt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Add Course Offering</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-text mb-3">
                  Select Course
                </label>

                {!selectedCourse ? (
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                      <Input
                        type="text"
                        placeholder="Search by course code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Courses List */}
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {availableCourses.length > 0 ? (
                        availableCourses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-text">{course.code}</p>
                                <p className="text-sm text-text-muted">{course.name}</p>
                              </div>
                              <div className="text-right ml-3">
                                <p className="text-sm font-medium text-text">
                                  {course.units} units
                                </p>
                                <p className="text-xs text-text-muted">
                                  {course.lectureHours}L {course.labHours}Lab
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-text-muted">
                          {allCourses.length === offeredCourseIds.length
                            ? "All courses are already offered in this term"
                            : "No courses found matching your search"}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text">{selectedCourse.code}</p>
                      <p className="text-sm text-text-muted">{selectedCourse.name}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="px-3 py-1 text-sm bg-white border border-blue-300 rounded hover:bg-gray-50 transition"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Assigned Units */}
              {selectedCourse && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Assigned Units (max: {selectedCourse.units})
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={selectedCourse.units}
                      value={assignedUnits}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssignedUnits(val === "" ? "" : Math.min(Number(val), selectedCourse.units));
                      }}
                      placeholder="Enter number of units"
                      className="w-full"
                    />
                    {assignedUnits && Number(assignedUnits) > selectedCourse.units && (
                      <p className="text-sm text-red-600 mt-1">
                        Units cannot exceed course total ({selectedCourse.units})
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes or special conditions for this offering..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-text"
                      rows={3}
                    />
                  </div>

                  {/* Course Details Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total Units:</span>
                      <span className="font-medium text-text">{selectedCourse.units}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Lecture Hours:</span>
                      <span className="font-medium text-text">{selectedCourse.lectureHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Lab Hours:</span>
                      <span className="font-medium text-text">{selectedCourse.labHours}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2">
                      <span className="text-text-muted">Status:</span>
                      <span className="font-medium text-blue-600">Draft</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex gap-3 justify-end border-t border-gray-200 pt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-text"
              >
                Cancel
              </button>
              <Button
                onClick={handleAdd}
                disabled={!isValid}
                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Offering
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
