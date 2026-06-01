"use client";

import React, { useEffect, useState } from "react";
import { aiSchedulesService, AiProposal } from "./ai-schedules.service";
import { TimetableGrid } from "@/features/timetables/components/TimetableGrid";
import { TimetableEntry, DayOfWeek } from "@/lib/types/timetable.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/AuthContext";
import { mockData } from "@/lib/constants/mockData";
import { getDb } from "@/lib/firebase";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import {
  BrainCircuit,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  CalendarCheck2,
  CalendarPlus,
  Clock,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

export default function AiSchedulesView() {
  const { profile } = useAuth();
  const [proposals, setProposals] = useState<AiProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await aiSchedulesService.listProposals();
      setProposals(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionError(null);
    try {
      await aiSchedulesService.deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
      if (expandedId === id) setExpandedId(null);
      if (previewId === id) setPreviewId(null);
      flash("Proposal deleted.");
    } catch {
      setActionError("Failed to delete proposal.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await aiSchedulesService.renameProposal(id, editName.trim());
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
      );
      setEditingId(null);
      flash("Proposal renamed.");
    } catch {
      setActionError("Failed to rename proposal.");
    }
  };

  const handleApply = async (proposal: AiProposal, mode: "replace" | "append") => {
    setApplyingId(proposal.id);
    setActionError(null);
    try {
      const db = getDb();
      if (!db) {
        // Offline/Demo mode
        const newScheds = proposal.data.schedules.map((s: any, i: number) => ({
          id: `schedule-${Date.now()}-${i}`,
          ...s,
        }));
        if (mode === "replace") {
          mockData.schedules = newScheds;
        } else {
          mockData.schedules = [...mockData.schedules, ...newScheds];
        }
      } else {
        if (mode === "replace") {
          const snap = await getDocs(collection(db, "schedules"));
          const batchDel = writeBatch(db);
          snap.docs.forEach((d) => batchDel.delete(d.ref));
          await batchDel.commit();
        }
        const batchAdd = writeBatch(db);
        for (const sched of proposal.data.schedules) {
          const ref = doc(collection(db, "schedules"));
          batchAdd.set(ref, sched);
        }
        await batchAdd.commit();
      }
      await aiSchedulesService.markApplied(proposal.id);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposal.id ? { ...p, status: "applied" } : p))
      );
      flash(
        mode === "replace"
          ? "Active timetable replaced with this proposal."
          : "Proposal appended to active timetable."
      );
    } catch (err: any) {
      setActionError("Failed to apply proposal: " + (err?.message ?? "unknown error"));
    } finally {
      setApplyingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const getPreviewEntries = (proposal: AiProposal): TimetableEntry[] => {
    return (proposal.data.entries ?? []).map((e: any) => ({
      ...e,
      day: e.day as DayOfWeek,
    }));
  };

  if (!profile || profile.role !== "admin") {
    return (
      <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-amber-600 font-medium">Access restricted to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text font-source-serif flex items-center gap-3">
            <BrainCircuit className="w-9 h-9 text-accent" />
            AI Schedule Proposals
          </h1>
          <p className="text-text-muted mt-1">
            Manage, preview, rename, or apply AI-generated timetable proposals.
          </p>
        </div>
        <Button
          onClick={load}
          variant="secondary"
          className="gap-2 h-10 border border-border"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Toast / feedback */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
          <Check className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Empty state */}
      {!loading && proposals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text font-source-serif">No Proposals Yet</h2>
          <p className="text-text-muted max-w-sm">
            Generate an AI timetable from the{" "}
            <strong>Timetables</strong> section. Proposals will be saved here for
            review, editing, and applying.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-alt rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Proposals list */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const isExpanded = expandedId === proposal.id;
          const isPreviewing = previewId === proposal.id;
          const isApplying = applyingId === proposal.id;
          const isDeleting = deletingId === proposal.id;
          const isEditing = editingId === proposal.id;

          return (
            <Card
              key={proposal.id}
              className={`border transition-all duration-300 overflow-hidden ${
                proposal.status === "applied"
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-border bg-white"
              }`}
            >
              {/* Card header row */}
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left: icon + info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        proposal.status === "applied"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Name / edit */}
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(proposal.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="text-base font-bold border border-accent rounded-md px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <button
                            onClick={() => handleRename(proposal.id)}
                            className="p-1.5 bg-accent text-white rounded-md hover:bg-accent/90"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-surface-alt rounded-md hover:bg-surface-alt/80 text-text-muted"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-text truncate">
                            {proposal.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              proposal.status === "applied"
                                ? "text-emerald-700 border-emerald-300 bg-emerald-50 text-xs"
                                : "text-amber-700 border-amber-300 bg-amber-50 text-xs"
                            }
                          >
                            {proposal.status === "applied" ? "Applied" : "Draft"}
                          </Badge>
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(proposal.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarCheck2 className="w-3 h-3 text-emerald-600" />
                          <strong className="text-emerald-700">{proposal.totalScheduled}</strong>&nbsp;scheduled
                        </span>
                        {proposal.totalSkipped > 0 && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <strong className="text-amber-600">{proposal.totalSkipped}</strong>&nbsp;skipped
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          ⚡ <strong>{proposal.conflictsAvoided}</strong>&nbsp;conflicts avoided
                        </span>
                      </div>

                      {/* Dept tags */}
                      {proposal.filteredDepts?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proposal.filteredDepts.map((d) => (
                            <span
                              key={d}
                              className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-semibold uppercase tracking-wider"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    {/* Rename */}
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingId(proposal.id);
                          setEditName(proposal.name);
                        }}
                        title="Rename"
                        className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}

                    {/* Preview toggle */}
                    <button
                      onClick={() =>
                        setPreviewId(isPreviewing ? null : proposal.id)
                      }
                      title={isPreviewing ? "Hide Preview" : "Preview Grid"}
                      className={`p-2 rounded-lg border transition-colors ${
                        isPreviewing
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-text-muted hover:text-text hover:bg-surface-alt"
                      }`}
                    >
                      {isPreviewing ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Report toggle */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : proposal.id)
                      }
                      title="View AI Report"
                      className={`p-2 rounded-lg border transition-colors ${
                        isExpanded
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-text-muted hover:text-text hover:bg-surface-alt"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Apply: Append */}
                    <Button
                      onClick={() => handleApply(proposal, "append")}
                      disabled={isApplying}
                      className="bg-accent hover:bg-accent/90 text-white h-9 text-xs gap-1.5 px-3"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      {isApplying ? "Applying…" : "Append"}
                    </Button>

                    {/* Apply: Replace */}
                    <Button
                      onClick={() => handleApply(proposal, "replace")}
                      disabled={isApplying}
                      className="bg-red-600 hover:bg-red-700 text-white h-9 text-xs gap-1.5 px-3"
                    >
                      <CalendarCheck2 className="w-3.5 h-3.5" />
                      Replace
                    </Button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      disabled={isDeleting}
                      title="Delete proposal"
                      className="p-2 rounded-lg border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>

              {/* Timetable preview grid */}
              {isPreviewing && (
                <div className="border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-surface-alt/30">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                      Timetable Preview — {proposal.totalScheduled} classes
                    </p>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-white">
                      <TimetableGrid entries={getPreviewEntries(proposal)} />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Report accordion */}
              {isExpanded && proposal.report && (
                <div className="border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-5 space-y-5">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-emerald-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-700">
                          {proposal.report.totalScheduled}
                        </div>
                        <div className="text-xs text-emerald-600 font-medium">Scheduled</div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-amber-700">
                          {proposal.report.conflictsAvoided}
                        </div>
                        <div className="text-xs text-amber-600 font-medium">Conflicts Avoided</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {proposal.report.totalSkipped}
                        </div>
                        <div className="text-xs text-red-600 font-medium">Skipped</div>
                      </div>
                    </div>

                    {/* Skipped courses */}
                    {proposal.report.skippedCourses?.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-red-800 mb-2">⚠️ Could Not Schedule</h3>
                        {proposal.report.skippedCourses.map((s, i) => (
                          <p key={i} className="text-sm text-red-700">
                            <strong>{s.name}:</strong> {s.reason}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Faculty load */}
                    {Object.keys(proposal.report.teacherLoadSummary ?? {}).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Faculty Load Distribution</h3>
                        <div className="space-y-2">
                          {Object.entries(proposal.report.teacherLoadSummary)
                            .sort(([, a], [, b]) => b - a)
                            .map(([name, count]) => (
                              <div key={name} className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 w-40 truncate" title={name}>{name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(
                                        (count /
                                          Math.max(
                                            ...Object.values(proposal.report.teacherLoadSummary)
                                          )) *
                                          100,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 w-12 text-right">{count} cls</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Room usage */}
                    {Object.keys(proposal.report.roomUsageSummary ?? {}).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Room Usage</h3>
                        <div className="space-y-2">
                          {Object.entries(proposal.report.roomUsageSummary)
                            .sort(([, a], [, b]) => b - a)
                            .map(([name, count]) => (
                              <div key={name} className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 w-40 truncate" title={name}>{name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(
                                        (count /
                                          Math.max(
                                            ...Object.values(proposal.report.roomUsageSummary)
                                          )) *
                                          100,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 w-12 text-right">{count} cls</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
