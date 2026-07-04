"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Save, X } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";

interface TechStackItem {
  name?: string;
  version?: string;
  notes?: string;
}

interface TechStack {
  frontend?: TechStackItem;
  backend?: TechStackItem;
  database?: TechStackItem;
  hosting?: TechStackItem;
  devops?: TechStackItem;
  versionControl?: TechStackItem;
  cicd?: TechStackItem;
  monitoring?: TechStackItem;
}

const TECH_CATEGORIES = [
  { key: "frontend", label: "Frontend", icon: "🎨" },
  { key: "backend", label: "Backend", icon: "⚙️" },
  { key: "database", label: "Database", icon: "🗄️" },
  { key: "hosting", label: "Hosting", icon: "☁️" },
  { key: "devops", label: "DevOps", icon: "🐳" },
  { key: "versionControl", label: "Version Control", icon: "📦" },
  { key: "cicd", label: "CI/CD", icon: "🔄" },
  { key: "monitoring", label: "Monitoring", icon: "📊" },
];

export function TechStackTab({ projectId }: { projectId: string }) {
  const [stack, setStack] = useState<TechStack>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<TechStackItem>({});

  useEffect(() => {
    fetchStack();
  }, [projectId]);

  const fetchStack = async () => {
    try {
      setLoading(true);
      const data = await ProjectsAPI.getTechStack(projectId);
      setStack(data || {});
    } catch (error) {
      console.error("Failed to fetch tech stack:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string) => {
    setEditing(key);
    setFormData((stack as any)[key] || {});
  };

  const handleSave = async (key: string) => {
    try {
      await ProjectsAPI.updateTechStack(projectId, { [key]: formData });
      setStack((prev) => ({ ...prev, [key]: formData }));
      setEditing(null);
    } catch (error) {
      console.error("Failed to update tech stack:", error);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Technology Stack</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TECH_CATEGORIES.map((category) => {
          const item = (stack as any)[category.key];
          const isEditing = editing === category.key;

          return (
            <div
              key={category.key}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">
                  {category.icon} {category.label}
                </h4>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(category.key)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name/Tool"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Version"
                    value={formData.version || ""}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                  <textarea
                    placeholder="Notes"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(category.key)}
                      className="flex-1 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-all flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : item ? (
                <div className="space-y-2 text-sm">
                  {item.name && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tool</div>
                      <div className="text-white font-mono">{item.name}</div>
                    </div>
                  )}
                  {item.version && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Version</div>
                      <div className="text-cyan-400 font-mono">{item.version}</div>
                    </div>
                  )}
                  {item.notes && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Notes</div>
                      <div className="text-gray-300 text-xs">{item.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-600 italic">Not configured</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
