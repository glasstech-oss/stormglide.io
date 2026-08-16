"use client";

import React from "react";
import ForecastModule from "@/components/admin/modules/ForecastModule";

export default function ForecastPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Forecast</h1>
                <p className="mt-1 text-gray-400">Revenue, cash flow, and profitability — built from real invoices and costs.</p>
            </div>
            <ForecastModule />
        </div>
    );
}
