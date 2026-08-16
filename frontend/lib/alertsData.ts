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
