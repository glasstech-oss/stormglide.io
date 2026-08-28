"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { PUBLIC_SITE_URL, ADMIN_NAV_GROUPS, AdminNavItem } from "@/lib/navigation";

function BrandMark() {
    return (
        <span className="grid h-8 w-5 grid-cols-2 grid-rows-3 gap-[3px]" aria-hidden="true">
            <span className="col-start-1 row-start-1 rounded-[1px] bg-slate-200" />
            <span className="col-start-2 row-start-1 rounded-[1px] bg-blue-500" />
            <span className="col-start-1 row-start-2 rounded-[1px] bg-slate-200" />
            <span className="col-start-2 row-start-2 rounded-[1px] bg-slate-200" />
            <span className="col-start-1 row-start-3 rounded-[1px] bg-slate-200" />
        </span>
    );
}

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useAdminStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navigate = (item: AdminNavItem) => {
        if (item.route) {
            router.push(item.route);
            return;
        }
        setActiveTab(item.id);
        if (pathname !== "/admin/dashboard") router.push("/admin/dashboard");
    };

    // Tab-based items (route: null) all live on /admin/dashboard and switch
    // on activeTab — they must never read as active from a stale activeTab
    // value while looking at an unrelated dedicated route like /admin/kanban.
    const isActive = (item: AdminNavItem) =>
        item.route ? pathname.startsWith(item.route) : pathname === "/admin/dashboard" && activeTab === item.id;

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            if (auth) await signOut(auth);
            await fetch("/api/auth/admin-logout", { method: "POST" });
        } finally {
            window.location.assign(PUBLIC_SITE_URL);
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 76 : 244 }}
            className="relative hidden h-screen flex-col border-r border-white/10 bg-[#080d16] md:flex"
        >
            <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
                <BrandMark />
                {!sidebarCollapsed && (
                    <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-white">stormglide<span className="text-blue-500">.io</span></div>
                        <div className="text-xs text-slate-500">Admin portal</div>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-6" aria-label="Admin navigation">
                {ADMIN_NAV_GROUPS.map((group) => (
                    <div key={group.label} className="space-y-1">
                        {!sidebarCollapsed && (
                            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-600">{group.label}</div>
                        )}
                        {group.items.map((item) => {
                            const active = isActive(item);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => navigate(item)}
                                    title={sidebarCollapsed ? item.label : undefined}
                                    className={cn(
                                        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                                        active ? "bg-blue-500/12 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
                                        sidebarCollapsed && "justify-center px-0",
                                    )}
                                >
                                    <item.icon size={19} className={active ? "text-blue-400" : "text-slate-500"} />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                <button
                    type="button"
                    onClick={logout}
                    disabled={isLoggingOut}
                    title={sidebarCollapsed ? "Sign out" : undefined}
                    className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50",
                        sidebarCollapsed && "justify-center px-0",
                    )}
                >
                    <LogOut size={18} />
                    {!sidebarCollapsed && <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>}
                </button>
            </div>

            <button
                type="button"
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3 top-8 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0d1420] text-slate-500 transition hover:text-white"
            >
                {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
