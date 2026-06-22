"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuditAPI } from "@/lib/api";
import {
    ShieldAlert, CheckCircle2, AlertTriangle, Info, XCircle,
    Search, Filter, Download, RefreshCw, Activity
} from "lucide-react";

type LogStatus = "success" | "warning" | "info" | "error";

interface AuditEntry {
    id: number;
    timestamp: string;
    action: string;
    entity: string;
    actor: string;
    status: LogStatus;
    detail: string;
}

const ALL_LOGS: AuditEntry[] = [
    { id: 1, timestamp: "2026-06-22 14:32:01", action: "Invoice INV-2026-005 flagged as overdue", entity: "StarTech Holdings", actor: "System", status: "warning", detail: "Invoice past due by 7 days. Auto-escalation triggered." },
    { id: 2, timestamp: "2026-06-22 13:15:44", action: "New client onboarded", entity: "Coastal Pharma", actor: "Admin", status: "success", detail: "Client profile created. Project scope submitted and acknowledged." },
    { id: 3, timestamp: "2026-06-22 11:02:18", action: "Staging environment deployed", entity: "Nexus-MFG", actor: "Deploy Bot", status: "success", detail: "Staging build v0.4.2 pushed to staging.nexus.stormglide.io" },
    { id: 4, timestamp: "2026-06-22 10:47:09", action: "API key rotated", entity: "Cloud Infrastructure", actor: "Admin", status: "warning", detail: "Old key invalidated. New key distributed to active services." },
    { id: 5, timestamp: "2026-06-22 09:30:55", action: "Failed login attempt", entity: "Admin Portal", actor: "Unknown IP: 41.66.42.9", status: "error", detail: "3 consecutive failed attempts. Account temporarily rate-limited." },
    { id: 6, timestamp: "2026-06-22 08:58:22", action: "Security scan completed", entity: "System Core", actor: "System", status: "success", detail: "Full vulnerability scan passed. No critical issues found." },
    { id: 7, timestamp: "2026-06-21 18:21:33", action: "Project phase advanced", entity: "Apex Logistics Ltd.", actor: "Admin", status: "info", detail: "Phase moved from UI_UX_DESIGN to BACKEND_ARCHITECTURE." },
    { id: 8, timestamp: "2026-06-21 16:14:07", action: "Invoice INV-2026-004 paid", entity: "BioLink Technologies", actor: "Paystack Gateway", status: "success", detail: "GHS 35,000 received. Invoice marked as settled." },
    { id: 9, timestamp: "2026-06-21 14:02:51", action: "Site settings updated", entity: "Site Orchestration", actor: "Admin", status: "info", detail: "Hero headline and primary color modified." },
    { id: 10, timestamp: "2026-06-21 12:30:17", action: "Staging feedback received", entity: "Nexus-MFG", actor: "Client: James O.", status: "info", detail: "3 UI change requests logged. Assigned to design queue." },
    { id: 11, timestamp: "2026-06-21 09:45:02", action: "PostgreSQL backup completed", entity: "Database", actor: "System", status: "success", detail: "Full snapshot archived to encrypted cold storage." },
    { id: 12, timestamp: "2026-06-20 22:10:48", action: "Unauthorized access blocked", entity: "Admin Portal", actor: "Firewall", status: "error", detail: "IP 197.210.55.12 blocked after repeated probe attempts." },
    { id: 13, timestamp: "2026-06-20 17:33:26", action: "New project contract signed", entity: "StarTech Holdings", actor: "Admin", status: "success", detail: "Digital contract executed. Kickoff scheduled for June 25." },
    { id: 14, timestamp: "2026-06-20 15:00:00", action: "System reboot scheduled", entity: "Stormglide API Gateway", actor: "Admin", status: "warning", detail: "Maintenance window: June 23, 02:00–04:00 WAT." },
    { id: 15, timestamp: "2026-06-20 11:22:39", action: "Admin session started", entity: "Admin Portal", actor: "Admin", status: "info", detail: "Session authenticated via JWT. Expiry: 24h." },
];

const STATUS_CONFIG: Record<LogStatus, { icon: React.ComponentType<{ size?: number; className?: string }>, color: string, bg: string, label: string }> = {
    success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Success" },
    warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Warning" },
    info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "Info" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Error" },
};

export default function AuditModule() {
    const [logs, setLogs] = useState<AuditEntry[]>(ALL_LOGS);
    const [filter, setFilter] = useState<LogStatus | "all">("all");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        AuditAPI.getLogs(1, 100).then((res: any) => {
            if (!res?.logs || res.logs.length === 0) return;
            const mapped: AuditEntry[] = res.logs.map((log: any, i: number) => ({
                id: i + 1,
                timestamp: new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 19),
                action: log.action,
                entity: log.entityType,
                actor: log.admin?.email || "Admin",
                status: "info" as LogStatus,
                detail: `Entity ID: ${log.entityId}${log.ipAddress ? ` · IP: ${log.ipAddress}` : ""}`,
            }));
            setLogs(mapped);
        }).catch(() => {});
    }, []);

    const filtered = logs.filter(log => {
        const matchesFilter = filter === "all" || log.status === filter;
        const matchesSearch = search === "" || log.action.toLowerCase().includes(search.toLowerCase()) || log.entity.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const counts = {
        all: logs.length,
        success: logs.filter(l => l.status === "success").length,
        warning: logs.filter(l => l.status === "warning").length,
        info: logs.filter(l => l.status === "info").length,
        error: logs.filter(l => l.status === "error").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity size={18} className="text-cyan-400" />
                    <span className="text-sm text-gray-400 font-mono">{logs.length} total events recorded</span>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search logs..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-56"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Download size={14} /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-cyan-400 transition-all">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "success", "warning", "info", "error"] as const).map(f => {
                    const config = f === "all" ? null : STATUS_CONFIG[f];
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === f
                                ? f === "all"
                                    ? "bg-white/10 border-white/20 text-white"
                                    : `${config!.bg} ${config!.color} border-current`
                                : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {config && <config.icon size={13} />}
                            <span className="capitalize">{f}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${filter === f ? "bg-white/20" : "bg-white/10"}`}>
                                {counts[f]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Log Entries */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-600 font-mono text-sm">No matching log entries found.</div>
                )}
                {filtered.map((log, i) => {
                    const cfg = STATUS_CONFIG[log.status];
                    const Icon = cfg.icon;
                    const isExpanded = expanded === log.id;

                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => setExpanded(isExpanded ? null : log.id)}
                            className="p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 p-2 rounded-xl border ${cfg.bg}`}>
                                    <Icon size={14} className={cfg.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">{log.action}</p>
                                        <span className="text-[11px] font-mono text-gray-600 flex-shrink-0">{log.timestamp.split(" ")[1]}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                        <span className="text-gray-400">{log.entity}</span>
                                        <span>·</span>
                                        <span>by {log.actor}</span>
                                        <span>·</span>
                                        <span className="font-mono text-gray-600">{log.timestamp.split(" ")[0]}</span>
                                    </div>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-400 font-mono"
                                        >
                                            {log.detail}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
