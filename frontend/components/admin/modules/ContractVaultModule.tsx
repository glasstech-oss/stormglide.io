"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitoringAPI, ProjectsAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";
import {
    FileText, ExternalLink, Search, Loader2,
    CheckCircle2, Clock, Send, FileCheck, Archive, Plus, X
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
    date: Date | null;
    fileUrl: string | null;
    fileSize: string | null;
    signedAt: Date | null;
    signedBy: string | null;
}

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

const TYPE_LIST: ("all" | DocType)[] = ["all", "contract", "nda", "proposal", "brief", "asset"];
const STATUS_LIST: DocStatus[] = ["draft", "sent", "signed", "active"];

function NewDocumentModal({ clients, onClose, onCreated }: { clients: any[]; onClose: () => void; onCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<DocType>("contract");
    const [clientId, setClientId] = useState(clients[0]?.id || "");
    const [fileUrl, setFileUrl] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!title.trim() || !clientId) return;
        setSaving(true);
        try {
            await MonitoringAPI.createDocument({
                clientId, type: type.toUpperCase(), title: title.trim(),
                status: "DRAFT", fileUrl: fileUrl.trim() || undefined,
            });
            onCreated();
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-3xl bg-[#0d1117] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">New document</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5"><X size={16} /></button>
                </div>
                <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title"
                    className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
                <div className="grid grid-cols-2 gap-3">
                    <select value={type} onChange={(e) => setType(e.target.value as DocType)}
                        className="rounded-xl bg-[#111827] border border-white/10 px-3 py-2.5 text-sm text-white outline-none">
                        {(Object.keys(TYPE_CFG) as DocType[]).map((t) => <option key={t} value={t}>{TYPE_CFG[t].label}</option>)}
                    </select>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)}
                        className="rounded-xl bg-[#111827] border border-white/10 px-3 py-2.5 text-sm text-white outline-none">
                        {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                </div>
                <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="File link (optional)"
                    className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
                <button onClick={submit} disabled={!title.trim() || !clientId || saving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {saving ? "Creating..." : "Create document"}
                </button>
            </motion.div>
        </div>
    );
}

export default function ContractVaultModule() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [clients, setClients] = useState<{ id: string; companyName: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("All Clients");
    const [typeFilter, setTypeFilter] = useState<"all" | DocType>("all");

    const load = useCallback(async () => {
        try {
            const [apiDocs, projects] = await Promise.all([MonitoringAPI.getDocuments(), ProjectsAPI.list()]);
            const clientMap = new Map<string, string>();
            (projects || []).forEach((p: any) => {
                if (p.clientId && p.client?.companyName) clientMap.set(p.clientId, p.client.companyName);
            });
            setClients(Array.from(clientMap, ([id, companyName]) => ({ id, companyName })));
            const mapped: Document[] = (apiDocs || []).map((d: any) => ({
                id: d.id,
                clientId: d.clientId,
                client: d.client?.companyName || "Unknown client",
                type: (d.type?.toLowerCase() || "contract") as DocType,
                title: d.title,
                status: (d.status?.toLowerCase() || "draft") as DocStatus,
                date: toDate(d.createdAt),
                fileUrl: d.fileUrl || null,
                fileSize: d.fileSize || null,
                signedAt: toDate(d.signedAt),
                signedBy: d.signedBy || null,
            }));
            setDocs(mapped);
        } catch {
            // leave docs empty — an honest empty vault beats stale fake documents
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const clientNames = useMemo(() => ["All Clients", ...new Set(docs.map((d) => d.client))], [docs]);

    const filtered = docs.filter((d) => {
        const matchClient = clientFilter === "All Clients" || d.client === clientFilter;
        const matchType = typeFilter === "all" || d.type === typeFilter;
        const matchSearch = search === "" || d.title.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase());
        return matchClient && matchType && matchSearch;
    });

    const stats = {
        total: docs.length,
        signed: docs.filter((d) => d.status === "signed" || d.status === "active").length,
        pending: docs.filter((d) => d.status === "sent" || d.status === "draft").length,
    };

    const setStatus = async (doc: Document, status: DocStatus) => {
        setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status } : d)));
        await MonitoringAPI.updateDocumentStatus(doc.id, status.toUpperCase());
        load();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

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
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..."
                        className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-56" />
                </div>
                <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none">
                    {clientNames.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-2 flex-wrap">
                    {TYPE_LIST.map((t) => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            className={`px-3 py-2 rounded-xl border text-xs capitalize transition-all ${typeFilter === t
                                ? t === "all" ? "bg-white/10 border-white/20 text-white"
                                    : `${TYPE_CFG[t as DocType].bg} ${TYPE_CFG[t as DocType].color} border-current`
                                : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}>
                            {t === "all" ? "All Types" : TYPE_CFG[t as DocType].label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowNew(true)}
                    disabled={clients.length === 0}
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)] disabled:opacity-50"
                >
                    <Plus size={15} /> New Document
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
                        <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl border ${tCfg.bg}`}>
                                    <TypeIcon size={16} className={tCfg.color} />
                                </div>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${sCfg.bg} ${sCfg.color}`}>
                                    <StatusIcon size={10} /> {sCfg.label}
                                </span>
                            </div>

                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">{doc.title}</h4>
                            <p className="text-xs text-gray-500 mb-1">{doc.client}</p>
                            {doc.status === "signed" && doc.signedAt && (
                                <p className="text-[11px] text-emerald-500/80 mb-3">Signed {doc.signedAt.toLocaleDateString()}{doc.signedBy ? ` by ${doc.signedBy}` : ""}</p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/5">
                                <span className="font-mono">{doc.date?.toLocaleDateString() ?? "Unknown date"}</span>
                                {doc.fileUrl ? (
                                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                                        Open <ExternalLink size={10} />
                                    </a>
                                ) : (
                                    <span className="text-gray-700">No file linked</span>
                                )}
                            </div>

                            <select
                                value={doc.status}
                                onChange={(e) => setStatus(doc, e.target.value as DocStatus)}
                                className="w-full mt-3 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-gray-300 outline-none hover:bg-white/10"
                            >
                                {STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
                            </select>
                        </motion.div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-span-3 text-center py-16 text-gray-600 font-mono text-sm">
                        {docs.length === 0 ? "No documents in the vault yet." : "No documents match your filters."}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showNew && <NewDocumentModal clients={clients} onClose={() => setShowNew(false)} onCreated={load} />}
            </AnimatePresence>
        </div>
    );
}
