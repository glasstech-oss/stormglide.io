"use client";

import React from "react";
import KanbanModule from "@/components/admin/modules/KanbanModule";

export default function KanbanPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="mt-1 text-gray-400">Work across every client project in one board.</p>
            </div>
            <KanbanModule />
        </div>
    );
}
