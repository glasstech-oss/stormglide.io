"use client";

import React from "react";
import { motion } from "framer-motion";
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
    Zap
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils"; // I'll create this helper if missing

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "crm", label: "Client Hub", icon: Users },
    { id: "kanban", label: "Operations", icon: Kanban },
    { id: "billing", label: "Financial Hub", icon: CreditCard },
    { id: "cms", label: "Site Control", icon: Settings2 },
    { id: "logs", label: "Audit Logs", icon: ShieldAlert },
];

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useAdminStore();

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 280 }}
            className="h-screen bg-[#111827] border-r border-white/5 flex flex-col transition-all duration-300 relative z-30"
        >
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3">
                <div className="min-w-[40px] h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Zap size={24} className="text-[#0B0F19]" />
                </div>
                {!sidebarCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-xl tracking-tighter"
                    >
                        STORM<span className="text-cyan-400">GLIDE</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                            activeTab === item.id
                                ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon size={22} className={cn(
                            "transition-transform duration-200",
                            activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                        )} />
                        {!sidebarCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-medium"
                            >
                                {item.label}
                            </motion.span>
                        )}

                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeTabGlow"
                                className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
                    <LogOut size={22} />
                    {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-cyan-500 text-[#0B0F19] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
