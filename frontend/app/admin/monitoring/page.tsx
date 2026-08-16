"use client";

import React from "react";
import AlertsModule from "@/components/admin/modules/AlertsModule";

export default function MonitoringPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
                <p className="mt-1 text-gray-400">Uptime, SSL, and domain alerts across every client system — checked automatically every 6 hours.</p>
            </div>
            <AlertsModule />
        </div>
    );
}
