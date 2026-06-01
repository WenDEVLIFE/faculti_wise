"use client";

import React, { useState, useEffect } from "react";
import { CourseOfferingWithCourse } from "@/lib/types/offering.types";
import { Term } from "@/lib/types/section-term.types";
import { Course } from "@/lib/types/course.types";
import { courseOfferingsService } from "./course-offerings.service";
import { coursesService } from "../courses/courses.service";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/context/AuthContext";
import { AddOfferingModal } from "./components/AddOfferingModal";
import { OfferingsList } from "./components/OfferingsList";
import { Calendar, Plus, Upload, AlertCircle, CheckCircle } from "lucide-react";

// Mock terms data - would come from Firestore in real app
const AVAILABLE_TERMS: Term[] = [
  {
    id: "term-2026-s1",
    academicYear: "2025-2026",
    semester: "1st",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-05-15"),
    isCurrent: true,
  },
  {
    id: "term-2026-s2",
    academicYear: "2025-2026",
    semester: "2nd",
    startDate: new Date("2026-06-01"),
    endDate: new Date("2026-09-30"),
    isCurrent: false,
  },
  {
    id: "term-2026-summer",
    academicYear: "2025-2026",
    semester: "Summer",
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-12-20"),
    isCurrent: false,
  },
];

type ViewState = "default" | "publishing";

export default function CourseOfferingsView() {
  const { user, profile } = useAuth();
  const [selectedTermId, setSelectedTermId] = useState(AVAILABLE_TERMS[0].id);
  const [offerings, setOfferings] = useState<CourseOfferingWithCourse[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    archived: 0,
    totalUnits: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("default");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedTerm = AVAILABLE_TERMS.find((t) => t.id === selectedTermId);

  // Subscribe to offerings
  useEffect(() => {
    const unsubscribe = courseOfferingsService.subscribeOfferingsByTerm(selectedTermId, (data) => {
      setOfferings(data);
    });

    return unsubscribe;
  }, [selectedTermId]);

  // Subscribe to courses
  useEffect(() => {
    const unsubscribe = coursesService.subscribeCourses((courses) => {
      setAllCourses(courses);
    });

    return unsubscribe;
  }, []);

  // Update stats when offerings change
  useEffect(() => {
    const updateStats = async () => {
      const newStats = await courseOfferingsService.getOfferingStats(selectedTermId);
      setStats(newStats);
    };
    updateStats();
  }, [offerings, selectedTermId]);

  const handleAddOffering = async (
    courseId: string,
    assignedUnits: number,
    sectionId: string,
    programId: string,
    notes?: string
  ) => {
    if (!profile) return;

    try {
      await courseOfferingsService.createOffering(
        {
          courseId,
          termId: selectedTermId,
          sectionId,
          programId,
          assignedUnits,
          status: "draft",
          notes,
        },
        profile
      );
      setShowAddModal(false);
      setSuccessMessage("Course offering added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to create offering:", error);
    }
  };

  const handlePublishOfferings = async () => {
    if (!profile || stats.draft === 0) return;

    setViewState("publishing");
    try {
      await courseOfferingsService.publishOfferingsForTerm(selectedTermId, profile);
      setViewState("default");
      setSuccessMessage(`Published ${stats.draft} course offerings`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to publish offerings:", error);
      setViewState("default");
    }
  };

  const handleDeleteOffering = async (offeringId: string) => {
    if (!profile) return;

    try {
      await courseOfferingsService.deleteOffering(offeringId, profile);
      setSuccessMessage("Course offering removed");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete offering:", error);
    }
  };

  const handleExportCSV = () => {
    const csv = courseOfferingsService.exportAsCSV(offerings);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `course-offerings-${selectedTermId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">
          Course Offerings
        </h1>
        <p className="text-text-muted mt-2">
          Define which courses are offered in this term before scheduling starts. Offerings lock once published.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-emerald-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Term Selector */}
      {AVAILABLE_TERMS.length > 1 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-muted">Select Academic Term</label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_TERMS.map((term) => (
              <button
                key={term.id}
                onClick={() => setSelectedTermId(term.id)}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  selectedTermId === term.id
                    ? "border-primary bg-primary text-white"
                    : "border-text-muted text-text hover:border-primary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {term.semester} ({term.academicYear})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-text-muted text-sm font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-text">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-text-muted text-sm font-medium mb-1">Draft</p>
              <p className="text-3xl font-bold text-blue-600">{stats.draft}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-text-muted text-sm font-medium mb-1">Published</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.published}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-text-muted text-sm font-medium mb-1">Archived</p>
              <p className="text-3xl font-bold text-gray-600">{stats.archived}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-text-muted text-sm font-medium mb-1">Total Units</p>
              <p className="text-3xl font-bold text-primary">{stats.totalUnits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Course Offering
        </Button>

        {stats.draft > 0 && (
          <Button
            onClick={handlePublishOfferings}
            disabled={viewState === "publishing"}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {viewState === "publishing" ? "Publishing..." : `Publish (${stats.draft})`}
          </Button>
        )}

        {offerings.length > 0 && (
          <Button onClick={handleExportCSV} variant="secondary">
            Export CSV
          </Button>
        )}
      </div>

      {/* No Offerings State */}
      {offerings.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-text mb-2">No courses offered yet</h3>
            <p className="text-text-muted mb-4">
              Add courses to define what's available in {selectedTerm?.semester} {selectedTerm?.academicYear}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Offerings List */}
      {offerings.length > 0 && (
        <OfferingsList
          offerings={offerings}
          onDelete={handleDeleteOffering}
          onStatusChange={async (offeringId, newStatus) => {
            if (!profile) return;
            try {
              await courseOfferingsService.updateOffering(offeringId, { status: newStatus }, profile);
            } catch (error) {
              console.error("Failed to update offering:", error);
            }
          }}
        />
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddOfferingModal
          termId={selectedTermId}
          allCourses={allCourses}
          existingOfferings={offerings}
          onAdd={handleAddOffering}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
