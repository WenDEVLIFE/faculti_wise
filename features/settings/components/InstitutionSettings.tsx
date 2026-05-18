"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Calendar, Globe, Bell, Plus, AlertTriangle } from "lucide-react";
import { Department } from "@/lib/types/department.types";
import { User } from "@/lib/types/firestore.types";
import { departmentsService } from "@/features/departments/departments.service";
import { AddEditDepartmentModal } from "@/features/departments/components/AddEditDepartmentModal";
import { DepartmentCard } from "@/features/departments/components/DepartmentCard";
import { useAuth } from "@/lib/context/AuthContext";

export function InstitutionSettings() {
  const { profile } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Record<string, User>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | undefined>();
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Subscribe to departments
    const unsubscribe = departmentsService.subscribeDepartments((data) => {
      setDepartments(data);
      setLoading(false);
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

    loadTeachers();

    return () => unsubscribe();
  }, []);

  const handleAddClick = () => {
    setDepartmentToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (dept: Department) => {
    setDepartmentToEdit(dept);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (dept: Department) => {
    setDeleting(true);
    try {
      await departmentsService.deleteDepartment(dept.id, profile);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDepartmentToEdit(undefined);
  };

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
