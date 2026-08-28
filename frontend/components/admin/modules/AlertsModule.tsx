"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertSeverity, AlertType } from "@/lib/alertsData";
import { MonitoringAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";
import {
    Globe, ShieldCheck, Flame, FileText, Database, Activity,
    Shield, Bell, CheckCircle2, XCircle, Filter, ChevronDown, Loader2, Repeat
} from "lucide-react";

// Every key here must have a matching case emitted by the backend's
// createAlertIfNew callers (functions/index.js) — a real alert whose type
// isn't a key crashes this whole module (TYPE_CFG[alert.type] is undefined,
// then .icon throws). domain/firebase/invoice/backup/security are legacy —
// nothing currently emits them — kept for forward-compat, not dead weight
// to remove.
const TYPE_CFG: Record<AlertType, { icon: React.ComponentType<{ size?: number; className?: string }>, label: string, color: string }> = {
    domain: { icon: Globe, label: "Domain", color: "text-blue-400" },
    domain_renewal: { icon: Globe, label: "Domain Renewal", color: "text-blue-400" },
    ssl: { icon: ShieldCheck, label: "SSL", color: "text-cyan-400" },
    firebase: { icon: Flame, label: "Firebase", color: "text-orange-400" },
    budget: { icon: Flame, label: "Budget", color: "text-orange-400" },
    invoice: { icon: FileText, label: "Invoice", color: "text-emerald-400" },
    backup: { icon: Database, label: "Backup", color: "text-purple-400" },
    subscription_renewal: { icon: Repeat, label: "Subscription", color: "text-purple-400" },
    uptime: { icon: Activity, label: "Uptime", color: "text-amber-400" },
    security: { icon: Shield, label: "Security", color: "text-red-400" },
};

// This exact lookup crashed the whole page in production once already —
// a real alert type (BUDGET) had no TYPE_CFG entry. Falling back here means
// the next backend/frontend drift shows an unstyled-but-visible alert
// instead of taking down the module.
const typeCfg = (type: AlertType) => TYPE_CFG[type] ?? { icon: Bell, label: type, color: "text-gray-400" };

const SEV_CFG: Record<AlertSeverity, { color: string; bg: string; ring: string; dot: string }> = {
    critical: { color: "text-red-400", bg: "bg-red-500/10", ring: "border-red-500/30", dot: "bg-red-500" },
    high: { color: "text-orange-400", bg: "bg-orange-500/10", ring: "border-orange-500/30", dot: "bg-orange-500" },
    medium: { color: "text-amber-400", bg: "bg-amber-500/10", ring: "border-amber-500/30", dot: "bg-amber-400" },
    low: { color: "text-blue-400", bg: "bg-blue-500/10", ring: "border-blue-500/30", dot: "bg-blue-400" },
};

const SEV_ORDER: AlertSeverity[] = ["critical", "high", "medium", "low"];

export default function AlertsModule() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sevFilter, setSevFilter] = useState<AlertSeverity | "all">("all");
    const [typeFilter, setTypeFilter] = useState<AlertType | "all">("all");
    const [showResolved, setShowResolved] = useState(false);

    useEffect(() => {
        const fetchAlerts = () => MonitoringAPI.getAlerts().then((apiAlerts: any[]) => {
            // A genuinely empty result (no alerts at all) is a real, valid
            // state — it should clear to an empty list, not silently keep
            // whatever was there before. Previously this bailed out on an
            // empty response, which (combined with seeding state from the
            // fictional ALERTS array) meant the module could show 9 fake
            // "Apex Logistics" / "Coastal Pharma" alerts forever, even once
            // real monitoring had nothing to report.
            const mapped: Alert[] = (apiAlerts || []).map((a: any) => ({
                id: a.id,
                type: (a.type?.toLowerCase() || "security") as AlertType,
                severity: (a.severity?.toLowerCase() || "medium") as AlertSeverity,
                title: a.title,
                description: a.description,
                client: a.clientName || a.client?.companyName || "System",
                timestamp: toDate(a.createdAt)?.toISOString().slice(0, 16).replace("T", " ") || "Unknown",
                resolved: a.resolved,
            }));
            setAlerts(mapped);
            setError("");
        }).catch((err) => {
            console.error("Failed to load alerts:", err);
            setError("Could not load alerts.");
        }).finally(() => setLoading(false));

        fetchAlerts();
        // Passive poll so a newly-fired alert shows up here without a manual
        // refresh — see the matching note in InfrastructureModule.tsx for why
        // this is polling rather than a live Firestore listener.
        const interval = setInterval(fetchAlerts, 60_000);
        return () => clearInterval(interval);
    }, []);

    const resolve = async (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
        MonitoringAPI.resolveAlert(id).catch(() => {});
    };
    const unresolve = async (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: false } : a));
        MonitoringAPI.reopenAlert(id).catch(() => {});
    };

    const visible = alerts
        .filter(a => showResolved ? true : !a.resolved)
        .filter(a => sevFilter === "all" || a.severity === sevFilter)
        .filter(a => typeFilter === "all" || a.type === typeFilter)
        .sort((a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity));

    const unresolvedCount = alerts.filter(a => !a.resolved).length;
    const counts: Record<AlertSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    alerts.filter(a => !a.resolved).forEach(a => counts[a.severity]++);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-gray-500">
                <Loader2 size={18} className="animate-spin" /> Loading alerts…
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
            )}

            {/* Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {SEV_ORDER.map(sev => {
                    const cfg = SEV_CFG[sev];
                    return (
                        <motion.button
                            key={sev}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSevFilter(sevFilter === sev ? "all" : sev)}
                            className={`p-5 rounded-2xl border text-left transition-all duration-200 ${sevFilter === sev ? `${cfg.bg} ${cfg.ring}` : "bg-[#111827] border-white/5 hover:border-white/10"}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${cfg.dot}`}></div>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.color}`}>{sev}</span>
                            </div>
                            <div className={`text-3xl font-bold ${cfg.color}`}>{counts[sev]}</div>
                            <div className="text-xs text-gray-600 mt-1">unresolved</div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Type filter */}
                <div className="flex gap-2 flex-wrap">
                    {(Object.entries(TYPE_CFG) as [AlertType, typeof TYPE_CFG[AlertType]][]).map(([type, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${typeFilter === type ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}
                            >
                                <Icon size={11} className={typeFilter === type ? cfg.color : ""} />
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => setShowResolved(!showResolved)}
                    className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border text-xs transition-all ${showResolved ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}
                >
                    <CheckCircle2 size={12} /> {showResolved ? "Hiding resolved" : "Show resolved"}
                </button>
            </div>

            {/* Alert List */}
            <div className="space-y-3">
                {visible.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <Bell size={32} className="text-gray-700 mx-auto" />
                        <p className="text-gray-600 font-mono text-sm">
                            {alerts.length === 0 ? "All clear — no alerts have fired." : "No alerts matching your filters."}
                        </p>
                    </div>
                )}
                <AnimatePresence>
                    {visible.map((alert) => {
                        const sev = SEV_CFG[alert.severity] ?? SEV_CFG.medium;
                        const typ = typeCfg(alert.type);
                        const TypeIcon = typ.icon;
                        return (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: alert.resolved ? 0.45 : 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-5 rounded-2xl bg-[#111827] border transition-all duration-200 ${alert.resolved ? "border-white/5" : `${sev.ring}`}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Severity dot */}
                                    <div className="flex flex-col items-center gap-2 pt-0.5 flex-shrink-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${sev.dot} ${!alert.resolved ? "shadow-[0_0_8px_currentColor]" : ""}`}></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <TypeIcon size={14} className={typ.color} />
                                                <span className="text-sm font-bold text-white truncate">{alert.title}</span>
                                                {alert.resolved && <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">RESOLVED</span>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} border ${sev.ring} uppercase`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 mb-3 leading-relaxed">{alert.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <span className="text-gray-400 font-medium">{alert.client}</span>
                                                <span>·</span>
                                                <span className="font-mono">{alert.timestamp}</span>
                                            </div>
                                            <button
                                                onClick={() => alert.resolved ? unresolve(alert.id) : resolve(alert.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${alert.resolved
                                                    ? "bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300"
                                                    : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                                }`}
                                            >
                                                {alert.resolved ? <XCircle size={11} /> : <CheckCircle2 size={11} />}
                                                {alert.resolved ? "Reopen" : "Resolve"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
