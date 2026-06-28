"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

interface Deliverable {
  id: string;
  title: string;
  description: string;
  phase: string;
  isCompleted: boolean;
  completedAt?: string;
}

export function DeliverablesTabFull({ projectId }: { projectId: string }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phase: "DISCOVERY",
  });

  useEffect(() => {
    // Mock data - in real implementation would fetch from backend
    const mockDeliverables: Deliverable[] = [
      {
        id: "1",
        title: "Project Requirements Document",
        description: "Complete project scope, timelines, and deliverables",
        phase: "DISCOVERY",
        isCompleted: true,
        completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Wireframes & User Flows",
        description: "Create wireframes for all major user journeys",
        phase: "UI_UX_DESIGN",
        isCompleted: true,
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        title: "API Documentation",
        description: "Document all REST endpoints and data models",
        phase: "BACKEND_ARCHITECTURE",
        isCompleted: false,
      },
      {
        id: "4",
        title: "Database Schema",
        description: "Design and implement database schema",
        phase: "BACKEND_ARCHITECTURE",
        isCompleted: true,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "5",
        title: "Staging Environment Setup",
        description: "Configure staging servers and deployment pipeline",
        phase: "STAGING",
        isCompleted: false,
      },
    ];
    setDeliverables(mockDeliverables);
    setLoading(false);
  }, [projectId]);

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeliverable: Deliverable = {
      id: Date.now().toString(),
      ...formData,
      isCompleted: false,
    };
    setDeliverables([...deliverables, newDeliverable]);
    setFormData({ title: "", description: "", phase: "DISCOVERY" });
    setShowForm(false);
  };

  const handleToggleComplete = (id: string) => {
    setDeliverables(
      deliverables.map((d) =>
        d.id === id
          ? {
              ...d,
              isCompleted: !d.isCompleted,
              completedAt: !d.isCompleted ? new Date().toISOString() : undefined,
            }
          : d
      )
    );
  };

  const handleDelete = (id: string) => {
    setDeliverables(deliverables.filter((d) => d.id !== id));
  };

  const completedCount = deliverables.filter((d) => d.isCompleted).length;
  const completionPercentage = Math.round((completedCount / deliverables.length) * 100) || 0;

  const groupedByPhase = deliverables.reduce(
    (acc, d) => {
      if (!acc[d.phase]) acc[d.phase] = [];
      acc[d.phase].push(d);
      return acc;
    },
    {} as Record<string, Deliverable[]>
  );

  const phaseOrder = [
    "DISCOVERY",
    "UI_UX_DESIGN",
    "BACKEND_ARCHITECTURE",
    "STAGING",
    "PRODUCTION",
    "MAINTENANCE",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">Project Deliverables</h3>
          <div className="mt-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">
                {completedCount} of {deliverables.length} completed
              </span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-cyan-400 font-mono text-sm">{completionPercentage}%</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} />
          Add Deliverable
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddDeliverable} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <input
            type="text"
            placeholder="Deliverable Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            rows={2}
          />
          <select
            value={formData.phase}
            onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
          >
            {phaseOrder.map((phase) => (
              <option key={phase} value={phase}>
                {phase.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all"
            >
              Add Deliverable
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
        <div className="space-y-6">
          {phaseOrder.map((phase) => {
            const phaseDeliverables = groupedByPhase[phase] || [];
            if (phaseDeliverables.length === 0) return null;

            const phaseCompleted = phaseDeliverables.filter((d) => d.isCompleted).length;
            const phasePercentage = Math.round((phaseCompleted / phaseDeliverables.length) * 100);

            const phaseColors: Record<string, string> = {
              DISCOVERY: "from-blue-500 to-blue-600",
              UI_UX_DESIGN: "from-purple-500 to-purple-600",
              BACKEND_ARCHITECTURE: "from-indigo-500 to-indigo-600",
              STAGING: "from-yellow-500 to-yellow-600",
              PRODUCTION: "from-green-500 to-green-600",
              MAINTENANCE: "from-cyan-500 to-cyan-600",
            };

            return (
              <div key={phase} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">{phase.replace(/_/g, " ")}</h4>
                  <span className="text-xs text-gray-400">
                    {phaseCompleted}/{phaseDeliverables.length} ({phasePercentage}%)
                  </span>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-white/10">
                  {phaseDeliverables.map((deliverable) => (
                    <div
                      key={deliverable.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleComplete(deliverable.id)}
                            className="mt-1 text-gray-400 hover:text-cyan-400 transition-all"
                          >
                            {deliverable.isCompleted ? (
                              <CheckCircle2 size={18} className="text-green-400" />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                          <div className="flex-1">
                            <h5 className={`font-medium ${deliverable.isCompleted ? "line-through text-gray-500" : "text-white"}`}>
                              {deliverable.title}
                            </h5>
                            <p className="text-xs text-gray-400 mt-1">{deliverable.description}</p>
                            {deliverable.completedAt && (
                              <p className="text-xs text-green-400 mt-2">
                                Completed {new Date(deliverable.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(deliverable.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const phaseOrder = [
  "DISCOVERY",
  "UI_UX_DESIGN",
  "BACKEND_ARCHITECTURE",
  "STAGING",
  "PRODUCTION",
  "MAINTENANCE",
];
