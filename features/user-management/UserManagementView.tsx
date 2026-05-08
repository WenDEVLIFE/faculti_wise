"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Shield, 
  GraduationCap, 
  UserCircle,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AddUserModal } from "./components/AddUserModal";
import { userManagementService } from "./user-management.service";
import { User } from "@/lib/types/firestore.types";
import { cn } from "@/lib/utils";

export default function UserManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userManagementService.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif">User Management</h1>
          <p className="text-text-muted mt-1">Manage institutional access for administrators, faculty, and students.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-primary hover:bg-primary-strong transition-all shadow-md h-12 px-6 rounded-2xl"
        >
          <Plus className="h-5 w-5" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} icon={Users} color="bg-primary" />
        <StatCard label="Administrators" value={stats.admins} icon={Shield} color="bg-amber-500" />
        <StatCard label="Teachers" value={stats.teachers} icon={UserCircle} color="bg-blue-500" />
        <StatCard label="Students" value={stats.students} icon={GraduationCap} color="bg-emerald-500" />
      </div>

      <Card className="border-none shadow-xl bg-white/40 backdrop-blur-md overflow-hidden rounded-[2rem]">
        <CardHeader className="border-b border-border bg-white/50 px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl font-semibold">Directory</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
                />
              </div>
              <Button variant="secondary" size="icon" className="rounded-xl h-11 w-11">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-alt/50">
                  <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">User</th>
                  <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Role</th>
                  <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Joined</th>
                  <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-6 h-20 bg-surface/30" />
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-text-muted">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-surface-alt/30 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-text">{user.displayName}</span>
                            <span className="text-xs text-text-muted flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-8 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-sm text-text-muted flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadUsers}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-lg bg-white/60 backdrop-blur-md rounded-2xl p-6 flex items-center gap-4">
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <p className="text-2xl font-bold text-text">{value}</p>
      </div>
    </Card>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-amber-100 text-amber-700 border-amber-200",
    teacher: "bg-blue-100 text-blue-700 border-blue-200",
    student: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  
  return (
    <Badge className={cn("capitalize px-3 py-1 rounded-lg border", styles[role] || "bg-stone-100 text-stone-700 border-stone-200")}>
      {role}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
      isActive ? "text-emerald-600 bg-emerald-50" : "text-stone-500 bg-stone-50"
    )}>
      {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {isActive ? "Active" : "Inactive"}
    </div>
  );
}
