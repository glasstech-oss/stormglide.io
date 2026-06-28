"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Gauge,
  Server,
  Settings,
  Users,
  Clock,
  Zap,
  Lock,
  HardDrive,
  History,
  AlertCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import { DomainsTab } from "@/components/admin/projects/DomainsTab";
import { SubscriptionsTab } from "@/components/admin/projects/SubscriptionsTab";
import { TechStackTab } from "@/components/admin/projects/TechStackTab";
import { CompletionTab } from "@/components/admin/projects/CompletionTab";
import { TimelineTabFull } from "@/components/admin/projects/TimelineTabFull";
import { DeliverablesTabFull } from "@/components/admin/projects/DeliverablesTabFull";
import { FinancesTabFull } from "@/components/admin/projects/FinancesTabFull";
import {
  TeamTabFull,
  HostingTabFull,
  CredentialsTabFull,
  BackupsTabFull,
  HistoryTabFull,
} from "@/components/admin/projects/RemainingTabs";

interface ProjectData {
  id: string;
  projectName: string;
  currentPhase: string;
  client: { companyName: string };
  completion: {
    overallCompletionPercentage: number;
    status: string;
  };
  _count?: {
    domains: number;
    subscriptions: number;
  };
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "deliverables", label: "Deliverables", icon: Zap },
  { id: "tech-stack", label: "Tech Stack", icon: Package },
  { id: "finances", label: "Finances", icon: FileText },
  { id: "team", label: "Team", icon: Users },
  { id: "hosting", label: "Hosting & Infrastructure", icon: Server },
  { id: "domains", label: "Domains & SSL", icon: Lock },
  { id: "credentials", label: "Credentials & Access", icon: Settings },
  { id: "backups", label: "Backups & Security", icon: HardDrive },
  { id: "subscriptions", label: "Subscriptions", icon: AlertCircle },
  { id: "completion", label: "Completion", icon: Gauge },
  { id: "history", label: "History", icon: History },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
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
        Project not found
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
            <p className="text-gray-400 mt-1">{project.client.companyName}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-white/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap rounded-t-lg border-b-2 transition-all ${
                isActive
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
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
        {activeTab === "timeline" && <TimelineTabFull projectId={projectId} />}
        {activeTab === "deliverables" && <DeliverablesTabFull projectId={projectId} />}
        {activeTab === "tech-stack" && <TechStackTab projectId={projectId} />}
        {activeTab === "finances" && <FinancesTabFull projectId={projectId} />}
        {activeTab === "team" && <TeamTabFull projectId={projectId} />}
        {activeTab === "hosting" && <HostingTabFull projectId={projectId} />}
        {activeTab === "domains" && <DomainsTab projectId={projectId} />}
        {activeTab === "credentials" && <CredentialsTabFull projectId={projectId} />}
        {activeTab === "backups" && <BackupsTabFull projectId={projectId} />}
        {activeTab === "subscriptions" && <SubscriptionsTab projectId={projectId} />}
        {activeTab === "completion" && <CompletionTab projectId={projectId} />}
        {activeTab === "history" && <HistoryTabFull projectId={projectId} />}
      </div>
    </div>
  );
}

function OverviewTab({ project }: { project: ProjectData }) {
  return (
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
  );
}
