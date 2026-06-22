"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, Command, UserCircle, Activity, ShieldCheck, Globe, Flame, FileText, Database } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { AnimatePresence, motion } from "framer-motion";
import { ALERTS, UNRESOLVED_COUNT, AlertType } from "@/lib/alertsData";
import { MonitoringAPI } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

const TYPE_ICONS: Record<AlertType, React.ComponentType<{ size?: number; className?: string }>> = {
    domain: Globe,
    ssl: ShieldCheck,
    firebase: Flame,
    invoice: FileText,
    backup: Database,
    uptime: Activity,
    security: ShieldCheck,
};

const SEV_DOT: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-400",
    low: "bg-blue-400",
};

function NotificationBell() {
    const { setActiveTab } = useAdminStore();
    const [open, setOpen] = useState(false);
    const [liveCount, setLiveCount] = useState(UNRESOLVED_COUNT);
    const [liveAlerts, setLiveAlerts] = useState(ALERTS.filter(a => !a.resolved).slice(0, 5));
    const ref = useRef<HTMLDivElement>(null);

    useSocket({
        onAlert: (alert) => {
            setLiveCount(c => c + 1);
            setLiveAlerts(prev => [{
                id: alert.id,
                type: (alert.type?.toLowerCase() || 'uptime') as AlertType,
                severity: alert.severity,
                title: alert.title,
                description: alert.description,
                client: alert.clientName || 'System',
                timestamp: new Date(alert.createdAt).toLocaleString(),
                resolved: false,
            }, ...prev].slice(0, 5));
        },
    });

    useEffect(() => {
        MonitoringAPI.getAlerts().then((data: any[]) => {
            const unresolved = data?.filter((a: any) => !a.resolved) || [];
            setLiveCount(unresolved.length || UNRESOLVED_COUNT);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 group"
            >
                <Bell size={20} />
                {liveCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-slate-950 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                        {liveCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full mt-3 w-96 bg-[#0d1117] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell size={14} className="text-cyan-400" />
                                <span className="text-sm font-bold text-white">Alerts</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                                    {liveCount} active
                                </span>
                            </div>
                            <button
                                onClick={() => { setActiveTab("alerts"); setOpen(false); }}
                                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                View all →
                            </button>
                        </div>

                        {/* Alert List */}
                        <div className="max-h-[340px] overflow-y-auto divide-y divide-white/5">
                            {liveAlerts.map(alert => {
                                const Icon = TYPE_ICONS[alert.type];
                                return (
                                    <button
                                        key={alert.id}
                                        onClick={() => { setActiveTab("alerts"); setOpen(false); }}
                                        className="w-full flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
                                    >
                                        <div className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full ${SEV_DOT[alert.severity]}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{alert.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{alert.description}</p>
                                            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-gray-600">
                                                <Icon size={10} />
                                                <span>{alert.client}</span>
                                                <span>·</span>
                                                <span>{alert.timestamp.split(" ")[1]}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="px-5 py-3 border-t border-white/5">
                            <button
                                onClick={() => { setActiveTab("alerts"); setOpen(false); }}
                                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all font-medium"
                            >
                                Open Alert Center
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function CommandPalette() {
    const { isCommandPaletteOpen, setCommandPaletteOpen } = useAdminStore();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandPaletteOpen(!isCommandPaletteOpen);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isCommandPaletteOpen, setCommandPaletteOpen]);

    return (
        <AnimatePresence>
            {isCommandPaletteOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCommandPaletteOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -40 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-[101]"
                    >
                        <div className="flex items-center gap-4 px-8 py-6 border-b border-white/5 bg-white/5">
                            <Search className="text-cyan-500" size={24} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Execute command or search systemic entities..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-xl font-medium"
                            />
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">Operational History</div>
                            <div className="space-y-3">
                                {["Global Revenue Projections", "Security Audit: Nexus-Alpha", "Entity Re-deployment"].map((item) => (
                                    <button key={item} className="w-full text-left px-6 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all text-gray-400 font-mono text-sm flex items-center justify-between group">
                                        <span>{item}</span>
                                        <Activity size={14} className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                            <div className="flex gap-4">
                                <span><kbd className="text-gray-400">↑↓</kbd> NAVIGATE</span>
                                <span><kbd className="text-gray-400">↵</kbd> SELECT</span>
                            </div>
                            <span>SYSTEM_ID: STORM_OS_V2</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function Header() {
    const { setCommandPaletteOpen } = useAdminStore();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/20 backdrop-blur-xl sticky top-0 z-20 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

            <div className="flex-1 max-w-xl">
                <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="w-full flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-[#020617] border border-white/5 hover:border-cyan-500/30 transition-all text-gray-500 text-sm group shadow-inner"
                >
                    <Search size={18} className="group-hover:text-cyan-400 transition-colors" />
                    <span className="font-mono text-xs tracking-wider">INITIATE_CORE_SEARCH...</span>
                    <kbd className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] text-gray-500">
                        <Command size={10} /> K
                    </kbd>
                </button>
            </div>

            <div className="flex items-center gap-8">
                <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mb-1">Local_Node_Time</span>
                        <span className="text-xs font-mono font-bold text-white tracking-widest">{currentTime}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mb-1">Latency</span>
                        <span className="text-xs font-mono font-bold text-emerald-500 tracking-widest">12ms</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell />

                    <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2 justify-end">
                                <ShieldCheck size={14} className="text-cyan-500" /> STARK_ADAM
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 tracking-[0.2em] flex items-center gap-2 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SEC_LVL: OMEGA
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 p-[1px]">
                            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                                <UserCircle size={28} className="text-cyan-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommandPalette />
        </header>
    );
}
