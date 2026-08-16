"use client";

import React from "react";
import SubscriptionsModule from "@/components/admin/modules/SubscriptionsModule";

export default function SubscriptionsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                <p className="mt-1 text-gray-400">Every recurring third-party service across every client project.</p>
            </div>
            <SubscriptionsModule />
        </div>
    );
}
