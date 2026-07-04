"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, Calendar, Zap } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate, toDate } from "@/lib/firestore";

interface Completion {
  overallCompletionPercentage: number;
  currentPhase: string;
  status: "ON_TRACK" | "AT_RISK" | "BLOCKED";
  riskFactors: string[];
  healthScore: number;
  estimatedCompletionDate?: SerializedDate;
  actualCompletionDate?: SerializedDate;
  lastAssessedAt: SerializedDate;
}

export function CompletionTab({ projectId }: { projectId: string }) {
  const [completion, setCompletion] = useState<Completion | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    overallCompletionPercentage: 0,
    status: "ON_TRACK",
    riskFactors: "",
    healthScore: 5,
    estimatedCompletionDate: "",
  });

  useEffect(() => {
    fetchCompletion();
  }, [projectId]);

  const fetchCompletion = async () => {
    try {
      setLoading(true);
      const data = await ProjectsAPI.getCompletion(projectId);
      setCompletion(data);
      setFormData({
        overallCompletionPercentage: data.overallCompletionPercentage,
        status: data.status,
        riskFactors: data.riskFactors?.join("\n") || "",
        healthScore: data.healthScore,
        estimatedCompletionDate: toDate(data.estimatedCompletionDate)?.toISOString().split("T")[0] || "",
      });
    } catch (error) {
      console.error("Failed to fetch completion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ProjectsAPI.updateCompletion(projectId, {
        overallCompletionPercentage: Number(formData.overallCompletionPercentage),
        status: formData.status,
        riskFactors: formData.riskFactors.split("\n").filter(f => f.trim()),
        healthScore: Number(formData.healthScore),
        estimatedCompletionDate: formData.estimatedCompletionDate || undefined,
      });
      setEditing(false);
      await fetchCompletion();
    } catch (error) {
      console.error("Failed to update completion:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
        </div>
      </div>
    );
  }

  if (!completion) {
    return <div className="text-center py-12 text-gray-500">Project health not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TRACK":
        return { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" };
      case "AT_RISK":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" };
      case "BLOCKED":
        return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" };
      default:
        return { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400" };
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const statusColors = getStatusColor(completion.status);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold">Project Health & Completion</h3>
        <button
          onClick={() => {
            if (editing) handleSave();
            else setEditing(!editing);
          }}
          className="px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          {editing ? "Save Changes" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Percentage */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-cyan-400" />
            <h4 className="text-lg font-bold">Overall Completion</h4>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.overallCompletionPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overallCompletionPercentage: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={formData.overallCompletionPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overallCompletionPercentage: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          ) : (
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-3">
                {completion.overallCompletionPercentage}%
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${completion.overallCompletionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Health Score */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-purple-400" />
            <h4 className="text-lg font-bold">Health Score</h4>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.healthScore}
                onChange={(e) =>
                  setFormData({ ...formData, healthScore: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={formData.healthScore}
                onChange={(e) =>
                  setFormData({ ...formData, healthScore: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          ) : (
            <div>
              <div className={`text-4xl font-bold ${getHealthColor(completion.healthScore)} mb-3`}>
                {completion.healthScore}/10
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < completion.healthScore
                        ? `${
                            completion.healthScore >= 8
                              ? "bg-green-500"
                              : completion.healthScore >= 6
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className={`p-6 rounded-2xl ${statusColors.bg} border ${statusColors.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle size={20} className={statusColors.text} />
          <h4 className="text-lg font-bold">Status</h4>
        </div>

        {editing ? (
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="ON_TRACK">On Track</option>
            <option value="AT_RISK">At Risk</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        ) : (
          <div className={`text-2xl font-bold ${statusColors.text}`}>
            {completion.status.replace(/_/g, " ")}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-orange-400" />
            <h4 className="text-lg font-bold">Estimated Completion</h4>
          </div>

          {editing ? (
            <input
              type="date"
              value={formData.estimatedCompletionDate}
              onChange={(e) =>
                setFormData({ ...formData, estimatedCompletionDate: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          ) : completion.estimatedCompletionDate ? (
            <div className="text-lg text-orange-400 font-mono">
              {formatDate(completion.estimatedCompletionDate)}
            </div>
          ) : (
            <div className="text-gray-600">Not set</div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-green-400" />
            <h4 className="text-lg font-bold">Actual Completion</h4>
          </div>

          {completion.actualCompletionDate ? (
            <div className="text-lg text-green-400 font-mono">
              {formatDate(completion.actualCompletionDate)}
            </div>
          ) : (
            <div className="text-gray-600">Not completed yet</div>
          )}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
        <h4 className="text-lg font-bold mb-4">Risk Factors</h4>

        {editing ? (
          <textarea
            value={formData.riskFactors}
            onChange={(e) => setFormData({ ...formData, riskFactors: e.target.value })}
            placeholder="Enter risk factors (one per line)"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            rows={4}
          />
        ) : completion.riskFactors && completion.riskFactors.length > 0 ? (
          <ul className="space-y-2">
            {completion.riskFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400 mt-1">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600 text-sm">No risk factors identified</div>
        )}
      </div>

      {/* Last Assessed */}
      <div className="text-xs text-gray-500 text-right">
        Last assessed: {toDate(completion.lastAssessedAt)?.toLocaleString() || "Not recorded"}
      </div>
    </div>
  );
}
