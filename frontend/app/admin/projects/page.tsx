"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { ProjectsAPI } from "@/lib/api";

type ApiDate = string | { _seconds?: number; seconds?: number } | null;

function formatDate(value: ApiDate) {
  if (!value) return "Not recorded";
  const seconds = typeof value === "object" ? value._seconds ?? value.seconds : undefined;
  const date = seconds ? new Date(seconds * 1000) : new Date(value as string);
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleDateString();
}

interface Project {
  id: string;
  projectName: string;
  currentPhase: string;
  client?: { companyName?: string };
  completion: {
    overallCompletionPercentage: number;
    status: "ON_TRACK" | "AT_RISK" | "BLOCKED";
  };
  _count: {
    milestones: number;
    domains: number;
    subscriptions: number;
  };
  createdAt: ApiDate;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPhase, setFilterPhase] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [filterPhase, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ProjectsAPI.list({
        ...(filterPhase && { phase: filterPhase }),
        ...(filterStatus && { status: filterStatus }),
      });
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
      setError("Projects could not be loaded. Refresh the page or sign in again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      DISCOVERY: "bg-blue-500/10 text-blue-400",
      UI_UX_DESIGN: "bg-purple-500/10 text-purple-400",
      BACKEND_ARCHITECTURE: "bg-indigo-500/10 text-indigo-400",
      STAGING: "bg-yellow-500/10 text-yellow-400",
      PRODUCTION: "bg-green-500/10 text-green-400",
      MAINTENANCE: "bg-cyan-500/10 text-cyan-400",
    };
    return colors[phase] || "bg-gray-500/10 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TRACK":
        return "text-green-400";
      case "AT_RISK":
        return "text-yellow-400";
      case "BLOCKED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "BLOCKED":
        return <AlertCircle size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
          <p className="text-gray-400">
            Manage all client projects and track delivery progress
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-500/60 rounded-lg text-cyan-400 transition-all"
        >
          <Plus size={18} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
          />
        </div>

        <select
          value={filterPhase || ""}
          onChange={(e) => setFilterPhase(e.target.value || null)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
        >
          <option value="">All Phases</option>
          <option value="DISCOVERY">Discovery</option>
          <option value="UI_UX_DESIGN">UI/UX Design</option>
          <option value="BACKEND_ARCHITECTURE">Backend Architecture</option>
          <option value="STAGING">Staging</option>
          <option value="PRODUCTION">Production</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
        >
          <option value="">All Status</option>
          <option value="ON_TRACK">On Track</option>
          <option value="AT_RISK">At Risk</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No projects found. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {project.client?.companyName || "Unassigned client"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(project.currentPhase)}`}
                  >
                    {project.currentPhase.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(project.completion.status)}
                    <span
                      className={`text-xs font-medium ${getStatusColor(project.completion.status)}`}
                    >
                      {project.completion.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Completion</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                          style={{
                            width: `${project.completion.overallCompletionPercentage}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-cyan-400 font-mono">
                        {project.completion.overallCompletionPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Milestones</div>
                      <div className="text-white font-bold">
                        {project._count.milestones}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Domains</div>
                      <div className="text-white font-bold">
                        {project._count.domains}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Services</div>
                      <div className="text-white font-bold">
                        {project._count.subscriptions}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Created{" "}
                  {formatDate(project.createdAt)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
