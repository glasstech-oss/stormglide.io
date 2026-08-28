"use client";

import React from "react";
import AlertsModule from "@/components/admin/modules/AlertsModule";
import InfrastructureModule from "@/components/admin/modules/InfrastructureModule";

export default function MonitoringPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
                <p className="mt-1 text-gray-400">Uptime, SSL, domain, and cloud budget status across every client system — checked automatically every 30 minutes.</p>
            </div>
            <InfrastructureModule />
            <AlertsModule />
        </div>
    );
}
