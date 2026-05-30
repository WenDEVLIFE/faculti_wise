"use client";

import React, { useState, useEffect } from "react";
import { X, Award, GraduationCap, Briefcase, Calendar, BookOpen, AlertCircle, Edit, Save, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FacultyMember } from "@/lib/types/faculty-load.types";
import { facultyLoadService } from "../faculty-load.service";

interface FacultyProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  facultyMember: FacultyMember | null;
}

export function FacultyProfileDrawer({
  isOpen,
  onClose,
  facultyMember,
}: FacultyProfileDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [major, setMajor] = useState("");
  const [certificationsText, setCertificationsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [teachingExperience, setTeachingExperience] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [targetUnits, setTargetUnits] = useState(18);
  const [eligibleSubjects, setEligibleSubjects] = useState<string[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all courses on mount
  useEffect(() => {
    if (isOpen) {
      facultyLoadService.getCourses().then(setAllCourses).catch(console.error);
    }
  }, [isOpen]);

  // Load member data when opened
  useEffect(() => {
    if (facultyMember) {
      setName(facultyMember.name || "");
      setDesignation(facultyMember.designation || "Faculty");
      setSpecialization(facultyMember.specialization || "");
      setMajor(facultyMember.major || "");
      setCertificationsText(
        facultyMember.certifications ? facultyMember.certifications.join(", ") : ""
      );
      setSkillsText(facultyMember.skills ? facultyMember.skills.join(", ") : "");
      setTeachingExperience(facultyMember.teachingExperience || "");
      setOfficeLocation(facultyMember.officeLocation || "");
      setTargetUnits(facultyMember.targetUnits || 18);
      setEligibleSubjects(facultyMember.eligibleSubjects || []);
      setIsEditing(false);
      setError(null);
    }
  }, [facultyMember, isOpen]);

  if (!isOpen || !facultyMember) return null;

  const handleToggleSubject = (courseId: string) => {
    if (eligibleSubjects.includes(courseId)) {
      setEligibleSubjects(eligibleSubjects.filter((id) => id !== courseId));
    } else {
      setEligibleSubjects([...eligibleSubjects, courseId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const certifications = certificationsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const skills = skillsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      await facultyLoadService.updateTeacherProfile(facultyMember.id, {
        name,
        designation,
        specialization,
        major,
        certifications,
        skills,
        teachingExperience,
        officeLocation,
        targetUnits: Number(targetUnits),
        eligibleSubjects,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Compute load status
  const target = isEditing ? targetUnits : (facultyMember.targetUnits || 18);
  const totalUnits = facultyMember.totalUnits;
  let status: "underloaded" | "normal" | "overloaded" = "normal";
  if (totalUnits > target + 3) {
    status = "overloaded";
  } else if (totalUnits < target - 3) {
    status = "underloaded";
  }

  const statusConfig = {
    underloaded: { label: "Underloaded", color: "bg-amber-100 text-amber-700 border-amber-200", barColor: "bg-amber-500" },
    normal: { label: "Normal", color: "bg-emerald-100 text-emerald-700 border-emerald-200", barColor: "bg-emerald-500" },
    overloaded: { label: "Overloaded", color: "bg-rose-100 text-rose-700 border-rose-200", barColor: "bg-rose-500" },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-border flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border/50 bg-surface-alt/30 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text">Faculty profile</h3>
              <p className="text-xs text-text-muted mt-0.5">{facultyMember.department}</p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 h-9 rounded-lg"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="gap-1.5 h-9 rounded-lg bg-primary hover:bg-primary-strong text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-200 transition-colors"
              >
                <X className="h-5 w-5 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {/* Profile Overview (Non-Editing or Editing) */}
            {!isEditing ? (
              <div className="flex items-center gap-5 pb-6 border-b border-border/50">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-extrabold shadow-sm border border-primary/20 shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h4 className="text-2xl font-bold text-text font-source-serif truncate">{name}</h4>
                  <p className="text-sm font-semibold text-primary">{designation}</p>
                  <Badge variant="outline" className={`${statusConfig[status].color} text-[11px] font-semibold mt-1`}>
                    {statusConfig[status].label} Load
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-6 border-b border-border/50">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider">Designation / Title</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                  />
                </div>
              </div>
            )}

            {/* Workload Progress Bar */}
            <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/30 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-text">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-primary" /> Current Workload Load
                </span>
                <span>
                  {totalUnits} Assigned / {target} Target Units
                </span>
              </div>
              <div className="h-2.5 w-full bg-surface-alt rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${statusConfig[status].barColor}`}
                  style={{ width: `${Math.min(100, (totalUnits / target) * 100)}%` }}
                />
              </div>
              {isEditing && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider">Target Units</label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                  />
                </div>
              )}
            </div>

            {/* Academic Credentials (Spec, Major, Experience) */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border pb-1">
                Qualifications & Credentials
              </h5>

              {!isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Specialization</p>
                    <p className="text-sm font-semibold text-text">{specialization || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Major</p>
                    <p className="text-sm font-semibold text-text">{major || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Teaching Experience</p>
                    <p className="text-sm font-semibold text-text">{teachingExperience || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Office Location</p>
                    <p className="text-sm font-semibold text-text">{officeLocation || "Not specified"}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Major</label>
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Teaching Experience</label>
                    <input
                      type="text"
                      value={teachingExperience}
                      onChange={(e) => setTeachingExperience(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Office Location</label>
                    <input
                      type="text"
                      value={officeLocation}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Certifications and Skills (Tags) */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border pb-1">
                Certifications & Skills
              </h5>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-primary" /> Certifications
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {facultyMember.certifications && facultyMember.certifications.length > 0 ? (
                        facultyMember.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-surface-alt text-text text-[11px] border border-border/40 font-medium rounded-lg">
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-text-muted italic">No certifications listed.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> Skills & Competencies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {facultyMember.skills && facultyMember.skills.length > 0 ? (
                        facultyMember.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary text-[11px] border border-primary/10 font-bold rounded-lg">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-text-muted italic">No skills listed.</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Certifications (Comma separated)</label>
                    <textarea
                      value={certificationsText}
                      onChange={(e) => setCertificationsText(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text uppercase tracking-wider">Skills & Competencies (Comma separated)</label>
                    <textarea
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-text resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Eligible subjects multi-select checkbox or badges list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-primary" /> Eligible Courses
                </h5>
                {isEditing && (
                  <span className="text-[10px] text-primary font-semibold">Click courses to toggle eligibility</span>
                )}
              </div>

              {!isEditing ? (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {facultyMember.eligibleSubjects && facultyMember.eligibleSubjects.length > 0 ? (
                    facultyMember.eligibleSubjects.map((subId) => {
                      const course = allCourses.find((c) => c.id === subId);
                      return (
                        <div key={subId} className="flex items-center gap-3 p-2.5 bg-surface-alt/40 border border-border/40 rounded-xl">
                          <div className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-bold text-primary shadow-sm shrink-0">
                            {course?.code || subId}
                          </div>
                          <div className="truncate min-w-0">
                            <p className="text-xs font-bold text-text truncate">
                              {course?.name || subId}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-text-muted italic">No eligible subjects configured.</span>
                  )}
                </div>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-2 max-h-[160px] overflow-y-auto pr-1">
                  {allCourses.map((course) => {
                    const isSelected = eligibleSubjects.includes(course.id);
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => handleToggleSubject(course.id)}
                        className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary font-semibold"
                            : "border-border hover:bg-surface-alt text-text"
                        }`}
                      >
                        <div className="flex flex-col truncate pr-1">
                          <span className="font-bold">{course.code || course.id}</span>
                          <span className="text-[10px] text-text-muted truncate max-w-[150px]">
                            {course.name}
                          </span>
                        </div>
                        <div
                          className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-primary border-primary text-white" : "border-border bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Current Class Assignments list */}
            <div className="space-y-4 pt-2">
              <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border pb-1 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Active Term Assignments
              </h5>
              <div className="divide-y divide-border">
                {facultyMember.assignments && facultyMember.assignments.length > 0 ? (
                  facultyMember.assignments.map((assignment, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 hover:bg-surface-alt/20 px-2 rounded-lg transition-colors">
                      <div className="min-w-0 pr-3">
                        <p className="text-sm font-bold text-text truncate">
                          {assignment.courseName}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Code: {assignment.courseCode} • Section: <span className="font-semibold">{assignment.section}</span>
                        </p>
                      </div>
                      <Badge className="bg-primary/5 text-primary text-xs font-bold shrink-0 rounded-lg border border-primary/10">
                        {assignment.units} Units
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted italic py-2">
                    No active class schedules assigned to this faculty member for the current semester.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
