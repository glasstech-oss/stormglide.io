"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CreditCard, LayoutDashboard, LogOut, Settings2, Users, BriefcaseBusiness, Receipt, UserSquare2, Inbox, BarChart3, Activity } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { PUBLIC_SITE_URL } from "@/lib/navigation";

const MENU_ITEMS = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "crm", label: "Clients", icon: Users },
    { id: "leads", label: "Leads", icon: Inbox },
    { id: "monitoring", label: "Monitoring", icon: Activity },
    { id: "projects", label: "Projects", icon: BriefcaseBusiness },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "billing", label: "Payments", icon: CreditCard },
    { id: "analytics", label: "Visitor insight", icon: BarChart3 },
    { id: "team", label: "About page team", icon: UserSquare2 },
    { id: "settings", label: "Website settings", icon: Settings2 },
];

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

    const navigate = (id: string) => {
        if (id === "projects") {
            router.push("/admin/projects");
            return;
        }
        if (id === "invoices") {
            router.push("/admin/invoices");
            return;
        }
        if (id === "team") {
            router.push("/admin/team");
            return;
        }
        if (id === "leads") {
            router.push("/admin/leads");
            return;
        }
        if (id === "monitoring") {
            router.push("/admin/monitoring");
            return;
        }
        if (id === "analytics") {
            router.push("/admin/analytics");
            return;
        }
        setActiveTab(id);
        if (pathname !== "/admin/dashboard") router.push("/admin/dashboard");
    };

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

            <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Admin navigation">
                {MENU_ITEMS.map((item) => {
                    const isProjects = pathname.startsWith("/admin/projects");
                    const isInvoices = pathname.startsWith("/admin/invoices");
                    const isTeam = pathname.startsWith("/admin/team");
                    const isLeads = pathname.startsWith("/admin/leads");
                    const isMonitoring = pathname.startsWith("/admin/monitoring");
                    const isAnalytics = pathname.startsWith("/admin/analytics");
                    const isDedicatedRoute = isProjects || isInvoices || isTeam || isLeads || isMonitoring || isAnalytics;
                    const active = item.id === "projects" ? isProjects
                        : item.id === "invoices" ? isInvoices
                        : item.id === "team" ? isTeam
                        : item.id === "leads" ? isLeads
                        : item.id === "monitoring" ? isMonitoring
                        : item.id === "analytics" ? isAnalytics
                        : !isDedicatedRoute && activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => navigate(item.id)}
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
