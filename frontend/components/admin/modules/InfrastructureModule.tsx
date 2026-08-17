"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe, ShieldCheck, Activity, X,
    AlertTriangle, CheckCircle2, XCircle, RefreshCw,
    Flame, Loader2, HelpCircle, Radio
} from "lucide-react";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonitoringAPI, ProjectsAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";

type CheckStatus = "HEALTHY" | "WARNING" | "CRITICAL" | "UNKNOWN";

interface DomainInfo {
    domainName: string;
    registrar: string;
    expiresAt: Date | null;
    daysLeft: number | null;
    autoRenew: boolean;
}

interface SSLInfo {
    status: CheckStatus;
    issuer: string | null;
    daysLeft: number | null;
    checkedAt: Date | null;
}

interface UptimeInfo {
    status: CheckStatus;
    statusCode: number | null;
    latencyMs: number | null;
    checkedAt: Date | null;
}

interface BudgetInfo {
    configured: boolean;
    budgetAmount: number | null;
    currencyCode: string | null;
    costAmount: number | null;
    pct: number | null;
    updatedAt: Date | null;
}

interface ClientInfra {
    id: string;
    clientId: string;
    name: string;
    projectName: string;
    url: string | null;
    domain: DomainInfo | null;
    ssl: SSLInfo;
    uptime: UptimeInfo;
    budget: BudgetInfo | null;
}

function statusColor(status: CheckStatus) {
    const map = {
        HEALTHY: "text-emerald-400",
        WARNING: "text-amber-400",
        CRITICAL: "text-red-400",
        UNKNOWN: "text-gray-500",
    };
    return map[status];
}

function healthScore(c: ClientInfra): number {
    let score = 100;
    if (c.ssl.status === "CRITICAL") score -= 40;
    else if (c.ssl.status === "WARNING") score -= 15;
    if (c.uptime.status === "CRITICAL") score -= 40;
    else if (c.uptime.status === "WARNING") score -= 15;
    const domainDaysLeft = c.domain?.daysLeft;
    if (domainDaysLeft !== null && domainDaysLeft !== undefined) {
        if (domainDaysLeft < 7) score -= 20;
        else if (domainDaysLeft < 30) score -= 8;
    }
    if (!c.domain?.autoRenew) score -= 5;
    if (c.budget?.pct !== null && c.budget?.pct !== undefined) {
        if (c.budget.pct >= 100) score -= 15;
        else if (c.budget.pct >= 90) score -= 5;
    }
    return Math.max(0, Math.min(100, score));
}

function healthColor(score: number) {
    if (score >= 90) return { text: "text-emerald-400", ring: "border-emerald-500/30", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]", bar: "bg-emerald-500" };
    if (score >= 70) return { text: "text-cyan-400", ring: "border-cyan-500/30", glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]", bar: "bg-cyan-500" };
    if (score >= 50) return { text: "text-amber-400", ring: "border-amber-500/30", glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]", bar: "bg-amber-500" };
    return { text: "text-red-400", ring: "border-red-500/30", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]", bar: "bg-red-500" };
}

function relativeTime(date: Date | null): string {
    if (!date) return "Never checked";
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function BudgetCard({ budget, clientName }: { budget: BudgetInfo; clientName: string }) {
    if (!budget.configured) {
        return (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Flame size={16} className="text-gray-600" />
                    <span className="text-sm font-bold text-gray-400">Cloud budget</span>
                </div>
                <p className="text-xs text-gray-600">Billing isn't enabled on this project yet — no budget alerts can be configured until it is.</p>
            </div>
        );
    }
    if (budget.pct === null) {
        return (
            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <div className="flex items-center gap-2 mb-2">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-sm font-bold text-white">Cloud budget</span>
                </div>
                <p className="text-xs text-gray-500">
                    Budget set at {budget.currencyCode} {budget.budgetAmount?.toFixed(2)}/mo. No threshold crossed yet this period — spend is currently below 50%.
                </p>
            </div>
        );
    }
    const pct = budget.pct;
    const barColor = pct >= 100 ? "bg-red-500" : pct >= 90 ? "bg-amber-500" : "bg-orange-400";
    return (
        <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-sm font-bold text-white">Cloud budget</span>
                </div>
                <span className={`text-xs font-bold font-mono ${pct >= 100 ? "text-red-400" : pct >= 90 ? "text-amber-400" : "text-orange-300"}`}>
                    {pct}% used
                </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, pct)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span className="font-mono">{budget.currencyCode} {budget.costAmount?.toFixed(2)} / {budget.budgetAmount?.toFixed(2)}</span>
                <span className="font-mono">{relativeTime(budget.updatedAt)}</span>
            </div>
        </div>
    );
}

// Daily rollup from the GCP billing export (see functions/index.js
// dailySpendRollup). Export has next-day latency and has to be manually
// pointed at the billing_export BigQuery dataset from the GCP Console per
// billing account — until that's done and a day has passed, this is
// empty, not broken.
function SpendHistoryChart({ clientId }: { clientId: string }) {
    const [history, setHistory] = useState<{ date: string; cost: number }[] | null>(null);

    useEffect(() => {
        MonitoringAPI.getSpendHistory(clientId, 30)
            .then((entries: any[]) => setHistory((entries || []).map((e) => ({ date: e.date.slice(5), cost: Number(e.cost) || 0 }))))
            .catch(() => setHistory([]));
    }, [clientId]);

    return (
        <div className="p-5 rounded-2xl bg-[#111827] border border-white/5">
            <div className="text-sm font-bold text-white mb-4">Spend — last 30 days</div>
            {history === null ? (
                <div className="h-[140px] flex items-center justify-center"><Loader2 size={18} className="animate-spin text-cyan-400" /></div>
            ) : history.length === 0 ? (
                <p className="text-xs text-gray-600">No historical spend data yet. This fills in once the GCP billing export is pointed at this project and a day has passed.</p>
            ) : (
                <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                            <Line type="monotone" dataKey="cost" stroke="#fb923c" strokeWidth={2} dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

function ClientDetail({ client, onClose }: { client: ClientInfra; onClose: () => void }) {
    const score = healthScore(client);
    const hc = healthColor(score);
    return (
        <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0d1117] border-l border-white/5 z-50 overflow-y-auto flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{client.projectName}</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold ${hc.ring} ${hc.text}`}>
                        Health: {score}/100
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 p-8 space-y-6">
                {/* Domain */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Globe size={15} className="text-cyan-400" /> Domain
                    </div>
                    {client.domain ? (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { label: "Domain", value: client.domain.domainName },
                                { label: "Registrar", value: client.domain.registrar },
                                { label: "Expires", value: client.domain.expiresAt?.toLocaleDateString() ?? "Unknown" },
                                {
                                    label: "Days Left",
                                    value: client.domain.daysLeft === null
                                        ? "Unknown"
                                        : <span className={client.domain.daysLeft < 30 ? "text-red-400 font-bold" : "text-white"}>{client.domain.daysLeft}d</span>
                                },
                                {
                                    label: "Auto-Renew",
                                    value: client.domain.autoRenew
                                        ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> ON</span>
                                        : <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> OFF</span>
                                },
                            ].map((row, i) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{row.label}</span>
                                    <span className="text-white text-sm">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600">No domain on file for this project.</p>
                    )}
                </div>

                {/* SSL */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <ShieldCheck size={15} className="text-cyan-400" /> SSL Certificate
                        </div>
                        <span className={`text-xs font-mono font-bold ${statusColor(client.ssl.status)}`}>{client.ssl.status}</span>
                    </div>
                    {client.ssl.status === "UNKNOWN" ? (
                        <p className="text-xs text-gray-600">No check has run yet — the monitoring cycle checks every 6 hours.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Issuer", value: client.ssl.issuer ?? "Unknown" },
                                { label: "Days Left", value: client.ssl.daysLeft ?? "—" },
                                { label: "Last Checked", value: relativeTime(client.ssl.checkedAt) },
                            ].map((m, i) => (
                                <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                                    <div className="text-[10px] font-mono text-gray-600 mb-1 uppercase">{m.label}</div>
                                    <div className="text-sm font-bold font-mono text-white">{m.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Uptime */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Activity size={15} className="text-cyan-400" /> Uptime
                        </div>
                        <span className={`text-xs font-mono font-bold ${statusColor(client.uptime.status)}`}>{client.uptime.status}</span>
                    </div>
                    {client.uptime.status === "UNKNOWN" ? (
                        <p className="text-xs text-gray-600">No check has run yet — the monitoring cycle checks every 6 hours.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Status Code", value: client.uptime.statusCode ?? "—" },
                                { label: "Latency", value: client.uptime.latencyMs !== null ? `${client.uptime.latencyMs}ms` : "—" },
                                { label: "Checked", value: relativeTime(client.uptime.checkedAt) },
                            ].map((m, i) => (
                                <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                                    <div className="text-[10px] font-mono text-gray-600 mb-1 uppercase">{m.label}</div>
                                    <div className="text-sm font-bold font-mono text-white">{m.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cloud budget */}
                {client.budget && <BudgetCard budget={client.budget} clientName={client.name} />}
                {client.budget?.configured && <SpendHistoryChart clientId={client.clientId} />}
            </div>
        </div>
    );
}

export default function InfrastructureModule() {
    const [selected, setSelected] = useState<ClientInfra | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [domains, setDomains] = useState<any[]>([]);
    const [snapshots, setSnapshots] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

    const load = useCallback(async () => {
        setError(null);
        try {
            const [projectsRes, domainsRes, snapshotsRes, budgetsRes] = await Promise.all([
                ProjectsAPI.list(),
                ProjectsAPI.getAllDomains(),
                MonitoringAPI.getInfraSummary(),
                MonitoringAPI.getBudgets(),
            ]);
            setProjects(projectsRes || []);
            setDomains(domainsRes || []);
            setSnapshots(snapshotsRes || []);
            setBudgets(budgetsRes || []);
            setLastLoadedAt(new Date());
        } catch {
            setError("Couldn't load infrastructure data. Try refreshing.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await load();
        setTimeout(() => setRefreshing(false), 500);
    };

    const clients: ClientInfra[] = useMemo(() => {
        return projects
            .filter((p) => p.productionUrl || p.stagingUrl)
            .map((p) => {
                const domainRecord = domains.find((d) => d.projectId === p.id);
                const domain: DomainInfo | null = domainRecord ? {
                    domainName: domainRecord.domainName,
                    registrar: domainRecord.registrar,
                    expiresAt: toDate(domainRecord.expirationDate),
                    daysLeft: (() => {
                        const d = toDate(domainRecord.expirationDate);
                        return d ? Math.floor((d.getTime() - Date.now()) / 86400000) : null;
                    })(),
                    autoRenew: domainRecord.autoRenew !== false,
                } : null;

                const sslSnap = snapshots.find((s) => s.clientId === p.clientId && s.checkType === "SSL");
                const ssl: SSLInfo = sslSnap ? {
                    status: (sslSnap.status || "UNKNOWN") as CheckStatus,
                    issuer: sslSnap.details?.issuer ?? null,
                    daysLeft: sslSnap.details?.daysLeft ?? null,
                    checkedAt: toDate(sslSnap.checkedAt),
                } : { status: "UNKNOWN", issuer: null, daysLeft: null, checkedAt: null };

                const uptimeSnap = snapshots.find((s) => s.clientId === p.clientId && s.checkType === "UPTIME");
                const uptime: UptimeInfo = uptimeSnap ? {
                    status: (uptimeSnap.status || "UNKNOWN") as CheckStatus,
                    statusCode: uptimeSnap.details?.statusCode ?? null,
                    latencyMs: uptimeSnap.details?.latencyMs ?? null,
                    checkedAt: toDate(uptimeSnap.checkedAt),
                } : { status: "UNKNOWN", statusCode: null, latencyMs: null, checkedAt: null };

                const budgetRecord = budgets.find((b) => b.clientId === p.clientId);
                const budget: BudgetInfo | null = budgetRecord ? {
                    configured: budgetRecord.configured,
                    budgetAmount: budgetRecord.budgetAmount,
                    currencyCode: budgetRecord.currencyCode,
                    costAmount: budgetRecord.latest?.costAmount ?? null,
                    pct: budgetRecord.latest?.pct ?? null,
                    updatedAt: toDate(budgetRecord.latest?.updatedAt),
                } : null;

                return {
                    id: p.id,
                    clientId: p.clientId,
                    name: p.client?.companyName || "Unassigned client",
                    projectName: p.projectName,
                    url: p.productionUrl || p.stagingUrl,
                    domain,
                    ssl,
                    uptime,
                    budget,
                };
            });
    }, [projects, domains, snapshots, budgets]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
            </div>
        );
    }

    return (
        <div className="relative space-y-8">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Domain, SSL, uptime, and cloud budget status for every monitored client project.</p>
                    {lastLoadedAt && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                            <Radio size={9} className="animate-pulse" /> {lastLoadedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={14} className={refreshing ? "animate-spin text-cyan-400" : ""} />
                    {refreshing ? "Refreshing..." : "Refresh All"}
                </button>
            </div>

            {clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <HelpCircle size={28} className="text-gray-600" />
                    <p className="text-sm text-gray-500">No monitored projects yet — add a production or staging URL to a project to start tracking it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {clients.map((client, i) => {
                        const score = healthScore(client);
                        const hc = healthColor(score);
                        const hasWarning = client.ssl.status !== "HEALTHY" || client.uptime.status !== "HEALTHY"
                            || (client.domain?.daysLeft !== null && client.domain?.daysLeft !== undefined && client.domain.daysLeft < 30)
                            || (client.budget?.pct !== null && client.budget?.pct !== undefined && client.budget.pct >= 90);

                        return (
                            <motion.div
                                key={client.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => setSelected(client)}
                                className={`p-6 rounded-3xl bg-[#111827] border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200 group ${hc.glow}`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm mb-1">{client.name}</h4>
                                        <span className="text-xs font-mono text-gray-500">{client.domain?.domainName || client.url}</span>
                                    </div>
                                    {hasWarning && (
                                        <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <AlertTriangle size={12} className="text-amber-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Health */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Health</span>
                                        <span className={`text-xl font-bold ${hc.text}`}>{score}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.07 }}
                                            className={`h-full rounded-full ${hc.bar}`}
                                        />
                                    </div>
                                </div>

                                {/* Quick metrics */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                        <ShieldCheck size={12} className={statusColor(client.ssl.status)} />
                                        <div>
                                            <div className="text-[9px] font-mono text-gray-600">SSL</div>
                                            <div className={`text-xs font-bold ${statusColor(client.ssl.status)}`}>
                                                {client.ssl.status === "UNKNOWN" ? "Unchecked" : `${client.ssl.daysLeft}d left`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                        <Activity size={12} className={statusColor(client.uptime.status)} />
                                        <div>
                                            <div className="text-[9px] font-mono text-gray-600">Uptime</div>
                                            <div className={`text-xs font-bold ${statusColor(client.uptime.status)}`}>
                                                {client.uptime.status === "UNKNOWN" ? "Unchecked" : client.uptime.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                        <Globe size={12} className={client.domain?.daysLeft !== null && client.domain?.daysLeft !== undefined && client.domain.daysLeft < 30 ? "text-amber-400" : "text-gray-400"} />
                                        <div>
                                            <div className="text-[9px] font-mono text-gray-600">Domain</div>
                                            <div className={`text-xs font-bold ${client.domain?.daysLeft !== null && client.domain?.daysLeft !== undefined && client.domain.daysLeft < 30 ? "text-amber-400" : "text-white"}`}>
                                                {client.domain?.daysLeft !== null && client.domain?.daysLeft !== undefined ? `${client.domain.daysLeft}d left` : "No data"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                        <Flame size={12} className={!client.budget?.configured ? "text-gray-600" : (client.budget?.pct ?? 0) >= 90 ? "text-red-400" : "text-orange-400"} />
                                        <div>
                                            <div className="text-[9px] font-mono text-gray-600">Budget</div>
                                            <div className={`text-xs font-bold ${!client.budget?.configured ? "text-gray-600" : (client.budget?.pct ?? 0) >= 90 ? "text-red-400" : "text-white"}`}>
                                                {!client.budget?.configured ? "N/A" : client.budget.pct !== null ? `${client.budget.pct}%` : "< 50%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Detail Slide-over */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-xl z-50"
                        >
                            <ClientDetail client={selected} onClose={() => setSelected(null)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
