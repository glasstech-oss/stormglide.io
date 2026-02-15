"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Kanban,
    CreditCard,
    Settings2,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Zap,
    Cpu,
    Activity,
    Lock
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";

const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, category: "CONTROL" },
    { id: "crm", label: "Entities", icon: Users, category: "DATA" },
    { id: "kanban", label: "Operations", icon: Kanban, category: "DATA" },
    { id: "billing", label: "Ledger", icon: CreditCard, category: "COMMERCE" },
    { id: "settings", label: "Orchestration", icon: Settings2, category: "SYSTEM" },
    { id: "logs", label: "Audit Protocol", icon: ShieldAlert, category: "SECURITY" },
];

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useAdminStore();
    const [uptime, setUptime] = useState("00:00:00");

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const diff = Date.now() - start;
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
            setUptime(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 300 }}
            className="h-screen bg-slate-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-500 relative z-30 group"
        >
            {/* Mission Control Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-[#020617] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Zap size={22} className="text-cyan-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
                    </div>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-xs font-mono font-bold text-cyan-500 tracking-[0.2em]">STORMGLIDE</span>
                            <span className="text-xs font-mono text-gray-500 tracking-tighter">MISSION CONTROL</span>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8">
                {/* Navigation Blocks */}
                <div className="space-y-1">
                    {!sidebarCollapsed && (
                        <div className="px-4 mb-4 text-[10px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase">
                            Core Modules
                        </div>
                    )}
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group/btn relative overflow-hidden",
                                activeTab === item.id
                                    ? "bg-cyan-500/5 text-white"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            {/* Active background glow */}
                            {activeTab === item.id && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
                                    <motion.div
                                        layoutId="activeSideBarTab"
                                        className="absolute left-0 w-1 h-2/3 bg-cyan-500 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                    />
                                </>
                            )}

                            <item.icon size={20} className={cn(
                                "relative z-10 transition-all duration-300",
                                activeTab === item.id ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "group-hover/btn:scale-110"
                            )} />

                            {!sidebarCollapsed && (
                                <div className="flex flex-col items-start relative z-10">
                                    <span className={cn(
                                        "text-sm font-semibold tracking-tight transition-colors",
                                        activeTab === item.id ? "text-white" : "text-gray-400 group-hover/btn:text-gray-200"
                                    )}>
                                        {item.label}
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-600 tracking-widest">{item.category}</span>
                                </div>
                            )}

                            {!sidebarCollapsed && activeTab === item.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="ml-auto"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                {/* System Stats Block */}
                {!sidebarCollapsed && (
                    <div className="px-4 py-6 border-t border-white/5 space-y-6">
                        <div className="text-[10px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase mb-4">
                            System Health
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono italic">
                                    <Cpu size={12} /> PROCESSOR
                                </div>
                                <div className="text-xs font-mono text-emerald-500">NOMINAL</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono italic">
                                    <Activity size={12} /> UPTIME
                                </div>
                                <div className="text-xs font-mono text-white tracking-widest">{uptime}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Logout */}
            <div className="p-6 mt-auto border-t border-white/5">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20 group/logout">
                    <LogOut size={20} className="group-hover/logout:-translate-x-1 transition-transform" />
                    {!sidebarCollapsed && <span className="font-mono text-xs font-bold tracking-[0.1em]">TERMINAL_DISCONNECT</span>}
                </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-10 w-6 h-6 rounded-lg bg-slate-950 border border-white/10 text-gray-400 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 group/toggle shadow-2xl"
            >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
