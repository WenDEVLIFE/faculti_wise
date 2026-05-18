"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Calendar, Globe, Bell, Plus, AlertTriangle, Layers, Upload, CheckCircle2 } from "lucide-react";
import { Department } from "@/lib/types/department.types";
import { Section, Term } from "@/lib/types/section-term.types";
import { User } from "@/lib/types/firestore.types";
import { ImportSummary } from "@/lib/types/data-import.types";
import { departmentsService } from "@/features/departments/departments.service";
import { sectionsService, termsService } from "@/features/sections/sections.service";
import { AddEditDepartmentModal } from "@/features/departments/components/AddEditDepartmentModal";
import { DepartmentCard } from "@/features/departments/components/DepartmentCard";
import { AddEditSectionModal } from "@/features/sections/components/AddEditSectionModal";
import { SectionCard } from "@/features/sections/components/SectionCard";
import { AddEditTermModal } from "@/features/sections/components/AddEditTermModal";
import { TermCard } from "@/features/sections/components/TermCard";
import { DataImportModal } from "@/features/data-import/components/DataImportModal";
import { useAuth } from "@/lib/context/AuthContext";

export function InstitutionSettings() {
  const { profile } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [teachers, setTeachers] = useState<Record<string, User>>({});
  const [programs, setPrograms] = useState<any[]>([]);

  // Department modal state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | undefined>();

  // Section modal state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<Section | undefined>();
  const [selectedProgramId, setSelectedProgramId] = useState("");

  // Term modal state
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termToEdit, setTermToEdit] = useState<Term | undefined>();

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [deptDeleteConfirm, setDeptDeleteConfirm] = useState<string | null>(null);
  const [sectionDeleteConfirm, setSectionDeleteConfirm] = useState<string | null>(null);
  const [termDeleteConfirm, setTermDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Subscribe to departments and get programs
    const unsubscribeDepts = departmentsService.subscribeDepartments((data) => {
      setDepartments(data);
    });

    // Subscribe to sections
    const unsubscribeSections = sectionsService.subscribeAll((data) => {
      setSections(data);
      setLoading(false);
    });

    // Subscribe to terms
    const unsubscribeTerms = termsService.subscribeAll((data) => {
      setTerms(data);
    });

    // Load teachers
    const loadTeachers = async () => {
      try {
        const teachersData = await departmentsService.getTeachers();
        const teachersMap: Record<string, User> = {};
        teachersData.forEach((teacher) => {
          teachersMap[teacher.id] = teacher;
        });
        setTeachers(teachersMap);
      } catch (err) {
        console.error("Error loading teachers:", err);
      }
    };

    // Load programs from mock data
    const { mockData } = require("@/lib/constants/mockData");
    if (mockData.programs) {
      setPrograms(mockData.programs);
      if (mockData.programs.length > 0) {
        setSelectedProgramId(mockData.programs[0].id);
      }
    }

    loadTeachers();

    return () => {
      unsubscribeDepts();
      unsubscribeSections();
      unsubscribeTerms();
    };
  }, []);

  // Department handlers
  const handleAddDeptClick = () => {
    setDepartmentToEdit(undefined);
    setIsDeptModalOpen(true);
  };

  const handleEditDeptClick = (dept: Department) => {
    setDepartmentToEdit(dept);
    setIsDeptModalOpen(true);
  };

  const handleDeleteDeptClick = async (dept: Department) => {
    setDeleting(true);
    try {
      await departmentsService.deleteDepartment(dept.id, profile);
      setDeptDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department");
    } finally {
      setDeleting(false);
    }
  };

  // Section handlers
  const handleAddSectionClick = () => {
    setSectionToEdit(undefined);
    setIsSectionModalOpen(true);
  };

  const handleEditSectionClick = (section: Section) => {
    setSectionToEdit(section);
    setIsSectionModalOpen(true);
  };

  const handleDeleteSectionClick = async (section: Section) => {
    setDeleting(true);
    try {
      await sectionsService.deleteSection(section.id, profile);
      setSectionDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting section:", err);
      alert("Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };

  // Term handlers
  const handleAddTermClick = () => {
    setTermToEdit(undefined);
    setIsTermModalOpen(true);
  };

  const handleEditTermClick = (term: Term) => {
    setTermToEdit(term);
    setIsTermModalOpen(true);
  };

  const handleDeleteTermClick = async (term: Term) => {
    setDeleting(true);
    try {
      await termsService.deleteTerm(term.id, profile);
      setTermDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting term:", err);
      alert("Failed to delete term");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeptModalClose = () => {
    setIsDeptModalOpen(false);
    setDepartmentToEdit(undefined);
  };

  const handleSectionModalClose = () => {
    setIsSectionModalOpen(false);
    setSectionToEdit(undefined);
  };

  const handleTermModalClose = () => {
    setIsTermModalOpen(false);
    setTermToEdit(undefined);
  };

  const handleImportSuccess = (summary: ImportSummary) => {
    setImportSuccessMessage(
      `Successfully imported ${summary.successCount} records. ${summary.failureCount > 0 ? `${summary.failureCount} records failed.` : ""}`
    );
    setIsImportModalOpen(false);
    setTimeout(() => setImportSuccessMessage(null), 5000);
  };

  const filteredSections = selectedProgramId
    ? sections.filter((s) => s.programId === selectedProgramId)
    : sections;

  return (
    <div className="space-y-6">
      {/* Institution Details Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Institution Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="text" 
                  defaultValue="FacultyWise University"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Academic Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>2024 - 2025</option>
                    <option>2023 - 2024</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Locale</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>English (United States)</option>
                    <option>Filipino (Philippines)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-text">System Notifications</span>
              </div>
              <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Enable automated email notifications for faculty load alerts and schedule conflicts.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" className="px-8 shadow-md">Update Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Management
          </CardTitle>
          <Button
            onClick={handleAddDeptClick}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-surface-alt/50 animate-pulse"
                />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-surface/50">
              <Building2 className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted mb-4">No departments created yet</p>
              <Button onClick={handleAddDeptClick} variant="secondary">
                Create First Department
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="relative">
                  {deptDeleteConfirm === dept.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-xl p-4 shadow-lg w-full mx-2">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-text">Delete Department?</h4>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                          This will permanently delete the department "{dept.name}". This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 h-9"
                            onClick={() => setDeptDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="flex-1 h-9 bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                            onClick={() => handleDeleteDeptClick(dept)}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <DepartmentCard
                    department={dept}
                    chairName={
                      dept.chairUid
                        ? teachers[dept.chairUid]?.displayName
                        : undefined
                    }
                    isAdmin={true}
                    onEdit={handleEditDeptClick}
                    onDelete={(d) => setDeptDeleteConfirm(d.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sections Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Section Management
          </CardTitle>
          <Button
            onClick={handleAddSectionClick}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {programs.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Filter by Program</label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full h-10 px-3 bg-surface-alt border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
              >
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-surface-alt/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-surface/50">
              <Layers className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted mb-4">No sections created for this program</p>
              <Button onClick={handleAddSectionClick} variant="secondary">
                Create First Section
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSections.map((section) => (
                <div key={section.id} className="relative">
                  {sectionDeleteConfirm === section.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-xl p-4 shadow-lg w-full mx-2">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-text">Delete Section?</h4>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                          This will permanently delete the section "{section.name}". This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 h-9"
                            onClick={() => setSectionDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="flex-1 h-9 bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                            onClick={() => handleDeleteSectionClick(section)}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <SectionCard
                    section={section}
                    advisorName={
                      section.advisorUid
                        ? teachers[section.advisorUid]?.displayName
                        : undefined
                    }
                    isAdmin={true}
                    onEdit={handleEditSectionClick}
                    onDelete={(s) => setSectionDeleteConfirm(s.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Academic Terms Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Academic Terms Manager
          </CardTitle>
          <Button
            onClick={handleAddTermClick}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Term
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-surface-alt/50 animate-pulse"
                />
              ))}
            </div>
          ) : terms.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-surface/50">
              <Calendar className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted mb-4">No academic terms created yet</p>
              <Button onClick={handleAddTermClick} variant="secondary">
                Create First Term
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term) => (
                <div key={term.id} className="relative">
                  {termDeleteConfirm === term.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-xl p-4 shadow-lg w-full mx-2">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-text">Delete Term?</h4>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                          This will permanently delete the term "{term.academicYear} {term.semester}". This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 h-9"
                            onClick={() => setTermDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="flex-1 h-9 bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                            onClick={() => handleDeleteTermClick(term)}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <TermCard
                    term={term}
                    isAdmin={true}
                    onEdit={handleEditTermClick}
                    onDelete={(t) => setTermDeleteConfirm(t.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Import Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Data Import
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              Import faculty members, courses, and room data from CSV or JSON files. Download templates below to get started.
            </p>

            {importSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="primary"
                className="gap-2 h-12"
              >
                <Upload className="h-5 w-5" />
                Import Data
              </Button>
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="secondary"
                className="gap-2 h-12"
              >
                Download CSV Template
              </Button>
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="secondary"
                className="gap-2 h-12"
              >
                Download JSON Template
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-surface-alt/50 border border-border/50 space-y-3">
              <h4 className="font-medium text-sm text-text">Supported Entity Types</h4>
              <ul className="text-sm text-text-muted space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Faculty & Staff (users with role teacher)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Courses (with code, units, hours, category)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Rooms (with building, capacity, type, features)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEditDepartmentModal
        isOpen={isDeptModalOpen}
        onClose={handleDeptModalClose}
        departmentToEdit={departmentToEdit}
      />

      <AddEditSectionModal
        isOpen={isSectionModalOpen}
        onClose={handleSectionModalClose}
        programId={selectedProgramId}
        sectionToEdit={sectionToEdit}
      />

      <AddEditTermModal
        isOpen={isTermModalOpen}
        onClose={handleTermModalClose}
        termToEdit={termToEdit}
      />

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Institution Details Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Institution Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="text" 
                  defaultValue="FacultyWise University"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Academic Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>2024 - 2025</option>
                    <option>2023 - 2024</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Locale</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                    <option>English (United States)</option>
                    <option>Filipino (Philippines)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-text">System Notifications</span>
              </div>
              <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Enable automated email notifications for faculty load alerts and schedule conflicts.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" className="px-8 shadow-md">Update Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Management
          </CardTitle>
          <Button
            onClick={handleAddClick}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-surface-alt/50 animate-pulse"
                />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-surface/50">
              <Building2 className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted mb-4">No departments created yet</p>
              <Button onClick={handleAddClick} variant="secondary">
                Create First Department
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="relative">
                    {deleteConfirm === dept.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-4 shadow-lg w-full mx-2">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h4 className="font-semibold text-text">Delete Department?</h4>
                          </div>
                          <p className="text-sm text-text-muted mb-4">
                            This will permanently delete the department "{dept.name}". This action cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              className="flex-1 h-9"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              className="flex-1 h-9 bg-red-600 hover:bg-red-700"
                              disabled={deleting}
                              onClick={() => handleDeleteClick(dept)}
                            >
                              {deleting ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <DepartmentCard
                      department={dept}
                      chairName={
                        dept.chairUid
                          ? teachers[dept.chairUid]?.displayName
                          : undefined
                      }
                      isAdmin={true}
                      onEdit={handleEditClick}
                      onDelete={(d) => setDeleteConfirm(d.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <AddEditDepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        departmentToEdit={departmentToEdit}
        onSuccess={() => {
          // Departments will auto-update via subscription
        }}
      />
    </div>
  );
}
