"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Calendar, Globe, Bell, Plus, AlertTriangle, Layers, Upload, CheckCircle2, BookOpen } from "lucide-react";
import { Department } from "@/lib/types/department.types";
import { InstitutionSettings as InstitutionSettingsType } from "@/lib/types/institution.types";
import { Section, Term } from "@/lib/types/section-term.types";
import { User } from "@/lib/types/firestore.types";
import { ImportSummary } from "@/lib/types/data-import.types";
import { institutionService } from "@/features/settings/institution.service";
import { departmentsService } from "@/features/departments/departments.service";
import { programsService } from "@/features/programs/programs.service";
import { sectionsService, termsService } from "@/features/sections/sections.service";
import { AddEditDepartmentModal } from "@/features/departments/components/AddEditDepartmentModal";
import { DepartmentCard } from "@/features/departments/components/DepartmentCard";
import { AddEditProgramModal } from "@/features/programs/components/AddEditProgramModal";
import { ProgramCard } from "@/features/programs/components/ProgramCard";
import { AddEditSectionModal } from "@/features/sections/components/AddEditSectionModal";
import { SectionCard } from "@/features/sections/components/SectionCard";
import { AddEditTermModal } from "@/features/sections/components/AddEditTermModal";
import { TermCard } from "@/features/sections/components/TermCard";
import { DataImportModal } from "@/features/data-import/components/DataImportModal";
import { useAuth } from "@/lib/context/AuthContext";
import { BackupManager } from "@/features/backups/components/BackupManager";
import { dataImportService } from "@/features/data-import/data-import.service";

export function InstitutionSettings() {
  const { profile } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [teachers, setTeachers] = useState<Record<string, User>>({});

  // Institution settings state
  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettingsType | null>(null);
  const [institutionFormData, setInstitutionFormData] = useState({
    institutionName: "",
    currentAcademicYear: "",
    systemLocale: "en-US",
    systemNotificationsEnabled: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Department modal state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | undefined>();

  // Program modal state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<any | undefined>();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

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
  const [programDeleteConfirm, setProgramDeleteConfirm] = useState<string | null>(null);
  const [sectionDeleteConfirm, setSectionDeleteConfirm] = useState<string | null>(null);
  const [termDeleteConfirm, setTermDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Subscribe to institution settings
    const unsubscribeSettings = institutionService.subscribeSettings((settings) => {
      setInstitutionSettings(settings);
      setInstitutionFormData({
        institutionName: settings.institutionName,
        currentAcademicYear: settings.currentAcademicYear,
        systemLocale: settings.systemLocale,
        systemNotificationsEnabled: settings.systemNotificationsEnabled,
      });
    });

    // Subscribe to departments
    const unsubscribeDepts = departmentsService.subscribeDepartments((data) => {
      setDepartments(data);
    });

    // Subscribe to programs
    const unsubscribePrograms = programsService.subscribePrograms((data) => {
      setPrograms(data);
      if (data.length > 0 && !selectedProgramId) {
        setSelectedProgramId(data[0].id);
      }
    });

    // Subscribe to sections
    const unsubscribeSections = sectionsService.subscribeAll((data) => {
      setSections(data);
      setLoading(false);
      
      // Reload teachers when sections change to ensure advisor names are available
      const reloadTeachers = async () => {
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
      reloadTeachers();
    });

    // Subscribe to terms
    const unsubscribeTerms = termsService.subscribeAll((data) => {
      setTerms(data);
    });

    return () => {
      unsubscribeDepts();
      unsubscribePrograms();
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
      await departmentsService.deleteDepartment(dept.id, profile || undefined);
      setDeptDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department");
    } finally {
      setDeleting(false);
    }
  };

  // Program handlers
  const handleAddProgramClick = () => {
    setProgramToEdit(undefined);
    setSelectedDepartmentId(departments.length > 0 ? departments[0].id : "");
    setIsProgramModalOpen(true);
  };

  const handleEditProgramClick = (program: any) => {
    setProgramToEdit(program);
    setSelectedDepartmentId(program.departmentId);
    setIsProgramModalOpen(true);
  };

  const handleDeleteProgramClick = async (program: any) => {
    setDeleting(true);
    try {
      await programsService.deleteProgram(program.id, profile || undefined);
      setProgramDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program");
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
      await sectionsService.deleteSection(section.id, profile || undefined);
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
      await termsService.deleteTerm(term.id, profile || undefined);
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

  const handleProgramModalClose = () => {
    setIsProgramModalOpen(false);
    setProgramToEdit(undefined);
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

  // Institution settings handlers
  const downloadAllTemplates = (format: "csv" | "json") => {
    const types: ("users" | "courses" | "rooms")[] = ["users", "courses", "rooms"];
    types.forEach((type) => {
      try {
        const content = format === "csv" 
          ? dataImportService.getTemplateCSV(type) 
          : dataImportService.getTemplateJSON(type);
        const blob = new Blob([content], { 
          type: format === "csv" ? "text/csv;charset=utf-8;" : "application/json;charset=utf-8;" 
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${type}_template.${format}`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Failed to download ${type} template:`, err);
      }
    });
  };

  const handleUpdateInstitutionSettings = async () => {
    if (!profile) return;

    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      await institutionService.updateSettings(
        {
          institutionName: institutionFormData.institutionName,
          currentAcademicYear: institutionFormData.currentAcademicYear,
          systemLocale: institutionFormData.systemLocale,
          systemNotificationsEnabled: institutionFormData.systemNotificationsEnabled,
        },
        profile
      );
      setSettingsMessage("Institution settings updated successfully");
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update institution settings:", error);
      setSettingsMessage("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
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
          {settingsMessage && (
            <div className={`p-4 rounded-xl border flex items-center gap-2 text-sm ${
              settingsMessage.includes("success") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                : "bg-red-50 border-red-200 text-red-900"
            }`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{settingsMessage}</span>
            </div>
          )}

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="text" 
                  value={institutionFormData.institutionName}
                  onChange={(e) => setInstitutionFormData({ ...institutionFormData, institutionName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Academic Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input 
                    type="text" 
                    value={institutionFormData.currentAcademicYear}
                    onChange={(e) => setInstitutionFormData({ ...institutionFormData, currentAcademicYear: e.target.value })}
                    placeholder="e.g., 2024-2025"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">System Locale</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select 
                    value={institutionFormData.systemLocale}
                    onChange={(e) => setInstitutionFormData({ ...institutionFormData, systemLocale: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <option value="en-US">English (United States)</option>
                    <option value="fil-PH">Filipino (Philippines)</option>
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
              <button
                onClick={() => setInstitutionFormData({ 
                  ...institutionFormData, 
                  systemNotificationsEnabled: !institutionFormData.systemNotificationsEnabled 
                })}
                className={`h-5 w-10 rounded-full relative cursor-pointer transition-all ${
                  institutionFormData.systemNotificationsEnabled ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                  institutionFormData.systemNotificationsEnabled ? "right-0.5" : "left-0.5"
                }`} />
              </button>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Enable automated email notifications for faculty load alerts and schedule conflicts.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleUpdateInstitutionSettings}
              disabled={savingSettings}
              className="px-8 shadow-md"
            >
              {savingSettings ? "Saving..." : "Update Configuration"}
            </Button>
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
                      dept.chairUid && teachers[dept.chairUid]
                        ? (() => {
                            const t = teachers[dept.chairUid];
                            const name = t.displayName || (t as any).name || (t as any).fullName;
                            return name ? `${name} (${t.email})` : t.email;
                          })()
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

      {/* Program Management Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Program Management
          </CardTitle>
          <Button
            onClick={handleAddProgramClick}
            className="h-9 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Program
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {departments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Filter by Department</label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                className="w-full h-10 px-3 bg-surface-alt border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
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
          ) : programs.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-surface/50">
              <BookOpen className="h-12 w-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted mb-4">No programs created yet</p>
              <Button onClick={handleAddProgramClick} variant="secondary">
                Create First Program
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedDepartmentId
                ? programs.filter((p) => p.departmentId === selectedDepartmentId)
                : programs
              ).map((program) => (
                <div key={program.id} className="relative">
                  {programDeleteConfirm === program.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-xl p-4 shadow-lg w-full mx-2">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-text">Delete Program?</h4>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                          This will permanently delete the program "{program.name}". This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 h-9"
                            onClick={() => setProgramDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="flex-1 h-9 bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                            onClick={() => handleDeleteProgramClick(program)}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <ProgramCard
                    program={program}
                    departmentName={
                      departments.find((d) => d.id === program.departmentId)?.name
                    }
                    isAdmin={true}
                    onEdit={handleEditProgramClick}
                    onDelete={(p) => setProgramDeleteConfirm(p.id)}
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
                      section.advisorUid && teachers[section.advisorUid]
                        ? (() => {
                            const t = teachers[section.advisorUid];
                            const name = t.displayName || (t as any).name || (t as any).fullName;
                            return name ? `${name} (${t.email})` : t.email;
                          })()
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
                onClick={() => downloadAllTemplates("csv")}
                variant="secondary"
                className="gap-2 h-12"
              >
                Download CSV Template
              </Button>
              <Button
                onClick={() => downloadAllTemplates("json")}
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

      <BackupManager />

      {/* Modals */}
      <AddEditDepartmentModal
        isOpen={isDeptModalOpen}
        onClose={handleDeptModalClose}
        departmentToEdit={departmentToEdit}
      />

      <AddEditProgramModal
        isOpen={isProgramModalOpen}
        onClose={handleProgramModalClose}
        programToEdit={programToEdit}
        departments={departments}
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
