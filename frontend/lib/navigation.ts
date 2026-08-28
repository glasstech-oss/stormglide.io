import {
    LayoutDashboard, Users, Inbox, BriefcaseBusiness, Kanban, Activity,
    Receipt, CreditCard, Package, TrendingUp, FileCheck, ScrollText,
    BarChart3, UserSquare2, Settings2,
} from "lucide-react";

export const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stormglide.io';

// Single source of truth for admin nav, consumed by both Sidebar.tsx
// (grouped, desktop) and Header.tsx (flat, mobile dropdown) — previously
// each duplicated its own id/label/route list and the two had quietly
// drifted apart (the mobile dropdown was missing Leads, Team, and
// Visitor insight entirely). `route: null` means the item is rendered as
// an activeTab switch inside app/admin/dashboard/page.tsx rather than
// having its own route.
export interface AdminNavItem {
    id: string;
    label: string;
    icon: typeof LayoutDashboard;
    route: string | null;
}

export interface AdminNavGroup {
    label: string;
    items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
    {
        label: "Overview",
        items: [
            { id: "dashboard", label: "Overview", icon: LayoutDashboard, route: null },
            { id: "crm", label: "Clients", icon: Users, route: null },
            { id: "leads", label: "Leads", icon: Inbox, route: "/admin/leads" },
        ],
    },
    {
        label: "Delivery",
        items: [
            { id: "projects", label: "Projects", icon: BriefcaseBusiness, route: "/admin/projects" },
            { id: "kanban", label: "Tasks", icon: Kanban, route: "/admin/kanban" },
            { id: "monitoring", label: "Monitoring", icon: Activity, route: "/admin/monitoring" },
        ],
    },
    {
        label: "Money",
        items: [
            { id: "invoices", label: "Invoices", icon: Receipt, route: "/admin/invoices" },
            { id: "billing", label: "Payments", icon: CreditCard, route: null },
            { id: "subscriptions", label: "Subscriptions", icon: Package, route: "/admin/subscriptions" },
            { id: "forecast", label: "Forecast", icon: TrendingUp, route: "/admin/forecast" },
        ],
    },
    {
        label: "Records",
        items: [
            { id: "vault", label: "Documents", icon: FileCheck, route: "/admin/vault" },
            { id: "audit", label: "Audit Log", icon: ScrollText, route: "/admin/audit" },
        ],
    },
    {
        label: "Site",
        items: [
            { id: "analytics", label: "Visitor insight", icon: BarChart3, route: "/admin/analytics" },
            { id: "team", label: "About page team", icon: UserSquare2, route: "/admin/team" },
            { id: "settings", label: "Website settings", icon: Settings2, route: null },
        ],
    },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
