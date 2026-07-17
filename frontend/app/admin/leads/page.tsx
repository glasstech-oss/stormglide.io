"use client";

import React, { useEffect, useState } from "react";
import { Inbox, Loader2, Mail, Phone, RefreshCw } from "lucide-react";
import { CrmAPI, Lead } from "@/lib/api";
import { formatDate } from "@/lib/firestore";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "ARCHIVED"] as const;

const STATUS_STYLE: Record<string, string> = {
    NEW: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    CONTACTED: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    QUALIFIED: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    ARCHIVED: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const load = async (status?: string) => {
        try {
            setLoading(true);
            setError("");
            setLeads(await CrmAPI.getLeads(status || undefined));
        } catch (err) {
            console.error("Failed to load leads:", err);
            setError("Could not load leads.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(statusFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            await CrmAPI.updateLeadStatus(id, status);
            setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        } catch (err) {
            console.error("Failed to update lead status:", err);
            setError("Could not update that lead's status.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="mt-1 text-gray-400">Everyone who submitted a contact or demo request form on the public site.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    >
                        <option value="">All statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => load(statusFilter)}
                        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </div>

            {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={20} className="animate-spin text-cyan-400" />
                </div>
            ) : leads.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-16 text-center text-gray-500">
                    <Inbox size={28} />
                    <p>No leads yet. Submissions from the contact form and product demo requests will show up here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {leads.map((lead) => (
                        <div key={lead.id} className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold text-white">{lead.name}</span>
                                        {lead.organization && <span className="text-sm text-gray-500">· {lead.organization}</span>}
                                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[lead.status] || STATUS_STYLE.NEW}`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5"><Mail size={13} /> {lead.email}</span>
                                        {lead.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {lead.phone}</span>}
                                        {lead.product && <span>Product: <span className="text-gray-300">{lead.product}</span></span>}
                                        {lead.source && <span>Source: <span className="text-gray-300">{lead.source}</span></span>}
                                    </div>
                                    {(lead.missionScope || lead.details) && (
                                        <p className="pt-1 text-sm text-gray-300">{lead.missionScope || lead.details}</p>
                                    )}
                                    {(lead.budget || lead.timeline) && (
                                        <div className="flex gap-4 pt-1 text-xs text-gray-500">
                                            {lead.budget && <span>Budget: {lead.budget}</span>}
                                            {lead.timeline && <span>Timeline: {lead.timeline}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <span className="text-xs text-gray-500">{formatDate(lead.createdAt as never, "Unknown date")}</span>
                                    <select
                                        value={lead.status}
                                        disabled={updatingId === lead.id}
                                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
