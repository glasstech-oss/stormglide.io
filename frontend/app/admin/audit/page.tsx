"use client";

import React from "react";
import AuditModule from "@/components/admin/modules/AuditModule";

export default function AuditPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
                <p className="mt-1 text-gray-400">Who changed what, and when.</p>
            </div>
            <AuditModule />
        </div>
    );
}
