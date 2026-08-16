"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { AuditAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";
import { Search, RefreshCw, Activity, Loader2, FileText } from "lucide-react";

interface AuditEntry {
    id: string;
    timestamp: Date | null;
    action: string;
    entityType: string;
    entityId: string | null;
    actor: string;
    detail: string | null;
}

export default function AuditModule() {
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [entityFilter, setEntityFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await AuditAPI.getLogs(1, 200);
            const mapped: AuditEntry[] = (res?.logs || []).map((log: any) => ({
                id: log.id,
                timestamp: toDate(log.createdAt),
                action: log.action,
                entityType: log.entityType || "other",
                entityId: log.entityId || null,
                actor: log.adminEmail || "Admin",
                detail: log.details || null,
            }));
            setLogs(mapped);
        } catch {
            // leave logs empty — an honest empty log beats a fabricated one
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const refresh = async () => {
        setRefreshing(true);
        await load();
        setTimeout(() => setRefreshing(false), 400);
    };

    const entityTypes = useMemo(() => ["all", ...new Set(logs.map((l) => l.entityType))], [logs]);

    const filtered = logs.filter((log) => {
        const matchesFilter = entityFilter === "all" || log.entityType === entityFilter;
        const matchesSearch = search === "" || log.action.toLowerCase().includes(search.toLowerCase()) || log.entityType.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity size={18} className="text-cyan-400" />
                    <span className="text-sm text-gray-400 font-mono">{logs.length} events recorded</span>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search logs..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-56"
                        />
                    </div>
                    <button onClick={refresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-cyan-400 transition-all">
                        <RefreshCw size={14} className={refreshing ? "animate-spin text-cyan-400" : ""} />
                    </button>
                </div>
            </div>

            {/* Entity type filter — derived from real log data, not a fabricated severity taxonomy */}
            <div className="flex gap-2 flex-wrap">
                {entityTypes.map((t) => (
                    <button
                        key={t}
                        onClick={() => setEntityFilter(t)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${entityFilter === t
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                            : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Log Entries */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-16 text-gray-600">
                        <FileText size={24} />
                        <p className="text-sm font-mono">{logs.length === 0 ? "No actions logged yet." : "No matching log entries."}</p>
                    </div>
                )}
                {filtered.map((log, i) => {
                    const isExpanded = expanded === log.id;
                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => setExpanded(isExpanded ? null : log.id)}
                            className="p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200 group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">{log.action}</p>
                                <span className="text-[11px] font-mono text-gray-600 flex-shrink-0">
                                    {log.timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) ?? "—"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                <span className="text-gray-400 capitalize">{log.entityType}</span>
                                <span>·</span>
                                <span>by {log.actor}</span>
                                <span>·</span>
                                <span className="font-mono text-gray-600">{log.timestamp?.toLocaleDateString() ?? "Unknown date"}</span>
                            </div>
                            {isExpanded && log.detail && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-400 font-mono"
                                >
                                    {log.detail}
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
