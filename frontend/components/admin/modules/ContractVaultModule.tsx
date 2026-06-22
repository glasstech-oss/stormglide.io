"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MonitoringAPI } from "@/lib/api";
import {
    FileText, Upload, Download, Search, Eye,
    CheckCircle2, Clock, Send, FileCheck, Archive, Plus
} from "lucide-react";

type DocType = "contract" | "nda" | "proposal" | "brief" | "asset";
type DocStatus = "draft" | "sent" | "signed" | "active";

interface Document {
    id: string;
    clientId: string;
    client: string;
    type: DocType;
    title: string;
    status: DocStatus;
    date: string;
    fileSize: string;
}

const DOCS: Document[] = [
    { id: "d1", clientId: "c1", client: "Apex Logistics Ltd.", type: "contract", title: "Master Service Agreement — Apex Enterprise Core", status: "signed", date: "Jan 05, 2026", fileSize: "2.4 MB" },
    { id: "d2", clientId: "c1", client: "Apex Logistics Ltd.", type: "nda", title: "Non-Disclosure Agreement", status: "signed", date: "Jan 03, 2026", fileSize: "1.1 MB" },
    { id: "d3", clientId: "c1", client: "Apex Logistics Ltd.", type: "brief", title: "Project Technical Brief — Phase 2", status: "active", date: "Jun 18, 2026", fileSize: "4.8 MB" },
    { id: "d4", clientId: "c2", client: "Nexus-MFG", type: "contract", title: "Software Development Contract — Nexus Portal", status: "signed", date: "Feb 15, 2026", fileSize: "3.1 MB" },
    { id: "d5", clientId: "c2", client: "Nexus-MFG", type: "nda", title: "Mutual NDA", status: "signed", date: "Feb 10, 2026", fileSize: "980 KB" },
    { id: "d6", clientId: "c3", client: "Coastal Pharma", type: "proposal", title: "Project Proposal — Coastal Distribution System", status: "signed", date: "Jun 01, 2026", fileSize: "6.2 MB" },
    { id: "d7", clientId: "c3", client: "Coastal Pharma", type: "contract", title: "Master Service Agreement", status: "sent", date: "Jun 10, 2026", fileSize: "2.4 MB" },
    { id: "d8", clientId: "c4", client: "BioLink Technologies", type: "contract", title: "SLA — BioLink Patient Connect (Ongoing)", status: "active", date: "Oct 01, 2025", fileSize: "3.8 MB" },
    { id: "d9", clientId: "c4", client: "BioLink Technologies", type: "asset", title: "Brand Identity & Design Assets Pack", status: "active", date: "Oct 15, 2025", fileSize: "42 MB" },
    { id: "d10", clientId: "c5", client: "StarTech Holdings", type: "proposal", title: "Proposal — StarTech Operations Suite", status: "signed", date: "Jun 18, 2026", fileSize: "5.1 MB" },
    { id: "d11", clientId: "c5", client: "StarTech Holdings", type: "nda", title: "Confidentiality Agreement", status: "signed", date: "Jun 17, 2026", fileSize: "1.2 MB" },
    { id: "d12", clientId: "c5", client: "StarTech Holdings", type: "contract", title: "Software Development Contract", status: "draft", date: "Jun 22, 2026", fileSize: "2.4 MB" },
];

const TYPE_CFG: Record<DocType, { label: string; color: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    contract: { label: "Contract", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", icon: FileCheck },
    nda: { label: "NDA", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: Archive },
    proposal: { label: "Proposal", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: FileText },
    brief: { label: "Brief", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: FileText },
    asset: { label: "Assets", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Archive },
};

const STATUS_CFG: Record<DocStatus, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
    draft: { label: "Draft", icon: Clock, color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
    sent: { label: "Sent", icon: Send, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    signed: { label: "Signed", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    active: { label: "Active", icon: CheckCircle2, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
};

const CLIENTS_LIST = ["All Clients", "Apex Logistics Ltd.", "Nexus-MFG", "Coastal Pharma", "BioLink Technologies", "StarTech Holdings"];
const TYPE_LIST: ("all" | DocType)[] = ["all", "contract", "nda", "proposal", "brief", "asset"];

export default function ContractVaultModule() {
    const [docs, setDocs] = useState<Document[]>(DOCS);
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("All Clients");
    const [typeFilter, setTypeFilter] = useState<"all" | DocType>("all");

    useEffect(() => {
        MonitoringAPI.getDocuments().then((apiDocs: any[]) => {
            if (!apiDocs || apiDocs.length === 0) return;
            const mapped: Document[] = apiDocs.map((d: any) => ({
                id: d.id,
                clientId: d.clientId,
                client: d.client?.companyName || "Unknown",
                type: (d.type?.toLowerCase() || "contract") as DocType,
                title: d.title,
                status: (d.status?.toLowerCase() || "draft") as DocStatus,
                date: new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                fileSize: d.fileSize || "—",
            }));
            setDocs(mapped);
        }).catch(() => {});
    }, []);

    const filtered = docs.filter(d => {
        const matchClient = clientFilter === "All Clients" || d.client === clientFilter;
        const matchType = typeFilter === "all" || d.type === typeFilter;
        const matchSearch = search === "" || d.title.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase());
        return matchClient && matchType && matchSearch;
    });

    const stats = {
        total: docs.length,
        signed: docs.filter(d => d.status === "signed" || d.status === "active").length,
        pending: docs.filter(d => d.status === "sent" || d.status === "draft").length,
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Documents", value: stats.total, color: "cyan" },
                    { label: "Signed / Active", value: stats.signed, color: "emerald" },
                    { label: "Awaiting Action", value: stats.pending, color: "amber" },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                        <div className={`text-3xl font-bold text-${s.color}-400`}>{s.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
                        className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-56" />
                </div>
                <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none">
                    {CLIENTS_LIST.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-2 flex-wrap">
                    {TYPE_LIST.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            className={`px-3 py-2 rounded-xl border text-xs capitalize transition-all ${typeFilter === t
                                ? t === "all" ? "bg-white/10 border-white/20 text-white"
                                    : `${TYPE_CFG[t as DocType].bg} ${TYPE_CFG[t as DocType].color} border-current`
                                : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}>
                            {t === "all" ? "All Types" : TYPE_CFG[t as DocType].label}
                        </button>
                    ))}
                </div>
                <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]">
                    <Upload size={15} /> Upload Document
                </button>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((doc, i) => {
                    const tCfg = TYPE_CFG[doc.type];
                    const sCfg = STATUS_CFG[doc.status];
                    const TypeIcon = tCfg.icon;
                    const StatusIcon = sCfg.icon;
                    return (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl border ${tCfg.bg}`}>
                                    <TypeIcon size={16} className={tCfg.color} />
                                </div>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${sCfg.bg} ${sCfg.color}`}>
                                    <StatusIcon size={10} /> {sCfg.label}
                                </span>
                            </div>

                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">{doc.title}</h4>
                            <p className="text-xs text-gray-500 mb-4">{doc.client}</p>

                            <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/5">
                                <span className="font-mono">{doc.date}</span>
                                <span className="font-mono">{doc.fileSize}</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all">
                                    <Eye size={12} /> Preview
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-span-3 text-center py-16 text-gray-600 font-mono text-sm">No documents match your filters.</div>
                )}
            </div>
        </div>
    );
}
