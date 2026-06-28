"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Users, Kanban, CreditCard, Settings2,
    ShieldAlert, ChevronLeft, ChevronRight, LogOut, Zap, Cpu,
    Activity, Server, Package, TrendingUp, Bell, FolderOpen, Briefcase
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { UNRESOLVED_COUNT } from "@/lib/alertsData";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface MenuItem { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }
interface MenuGroup { label: string; items: MenuItem[] }

const MENU_GROUPS: MenuGroup[] = [
    {
        label: "COMMAND",
        items: [
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "projects", label: "Projects", icon: Briefcase },
        ],
    },
    {
        label: "CLIENTS",
        items: [
            { id: "crm", label: "Entities", icon: Users },
            { id: "contracts", label: "Contracts", icon: FolderOpen },
        ],
    },
    {
        label: "OPERATIONS",
        items: [
            { id: "kanban", label: "Task Board", icon: Kanban },
            { id: "infra", label: "Infrastructure", icon: Server },
            { id: "alerts", label: "Alert Center", icon: Bell, badge: UNRESOLVED_COUNT },
        ],
    },
    {
        label: "FINANCE",
        items: [
            { id: "billing", label: "Ledger", icon: CreditCard },
            { id: "subscriptions", label: "Subscriptions", icon: Package },
            { id: "forecast", label: "Forecasting", icon: TrendingUp },
        ],
    },
    {
        label: "SYSTEM",
        items: [
            { id: "settings", label: "Orchestration", icon: Settings2 },
            { id: "logs", label: "Audit Protocol", icon: ShieldAlert },
        ],
    },
];

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useAdminStore();
    const [uptime, setUptime] = useState("00:00:00");
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const diff = Date.now() - start;
            const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
            setUptime(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            if (auth) await signOut(auth);
            await fetch("/api/auth/admin-logout", { method: "POST" });
        } finally {
            router.replace("/admin/login");
            router.refresh();
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 280 }}
            className="h-screen bg-slate-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-500 relative z-30"
        >
            {/* Header */}
            <div className="p-6 pb-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#020617] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Zap size={22} className="text-cyan-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
                </div>
                {!sidebarCollapsed && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col min-w-0">
                        <span className="text-xs font-mono font-bold text-cyan-500 tracking-[0.2em]">STORMGLIDE</span>
                        <span className="text-xs font-mono text-gray-500 tracking-tighter">MISSION CONTROL</span>
                    </motion.div>
                )}
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none" style={{ scrollbarWidth: "none" }}>
                {MENU_GROUPS.map((group) => (
                    <div key={group.label}>
                        {!sidebarCollapsed && (
                            <div className="px-3 mb-2 text-[9px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase">
                                {group.label}
                            </div>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = activeTab === item.id;
                                const handleClick = () => {
                                    if (item.id === "projects") {
                                        router.push("/admin/projects");
                                    } else {
                                        setActiveTab(item.id);
                                    }
                                };
                                return (
                                    <button
                                        key={item.id}
                                        onClick={handleClick}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group/btn relative overflow-hidden",
                                            isActive ? "bg-cyan-500/5 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                        )}
                                    >
                                        {isActive && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                                                <motion.div
                                                    layoutId="activeSideBarTab"
                                                    className="absolute left-0 w-1 h-2/3 bg-cyan-500 rounded-r-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                                />
                                            </>
                                        )}

                                        <item.icon size={18} className={cn(
                                            "relative z-10 transition-all duration-200 flex-shrink-0",
                                            isActive ? "text-cyan-400" : "group-hover/btn:scale-105"
                                        )} />

                                        {!sidebarCollapsed && (
                                            <span className={cn(
                                                "text-sm font-medium relative z-10 flex-1 text-left transition-colors",
                                                isActive ? "text-white" : "text-gray-400 group-hover/btn:text-gray-200"
                                            )}>
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Badge */}
                                        {item.badge && item.badge > 0 && (
                                            <span className={cn(
                                                "relative z-10 flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                                                sidebarCollapsed ? "absolute top-1 right-1 bg-red-500 text-white" : "bg-red-500/20 text-red-400 border border-red-500/30"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* System Health */}
                {!sidebarCollapsed && (
                    <div className="px-3 py-4 border-t border-white/5 space-y-3">
                        <div className="text-[9px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase">System Health</div>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600 font-mono">
                                    <Cpu size={11} /> PROCESSOR
                                </div>
                                <div className="font-mono text-emerald-500 text-[11px]">NOMINAL</div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-600 font-mono">
                                    <Activity size={11} /> UPTIME
                                </div>
                                <div className="font-mono text-white tracking-widest text-[11px]">{uptime}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20 group/logout disabled:opacity-60"
                >
                    <LogOut size={18} className="group-hover/logout:-translate-x-1 transition-transform flex-shrink-0" />
                    {!sidebarCollapsed && (
                        <span className="font-mono text-xs font-bold tracking-[0.1em]">
                            {isLoggingOut ? "DISCONNECTING..." : "TERMINAL_DISCONNECT"}
                        </span>
                    )}
                </button>
            </div>

            {/* Toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-10 w-6 h-6 rounded-lg bg-slate-950 border border-white/10 text-gray-400 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-50 shadow-2xl"
            >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
