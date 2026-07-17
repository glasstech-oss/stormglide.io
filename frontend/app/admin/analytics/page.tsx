"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Clock, Eye, Loader2, Monitor, Users } from "lucide-react";
import { AnalyticsAPI, AnalyticsSummary, GaReport } from "@/lib/api";

// GA4's Data API returns raw report rows (dimensionValues[]/metricValues[])
// rather than a friendly shape — these helpers turn a report into simple
// {label, value} pairs for display.
function rowsToPairs(report?: GaReport): { label: string; value: number }[] {
    if (!report?.rows) return [];
    return report.rows.map((row) => ({
        label: row.dimensionValues?.[0]?.value || "(not set)",
        value: Number(row.metricValues?.[0]?.value || 0),
    }));
}

function overviewMetrics(report?: GaReport): { sessions: number; avgDuration: number; pageviews: number; users: number } {
    const values = report?.rows?.[0]?.metricValues?.map((m) => Number(m.value || 0)) || [];
    return { sessions: values[0] || 0, avgDuration: values[1] || 0, pageviews: values[2] || 0, users: values[3] || 0 };
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

function formatNumber(n: number): string {
    return n.toLocaleString();
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#101722] p-4 md:p-5">
            <Icon size={18} className="text-blue-400" />
            <div className="mt-4 text-2xl font-semibold text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
        </div>
    );
}

function BreakdownTable({ title, rows, valueLabel }: { title: string; rows: { label: string; value: number }[]; valueLabel: string }) {
    const total = rows.reduce((sum, r) => sum + r.value, 0) || 1;
    return (
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#101722]">
            <div className="border-b border-white/10 px-5 py-4">
                <h2 className="font-semibold text-white">{title}</h2>
            </div>
            {rows.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-500">No data for this range yet.</div>
            ) : (
                <div className="divide-y divide-white/10">
                    {rows.map((row) => (
                        <div key={row.label} className="flex items-center gap-4 px-5 py-3">
                            <div className="min-w-0 flex-1 truncate text-sm text-slate-300" title={row.label}>{row.label}</div>
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.round((row.value / total) * 100)}%` }} />
                            </div>
                            <div className="w-20 shrink-0 text-right text-sm text-white">{formatNumber(row.value)} <span className="text-slate-500">{valueLabel}</span></div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        AnalyticsAPI.getSummary()
            .then(setSummary)
            .catch((err) => {
                console.error("Failed to load analytics summary:", err);
                setError("Could not load visitor analytics.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="mx-auto max-w-6xl space-y-7 pb-12">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Visitor insight</h1>
                <p className="mt-2 text-sm text-slate-400">Where your traffic comes from, what they look at, and how they get there — powered by Google Analytics 4.</p>
            </div>

            {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={20} className="animate-spin text-cyan-400" />
                </div>
            ) : !summary?.configured ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-16 text-center text-gray-500">
                    <BarChart3 size={28} />
                    <p className="max-w-md">
                        Google Analytics isn&apos;t connected yet. Add <code className="rounded bg-white/10 px-1.5 py-0.5 text-gray-300">VITE_GA_MEASUREMENT_ID</code> to
                        the marketing site and <code className="rounded bg-white/10 px-1.5 py-0.5 text-gray-300">GA4_PROPERTY_ID</code> / <code className="rounded bg-white/10 px-1.5 py-0.5 text-gray-300">GA4_SERVICE_ACCOUNT_KEY_BASE64</code> to
                        the backend to start seeing visitor data here.
                    </p>
                </div>
            ) : (
                <>
                    {(() => {
                        const m = overviewMetrics(summary.overview);
                        return (
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <StatCard icon={Users} label="Sessions (30d)" value={formatNumber(m.sessions)} />
                                <StatCard icon={Clock} label="Avg. session duration" value={formatDuration(m.avgDuration)} />
                                <StatCard icon={Eye} label="Pageviews" value={formatNumber(m.pageviews)} />
                                <StatCard icon={Users} label="Unique visitors" value={formatNumber(m.users)} />
                            </div>
                        );
                    })()}

                    <div className="grid gap-6 lg:grid-cols-2">
                        <BreakdownTable title="Device" rows={rowsToPairs(summary.byDevice)} valueLabel="sessions" />
                        <BreakdownTable title="Traffic source" rows={rowsToPairs(summary.bySource)} valueLabel="sessions" />
                        <BreakdownTable title="Top pages" rows={rowsToPairs(summary.byPage)} valueLabel="views" />
                        <BreakdownTable title="Top countries" rows={rowsToPairs(summary.byCountry)} valueLabel="sessions" />
                    </div>
                </>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-600">
                <Monitor size={13} /> Device, location, and session data comes from Google Analytics — no individual visitor identity is collected or stored here.
            </div>
        </div>
    );
}
