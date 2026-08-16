"use client";

import { ExternalLink, LogOut, UserCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { PUBLIC_SITE_URL } from "@/lib/navigation";
import { useAdminStore } from "@/store/adminStore";

const PAGE_LABELS: Record<string, string> = {
    dashboard: "Overview",
    crm: "Clients",
    projects: "Projects",
    monitoring: "Monitoring",
    billing: "Payments",
    settings: "Website settings",
};

export default function Header() {
    const { activeTab, setActiveTab } = useAdminStore();
    const pathname = usePathname();
    const router = useRouter();
    const current = pathname.startsWith("/admin/projects") ? "projects"
        : pathname.startsWith("/admin/monitoring") ? "monitoring"
        : activeTab;
    const email = auth?.currentUser?.email || "Administrator";

    const navigate = (id: string) => {
        if (id === "projects") {
            router.push("/admin/projects");
            return;
        }
        if (id === "monitoring") {
            router.push("/admin/monitoring");
            return;
        }
        setActiveTab(id);
        if (pathname !== "/admin/dashboard") router.push("/admin/dashboard");
    };

    const logout = async () => {
        if (auth) await signOut(auth).catch(() => undefined);
        await fetch("/api/auth/admin-logout", { method: "POST" }).catch(() => undefined);
        window.location.assign(PUBLIC_SITE_URL);
    };

    return (
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#080d16]/95 px-4 backdrop-blur md:px-8">
            <div className="flex min-w-0 items-center gap-3">
                <div className="md:hidden">
                    <select
                        aria-label="Admin page"
                        value={current}
                        onChange={(event) => navigate(event.target.value)}
                        className="rounded-lg border border-white/10 bg-[#101827] px-3 py-2 text-sm font-medium text-white outline-none"
                    >
                        {Object.entries(PAGE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                    </select>
                </div>
                <div className="hidden md:block">
                    <div className="text-sm font-semibold text-white">Stormglide administration</div>
                    <div className="text-xs text-slate-500">Clients, projects and payments in one place</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <a
                    href={PUBLIC_SITE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white sm:flex"
                >
                    View website <ExternalLink size={15} />
                </a>
                <div className="hidden items-center gap-2 border-l border-white/10 pl-4 md:flex">
                    <UserCircle size={25} className="text-blue-400" />
                    <span className="max-w-52 truncate text-sm text-slate-300">{email}</span>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    aria-label="Sign out"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 md:hidden"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
