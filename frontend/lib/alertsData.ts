export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertType = "domain" | "ssl" | "firebase" | "invoice" | "backup" | "uptime" | "security";

export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
    client: string;
    timestamp: string;
    resolved: boolean;
}

export const ALERTS: Alert[] = [
    {
        id: "a1", type: "ssl", severity: "critical",
        title: "SSL certificate expiring in 14 days",
        description: "apex.stormglide.io SSL certificate expires Jul 06, 2026. Renew immediately to avoid browser warnings and service disruption.",
        client: "Apex Logistics Ltd.", timestamp: "2026-06-22 09:00", resolved: false,
    },
    {
        id: "a2", type: "domain", severity: "high",
        title: "Domain renewal due in 28 days",
        description: "coastalpharma.gh expires Jul 20, 2026. Auto-renew is OFF. Contact the registrar (GhanaDomains) to enable auto-renew or renew manually.",
        client: "Coastal Pharma", timestamp: "2026-06-22 08:30", resolved: false,
    },
    {
        id: "a3", type: "firebase", severity: "high",
        title: "Firebase budget at 82%",
        description: "Apex Logistics Firebase project has consumed GHS 410 of GHS 500 monthly budget. At the current burn rate (GHS 22/day), budget will be exhausted in 4 days.",
        client: "Apex Logistics Ltd.", timestamp: "2026-06-22 07:00", resolved: false,
    },
    {
        id: "a4", type: "invoice", severity: "high",
        title: "Invoice 7 days overdue",
        description: "INV-2026-005 (GHS 8,500) for StarTech Holdings is 7 days past the due date. No payment or response received. Escalation recommended.",
        client: "StarTech Holdings", timestamp: "2026-06-22 06:00", resolved: false,
    },
    {
        id: "a5", type: "backup", severity: "medium",
        title: "Database backup failed",
        description: "Nightly PostgreSQL backup for Nexus-MFG failed at 03:00 WAT. Last successful backup was 48 hours ago. Investigate backup service logs.",
        client: "Nexus-MFG", timestamp: "2026-06-22 04:00", resolved: false,
    },
    {
        id: "a6", type: "uptime", severity: "medium",
        title: "Staging environment degraded",
        description: "StarTech Holdings staging server recorded 94.2% uptime this week with 3 unplanned outages. High latency (524ms avg) detected. Review server logs.",
        client: "StarTech Holdings", timestamp: "2026-06-21 18:00", resolved: false,
    },
    {
        id: "a7", type: "domain", severity: "low",
        title: "Auto-renew disabled — renews in 47 days",
        description: "BioLink Technologies domain (biolink.io) auto-renew is OFF. Domain renews Aug 05, 2026. Enable auto-renew via Cloudflare Registrar to prevent expiry risk.",
        client: "BioLink Technologies", timestamp: "2026-06-21 12:00", resolved: false,
    },
    {
        id: "a8", type: "firebase", severity: "low",
        title: "Auth MAU spike — verify traffic",
        description: "Nexus-MFG Firebase Auth monthly active users spiked +340% in the past 72 hours. Verify this is legitimate traffic and not an authentication abuse attempt.",
        client: "Nexus-MFG", timestamp: "2026-06-21 09:00", resolved: false,
    },
    {
        id: "a9", type: "security", severity: "high",
        title: "Multiple failed login attempts",
        description: "3 consecutive failed admin login attempts from IP 41.66.42.9 at 09:30 WAT. IP has been rate-limited. Consider adding to blocklist.",
        client: "System", timestamp: "2026-06-22 09:30", resolved: true,
    },
];

export const UNRESOLVED_COUNT = ALERTS.filter(a => !a.resolved).length;
