"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Milestone {
  id: string;
  phase: string;
  title: string;
  description?: string;
  targetDate?: string;
  completionPercentage: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETE";
  isCompleted: boolean;
  deliverables: string[];
  blockers: string[];
}

const PHASES = [
  "DISCOVERY",
  "UI_UX_DESIGN",
  "BACKEND_ARCHITECTURE",
  "STAGING",
  "PRODUCTION",
  "MAINTENANCE",
];

export function TimelineTabFull({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phase: "DISCOVERY",
    title: "",
    description: "",
    targetDate: "",
  });

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/projects/${projectId}/milestones`, {
        credentials: "include",
      });
      const data = await response.json();
      setMilestones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setFormData({
          phase: "DISCOVERY",
          title: "",
          description: "",
          targetDate: "",
        });
        setShowForm(false);
        fetchMilestones();
      }
    } catch (error) {
      console.error("Failed to add milestone:", error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await fetch(`/api/v1/projects/${projectId}/milestones/${milestoneId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchMilestones();
    } catch (error) {
      console.error("Failed to delete milestone:", error);
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      DISCOVERY: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      UI_UX_DESIGN: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      BACKEND_ARCHITECTURE: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      STAGING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      PRODUCTION: "bg-green-500/10 text-green-400 border-green-500/30",
      MAINTENANCE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    };
    return colors[phase] || "bg-gray-500/10 text-gray-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return <CheckCircle2 size={14} className="text-green-400" />;
      case "IN_PROGRESS":
        return <Clock size={14} className="text-yellow-400" />;
      case "BLOCKED":
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500" />;
    }
  };

  const getDaysUntilDue = (date: string | undefined) => {
    if (!date) return null;
    const days = Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Project Timeline</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} />
          Add Milestone
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddMilestone} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.phase}
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              {PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {phase.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="text"
              placeholder="Milestone Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 col-span-2"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all"
            >
              Add Milestone
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {PHASES.map((phase) => {
            const phaseMilestones = milestones.filter((m) => m.phase === phase);
            const colors = getPhaseColor(phase);

            return (
              <div key={phase} className="space-y-3">
                <div className={`px-4 py-2 rounded-lg border ${colors}`}>
                  <h4 className="font-bold text-sm">{phase.replace(/_/g, " ")}</h4>
                  <p className="text-xs opacity-75">{phaseMilestones.length} milestone(s)</p>
                </div>

                {phaseMilestones.length === 0 ? (
                  <div className="pl-4 text-sm text-gray-600 italic">No milestones yet</div>
                ) : (
                  <div className="space-y-2 pl-4">
                    {phaseMilestones.map((milestone) => {
                      const daysUntilDue = getDaysUntilDue(milestone.targetDate);

                      return (
                        <div
                          key={milestone.id}
                          className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(milestone.status)}
                              <h5 className="font-medium text-white">{milestone.title}</h5>
                            </div>

                            {milestone.description && (
                              <p className="text-xs text-gray-400 mt-1">{milestone.description}</p>
                            )}

                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <div>
                                <span className="text-gray-500">Progress:</span>{" "}
                                <span className="text-cyan-400 font-mono">{milestone.completionPercentage}%</span>
                              </div>
                              {milestone.targetDate && (
                                <div>
                                  <span className="text-gray-500">Due:</span>{" "}
                                  <span
                                    className={
                                      daysUntilDue !== null && daysUntilDue < 0
                                        ? "text-red-400"
                                        : daysUntilDue !== null && daysUntilDue < 7
                                          ? "text-yellow-400"
                                          : "text-green-400"
                                    }
                                  >
                                    {new Date(milestone.targetDate).toLocaleDateString()}
                                    {daysUntilDue !== null && ` (${daysUntilDue} days)`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
