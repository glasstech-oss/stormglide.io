"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  FileText,
  Gauge,
  Lock,
  Package,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { DomainsTab } from "@/components/admin/projects/DomainsTab";
import { SubscriptionsTab } from "@/components/admin/projects/SubscriptionsTab";
import { TechStackTab } from "@/components/admin/projects/TechStackTab";
import { CompletionTab } from "@/components/admin/projects/CompletionTab";
import { FinancesTabFull } from "@/components/admin/projects/FinancesTabFull";
import { TimeTrackingTab } from "@/components/admin/projects/TimeTrackingTab";
import { ProjectsAPI } from "@/lib/api";

interface ProjectData {
  id: string;
  projectName: string;
  currentPhase: string;
  client?: { companyName?: string };
  completion: {
    overallCompletionPercentage: number;
    status: string;
  };
  _count?: {
    domains: number;
    subscriptions: number;
    milestones?: number;
    expenses?: number;
  };
  summary?: {
    monthlyRecurring: number;
    totalExpenses: number;
    totalInvoiced: number;
    totalPaid: number;
  };
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "progress", label: "Progress", icon: Gauge },
  { id: "technology", label: "Technology", icon: Package },
  { id: "domains", label: "Domains", icon: Lock },
  { id: "costs", label: "Costs & billing", icon: FileText },
  { id: "time", label: "Time", icon: Clock },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ProjectsAPI.get(projectId);
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      setError("This project could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16 text-gray-500">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/projects"
            className="mt-1 p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.projectName}
            </h1>
            <p className="text-gray-400 mt-1">{project.client?.companyName || "Unassigned client"}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto border-b border-white/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "overview" && <OverviewTab project={project} />}
        {activeTab === "progress" && <CompletionTab projectId={projectId} />}
        {activeTab === "technology" && <TechStackTab projectId={projectId} />}
        {activeTab === "domains" && <DomainsTab projectId={projectId} />}
        {activeTab === "costs" && (
          <div className="space-y-10">
            <SubscriptionsTab projectId={projectId} />
            <div className="border-t border-white/10 pt-8"><FinancesTabFull projectId={projectId} /></div>
          </div>
        )}
        {activeTab === "time" && <TimeTrackingTab projectId={projectId} />}
      </div>
    </div>
  );
}

function OverviewTab({ project }: { project: ProjectData }) {
  const summary = project.summary || { monthlyRecurring: 0, totalExpenses: 0, totalInvoiced: 0, totalPaid: 0 };
  const money = (value: number) => new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(value || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Monthly services", value: money(summary.monthlyRecurring), icon: WalletCards, color: "text-cyan-400" },
          { label: "Project payments recorded", value: String(project._count?.expenses || 0), icon: ReceiptText, color: "text-amber-400" },
          { label: "Client payments received", value: money(summary.totalPaid), icon: FileText, color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <item.icon size={18} className={item.color} />
            <div className={`mt-3 text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="mt-1 text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Project Status */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
        <h3 className="text-lg font-bold mb-4">Project Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Phase</span>
              <span className="text-sm font-mono text-cyan-400">
                {project.currentPhase.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Completion</span>
              <span className="text-sm font-mono text-cyan-400">
                {project.completion.overallCompletionPercentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                style={{
                  width: `${project.completion.overallCompletionPercentage}%`,
                }}
              />
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-400">Status: </span>
            <span
              className={`text-sm font-mono ${
                project.completion.status === "ON_TRACK"
                  ? "text-green-400"
                  : project.completion.status === "AT_RISK"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {project.completion.status}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-white/5">
        <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {project._count?.domains || 0}
            </div>
            <div className="text-xs text-gray-500">Domains</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {project._count?.subscriptions || 0}
            </div>
            <div className="text-xs text-gray-500">Services</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
