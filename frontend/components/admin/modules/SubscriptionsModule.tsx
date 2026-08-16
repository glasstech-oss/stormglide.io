"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, AlertTriangle, TrendingDown, Loader2 } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";

type SubStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

interface Subscription {
    id: string;
    projectId: string;
    client: string;
    serviceName: string;
    monthlyCost: number;
    billingFrequency: "MONTHLY" | "ANNUAL" | "ONE_TIME";
    renewalDate: Date | null;
    autoRenew: boolean;
    status: SubStatus;
}

function daysLeft(date: Date | null) {
    if (!date) return null;
    return Math.floor((date.getTime() - Date.now()) / 86400000);
}

export default function SubscriptionsModule() {
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [clientFilter, setClientFilter] = useState("All Clients");

    const load = useCallback(async () => {
        try {
            const [apiSubs, projects] = await Promise.all([ProjectsAPI.getAllSubscriptions(), ProjectsAPI.list()]);
            const clientMap = new Map((projects || []).map((p: any) => [p.id, p.client?.companyName || p.projectName]));
            const mapped: Subscription[] = (apiSubs || []).map((s: any) => ({
                id: s.id,
                projectId: s.projectId,
                client: clientMap.get(s.projectId) || "Unassigned",
                serviceName: s.serviceName,
                monthlyCost: Number(s.monthlyCost) || 0,
                billingFrequency: s.billingFrequency || "MONTHLY",
                renewalDate: toDate(s.renewalDate),
                autoRenew: s.autoRenew !== false,
                status: (s.status || "ACTIVE") as SubStatus,
            }));
            setSubs(mapped);
        } catch {
            // leave subs empty — an honest empty list beats fake vendor costs
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const clients = useMemo(() => ["All Clients", ...new Set(subs.map((s) => s.client))], [subs]);

    const filtered = subs.filter((s) => clientFilter === "All Clients" || s.client === clientFilter);
    const active = subs.filter((s) => s.status === "ACTIVE");
    const totalMonthly = active.filter((s) => s.billingFrequency === "MONTHLY").reduce((a, s) => a + s.monthlyCost, 0);
    const renewingSoon = active.filter((s) => {
        const d = daysLeft(s.renewalDate);
        return d !== null && d <= 7;
    }).length;

    const clientRollup = useMemo(() => {
        const names = [...new Set(active.map((s) => s.client))];
        return names
            .map((name) => {
                const clientSubs = active.filter((s) => s.client === name && s.billingFrequency === "MONTHLY");
                return { name, cost: clientSubs.reduce((a, s) => a + s.monthlyCost, 0), count: clientSubs.length };
            })
            .filter((r) => r.count > 0)
            .sort((a, b) => b.cost - a.cost);
    }, [active]);
    const maxCost = Math.max(...clientRollup.map((r) => r.cost), 1);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Monthly Recurring Cost", value: `GHS ${totalMonthly.toLocaleString()}`, icon: TrendingDown, color: "cyan", note: "across active monthly subscriptions" },
                    { label: "Active Subscriptions", value: active.length, icon: CheckCircle2, color: "emerald", note: "across all projects" },
                    { label: "Renewing This Week", value: renewingSoon, icon: Clock, color: "amber", note: "within 7 days" },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5">
                        <div className={`text-${s.color}-400 mb-3`}><s.icon size={18} /></div>
                        <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                        <div className="text-xl font-bold text-white font-mono">{s.value}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{s.note}</div>
                    </motion.div>
                ))}
            </div>

            {clientRollup.length > 0 && (
                <div className="p-6 rounded-3xl bg-[#111827] border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                        <TrendingDown size={15} className="text-cyan-400" /> Monthly cost by client
                    </h3>
                    <div className="space-y-3">
                        {clientRollup.map((row, i) => (
                            <div key={row.name} className="flex items-center gap-4">
                                <div className="text-xs text-gray-400 w-40 flex-shrink-0 truncate">{row.name}</div>
                                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(row.cost / maxCost) * 100}%` }}
                                        transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.08 }}
                                        className="h-full bg-gradient-to-r from-cyan-500/70 to-purple-500/40 rounded-full"
                                    />
                                </div>
                                <div className="text-xs font-mono text-white w-28 text-right flex-shrink-0">
                                    GHS {row.cost.toLocaleString()}<span className="text-gray-600 ml-1">({row.count})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50">
                    {clients.map((c) => <option key={c}>{c}</option>)}
                </select>
                <p className="ml-auto self-center text-xs text-gray-600">Add or remove subscriptions from a project's own Subscriptions tab.</p>
            </div>

            <div className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Service</span><span>Client</span><span>Frequency</span><span>Monthly Cost</span><span>Renewal</span>
                </div>
                <div className="divide-y divide-white/5">
                    {filtered.map((sub, i) => {
                        const d = daysLeft(sub.renewalDate);
                        const renewingSoonRow = d !== null && d <= 7;
                        return (
                            <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] gap-2 md:gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        {sub.serviceName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{sub.serviceName}</div>
                                        {renewingSoonRow && <div className="text-[10px] text-amber-400 font-mono">Renewing soon</div>}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400 truncate">{sub.client}</div>
                                <div className="text-xs text-gray-500 px-2 py-1 rounded-lg bg-white/5 w-fit capitalize">{sub.billingFrequency.toLowerCase().replace('_', ' ')}</div>
                                <div className="font-mono font-bold text-white text-sm">
                                    {sub.billingFrequency === "MONTHLY" ? `GHS ${sub.monthlyCost.toLocaleString()}` : "—"}
                                </div>
                                <div className="flex items-center gap-2">
                                    {renewingSoonRow ? <AlertTriangle size={12} className="text-amber-400" /> : <CheckCircle2 size={12} className="text-emerald-400" />}
                                    <span className="text-xs font-mono text-gray-400">{sub.renewalDate?.toLocaleDateString() ?? "—"}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-16 text-gray-600">
                            <Package size={24} />
                            <p className="text-sm font-mono">{subs.length === 0 ? "No subscriptions tracked yet." : "No subscriptions for this client."}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
