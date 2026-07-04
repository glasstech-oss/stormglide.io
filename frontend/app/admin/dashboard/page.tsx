"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Globe2, Package, Plus, Users } from "lucide-react";
import { CrmAPI, ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate } from "@/lib/firestore";
import { useAdminStore } from "@/store/adminStore";
import CRMModule from "@/components/admin/modules/CRMModule";
import BillingModule from "@/components/admin/modules/BillingModule";
import SettingsPage from "../settings/page";

const PAGE_META: Record<string, { title: string; description: string }> = {
    dashboard: { title: "Overview", description: "A clear view of your clients and active project work." },
    crm: { title: "Clients", description: "Client contacts and their connected projects." },
    billing: { title: "Payments", description: "Client invoices and project expenses in one ledger." },
    settings: { title: "Website settings", description: "Manage public website branding and content." },
};

interface ProjectSummary {
    id: string;
    projectName: string;
    currentPhase?: string;
    client?: { companyName?: string };
    completion?: { overallCompletionPercentage?: number; status?: string };
    _count?: { domains?: number; subscriptions?: number };
    createdAt?: SerializedDate;
}

export default function DashboardPage() {
    const { activeTab } = useAdminStore();
    const page = PAGE_META[activeTab] || PAGE_META.dashboard;

    return (
        <div className="mx-auto max-w-7xl space-y-7 pb-12">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{page.title}</h1>
                <p className="mt-2 text-sm text-slate-400">{page.description}</p>
            </div>

            {activeTab === "crm" && <CRMModule />}
            {activeTab === "billing" && <BillingModule />}
            {activeTab === "settings" && <SettingsPage />}
            {!PAGE_META[activeTab] || activeTab === "dashboard" ? <Overview /> : null}
        </div>
    );
}

function Overview() {
    const { setActiveTab } = useAdminStore();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [clientCount, setClientCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([ProjectsAPI.list(), CrmAPI.getClients()])
            .then(([projectData, clientData]) => {
                setProjects(Array.isArray(projectData) ? projectData : []);
                const clients = Array.isArray(clientData) ? clientData : clientData?.clients || [];
                setClientCount(clients.length);
            })
            .catch((requestError) => {
                console.error("Failed to load admin overview:", requestError);
                setError("The overview could not be loaded. Refresh the page to try again.");
            })
            .finally(() => setLoading(false));
    }, []);

    const domainCount = projects.reduce((total, project) => total + Number(project._count?.domains || 0), 0);
    const serviceCount = projects.reduce((total, project) => total + Number(project._count?.subscriptions || 0), 0);

    if (loading) return <div className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />;

    return (
        <div className="space-y-7">
            {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                    { label: "Clients", value: clientCount, icon: Users },
                    { label: "Projects", value: projects.length, icon: BriefcaseBusiness },
                    { label: "Domains", value: domainCount, icon: Globe2 },
                    { label: "Active services", value: serviceCount, icon: Package },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-[#101722] p-4 md:p-5">
                        <item.icon size={18} className="text-blue-400" />
                        <div className="mt-4 text-2xl font-semibold text-white">{item.value}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="overflow-hidden rounded-xl border border-white/10 bg-[#101722]">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-white">Recent projects</h2>
                            <p className="mt-1 text-xs text-slate-500">Open a project to manage its domains, services and payments.</p>
                        </div>
                        <Link href="/admin/projects" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">View all <ArrowRight size={15} /></Link>
                    </div>
                    {projects.length === 0 ? (
                        <div className="px-5 py-12 text-center text-sm text-slate-500">No projects yet.</div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {projects.slice(0, 6).map((project) => (
                                <Link key={project.id} href={`/admin/projects/${project.id}`} className="grid gap-2 px-5 py-4 transition hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1fr)_150px_90px] sm:items-center">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-white">{project.projectName}</div>
                                        <div className="mt-1 text-xs text-slate-500">{project.client?.companyName || "Unassigned client"}</div>
                                    </div>
                                    <div className="text-xs text-slate-400">{(project.currentPhase || "DISCOVERY").replace(/_/g, " ")}</div>
                                    <div className="text-xs text-slate-500 sm:text-right">{formatDate(project.createdAt, "New")}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="space-y-3">
                    <h2 className="text-sm font-semibold text-white">Quick actions</h2>
                    <Link href="/admin/projects/new" className="flex min-h-12 items-center gap-3 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400">
                        <Plus size={17} /> Create project
                    </Link>
                    <button onClick={() => setActiveTab("crm")} className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                        <Users size={17} /> Manage clients
                    </button>
                    <button onClick={() => setActiveTab("billing")} className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                        <ArrowRight size={17} /> Review payments
                    </button>
                </aside>
            </div>
        </div>
    );
}
