"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe, ShieldCheck, Activity, Database, Flame, X,
    AlertTriangle, CheckCircle2, XCircle, RefreshCw,
    Server, Clock, HardDrive, Wifi, BarChart2, Radio
} from "lucide-react";
import { MonitoringAPI } from "@/lib/api";

type DBStatus = "healthy" | "warning" | "critical";
type UptimeStatus = "up" | "degraded" | "down";
type SSLGrade = "A" | "B" | "C" | "F";

interface FirebaseData {
    project: string;
    firestoreReads: number;
    firestoreWrites: number;
    authMAU: number;
    storageGB: number;
    monthlySpend: number;
    budget: number;
    burnRate: number;
}

interface ClientInfra {
    id: string;
    name: string;
    domain: { url: string; registrar: string; expiryDate: string; daysLeft: number; autoRenew: boolean };
    ssl: { issuer: string; expiryDate: string; daysLeft: number; grade: SSLGrade; valid: boolean };
    uptime: { percentage: number; status: UptimeStatus; latencyMs: number; lastChecked: string };
    database: { type: string; connectionPool: number; queryLatency: string; diskUsageGb: number; lastBackup: string; status: DBStatus };
    firebase: FirebaseData | null;
    trustScore: number;
    webVitals: { lcp: string; cls: string; fid: string; score: number };
}

const CLIENT_INFRA: ClientInfra[] = [
    {
        id: "c1", name: "Apex Logistics Ltd.",
        domain: { url: "apexlogistics.gh", registrar: "GoDaddy", expiryDate: "Dec 15, 2026", daysLeft: 176, autoRenew: true },
        ssl: { issuer: "Let's Encrypt", expiryDate: "Jul 06, 2026", daysLeft: 14, grade: "A", valid: true },
        uptime: { percentage: 99.8, status: "up", latencyMs: 142, lastChecked: "2 min ago" },
        database: { type: "PostgreSQL 15", connectionPool: 8, queryLatency: "4ms", diskUsageGb: 12.4, lastBackup: "6 hours ago", status: "healthy" },
        firebase: { project: "apex-logistics-prod", firestoreReads: 142000, firestoreWrites: 38000, authMAU: 124, storageGB: 4.2, monthlySpend: 410, budget: 500, burnRate: 22 },
        trustScore: 82,
        webVitals: { lcp: "1.8s", cls: "0.05", fid: "12ms", score: 88 },
    },
    {
        id: "c2", name: "Nexus-MFG",
        domain: { url: "nexusmfg.com", registrar: "Namecheap", expiryDate: "Mar 22, 2027", daysLeft: 273, autoRenew: true },
        ssl: { issuer: "Sectigo", expiryDate: "Sep 10, 2026", daysLeft: 80, grade: "A", valid: true },
        uptime: { percentage: 99.6, status: "up", latencyMs: 188, lastChecked: "1 min ago" },
        database: { type: "PostgreSQL 15", connectionPool: 6, queryLatency: "6ms", diskUsageGb: 8.1, lastBackup: "48 hours ago", status: "warning" },
        firebase: null,
        trustScore: 78,
        webVitals: { lcp: "2.4s", cls: "0.08", fid: "18ms", score: 74 },
    },
    {
        id: "c3", name: "Coastal Pharma",
        domain: { url: "coastalpharma.gh", registrar: "GhanaDomains", expiryDate: "Jul 20, 2026", daysLeft: 28, autoRenew: false },
        ssl: { issuer: "Let's Encrypt", expiryDate: "Aug 18, 2026", daysLeft: 57, grade: "B", valid: true },
        uptime: { percentage: 99.1, status: "up", latencyMs: 310, lastChecked: "5 min ago" },
        database: { type: "MySQL 8.0", connectionPool: 4, queryLatency: "12ms", diskUsageGb: 3.2, lastBackup: "12 hours ago", status: "healthy" },
        firebase: null,
        trustScore: 64,
        webVitals: { lcp: "3.1s", cls: "0.14", fid: "35ms", score: 58 },
    },
    {
        id: "c4", name: "BioLink Technologies",
        domain: { url: "biolink.io", registrar: "Cloudflare", expiryDate: "Aug 05, 2026", daysLeft: 44, autoRenew: false },
        ssl: { issuer: "DigiCert", expiryDate: "Oct 22, 2026", daysLeft: 122, grade: "A", valid: true },
        uptime: { percentage: 99.95, status: "up", latencyMs: 98, lastChecked: "30 sec ago" },
        database: { type: "PostgreSQL 16", connectionPool: 12, queryLatency: "2ms", diskUsageGb: 28.6, lastBackup: "4 hours ago", status: "healthy" },
        firebase: { project: "biolink-patient-prod", firestoreReads: 890000, firestoreWrites: 124000, authMAU: 1840, storageGB: 22.1, monthlySpend: 284, budget: 600, burnRate: 15 },
        trustScore: 93,
        webVitals: { lcp: "1.2s", cls: "0.02", fid: "8ms", score: 97 },
    },
    {
        id: "c5", name: "StarTech Holdings",
        domain: { url: "startechgh.com", registrar: "GoDaddy", expiryDate: "Nov 30, 2026", daysLeft: 161, autoRenew: true },
        ssl: { issuer: "Let's Encrypt", expiryDate: "Aug 30, 2026", daysLeft: 69, grade: "A", valid: true },
        uptime: { percentage: 94.2, status: "degraded", latencyMs: 524, lastChecked: "3 min ago" },
        database: { type: "MySQL 8.0", connectionPool: 3, queryLatency: "28ms", diskUsageGb: 2.1, lastBackup: "20 hours ago", status: "warning" },
        firebase: null,
        trustScore: 61,
        webVitals: { lcp: "4.2s", cls: "0.22", fid: "88ms", score: 42 },
    },
];

function trustColor(score: number) {
    if (score >= 90) return { text: "text-emerald-400", ring: "border-emerald-500/30", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]", bg: "bg-emerald-500/10" };
    if (score >= 75) return { text: "text-cyan-400", ring: "border-cyan-500/30", glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]", bg: "bg-cyan-500/10" };
    if (score >= 60) return { text: "text-amber-400", ring: "border-amber-500/30", glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]", bg: "bg-amber-500/10" };
    return { text: "text-red-400", ring: "border-red-500/30", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]", bg: "bg-red-500/10" };
}

function sslGradeColor(grade: SSLGrade) {
    const map = { A: "text-emerald-400 bg-emerald-500/10", B: "text-amber-400 bg-amber-500/10", C: "text-orange-400 bg-orange-500/10", F: "text-red-400 bg-red-500/10" };
    return map[grade];
}

function uptimeColor(status: UptimeStatus) {
    const map = { up: "text-emerald-400", degraded: "text-amber-400", down: "text-red-400" };
    return map[status];
}

function dbColor(status: DBStatus) {
    const map = { healthy: "text-emerald-400", warning: "text-amber-400", critical: "text-red-400" };
    return map[status];
}

function FirebaseCard({ fb }: { fb: FirebaseData }) {
    const pct = (fb.monthlySpend / fb.budget) * 100;
    const barColor = pct >= 80 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-emerald-500";
    const daysLeft = 30 - Math.floor((fb.monthlySpend / fb.burnRate));

    return (
        <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-sm font-bold text-white">Firebase</span>
                    <span className="text-[10px] font-mono text-gray-500">{fb.project}</span>
                </div>
                <span className={`text-xs font-bold font-mono ${pct >= 80 ? "text-red-400" : pct >= 60 ? "text-amber-400" : "text-emerald-400"}`}>
                    {pct.toFixed(0)}% used
                </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span className="font-mono">GHS {fb.monthlySpend} / {fb.budget}</span>
                <span className="font-mono text-orange-400">~{daysLeft}d until budget</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                    { label: "Firestore Reads", value: `${(fb.firestoreReads / 1000).toFixed(0)}K` },
                    { label: "Firestore Writes", value: `${(fb.firestoreWrites / 1000).toFixed(0)}K` },
                    { label: "Auth MAU", value: fb.authMAU.toLocaleString() },
                    { label: "Storage", value: `${fb.storageGB} GB` },
                ].map((m, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-gray-600 mb-0.5">{m.label}</div>
                        <div className="font-mono font-bold text-gray-300">{m.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ClientDetail({ client, onClose }: { client: ClientInfra; onClose: () => void }) {
    const tc = trustColor(client.trustScore);
    return (
        <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0d1117] border-l border-white/5 z-50 overflow-y-auto flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold ${tc.ring} ${tc.bg} ${tc.text}`}>
                        Trust Score: {client.trustScore}/100
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 p-8 space-y-6">
                {/* Domain */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Globe size={15} className="text-cyan-400" /> Domain
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { label: "URL", value: client.domain.url },
                            { label: "Registrar", value: client.domain.registrar },
                            { label: "Expires", value: client.domain.expiryDate },
                            {
                                label: "Days Left",
                                value: <span className={client.domain.daysLeft < 30 ? "text-red-400 font-bold" : "text-white"}>{client.domain.daysLeft}d</span>
                            },
                            {
                                label: "Auto-Renew",
                                value: client.domain.autoRenew
                                    ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> ON</span>
                                    : <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> OFF</span>
                            },
                        ].map((row, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{row.label}</span>
                                <span className="text-white text-sm">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SSL */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <ShieldCheck size={15} className="text-cyan-400" /> SSL Certificate
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold font-mono ${sslGradeColor(client.ssl.grade)}`}>
                            Grade {client.ssl.grade}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { label: "Issuer", value: client.ssl.issuer },
                            { label: "Expires", value: client.ssl.expiryDate },
                            { label: "Days Left", value: <span className={client.ssl.daysLeft < 30 ? "text-red-400 font-bold" : "text-white"}>{client.ssl.daysLeft}d</span> },
                            { label: "Valid", value: <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Yes</span> },
                        ].map((row, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{row.label}</span>
                                <span className="text-white text-sm">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Uptime */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Activity size={15} className="text-cyan-400" /> Uptime & Performance
                        </div>
                        <span className={`text-xs font-mono font-bold capitalize ${uptimeColor(client.uptime.status)}`}>
                            {client.uptime.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Uptime", value: `${client.uptime.percentage}%` },
                            { label: "Latency", value: `${client.uptime.latencyMs}ms` },
                            { label: "Checked", value: client.uptime.lastChecked },
                        ].map((m, i) => (
                            <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                                <div className="text-[10px] font-mono text-gray-600 mb-1 uppercase">{m.label}</div>
                                <div className="text-sm font-bold font-mono text-white">{m.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Database */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Database size={15} className="text-cyan-400" /> Database
                            <span className="text-gray-500 font-normal text-xs">{client.database.type}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${dbColor(client.database.status)}`}>
                            {client.database.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { label: "Connections", value: `${client.database.connectionPool} active` },
                            { label: "Query Latency", value: client.database.queryLatency },
                            { label: "Disk Usage", value: `${client.database.diskUsageGb} GB` },
                            { label: "Last Backup", value: client.database.lastBackup },
                        ].map((row, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{row.label}</span>
                                <span className={`text-sm ${row.label === "Last Backup" && client.database.lastBackup.includes("48") ? "text-amber-400 font-bold" : "text-white"}`}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Web Vitals */}
                <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <BarChart2 size={15} className="text-cyan-400" /> Core Web Vitals
                        </div>
                        <span className={`text-xs font-mono font-bold ${client.webVitals.score >= 80 ? "text-emerald-400" : client.webVitals.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                            Score: {client.webVitals.score}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "LCP", value: client.webVitals.lcp, good: parseFloat(client.webVitals.lcp) < 2.5 },
                            { label: "CLS", value: client.webVitals.cls, good: parseFloat(client.webVitals.cls) < 0.1 },
                            { label: "FID", value: client.webVitals.fid, good: parseFloat(client.webVitals.fid) < 100 },
                        ].map((m, i) => (
                            <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                                <div className="text-[10px] font-mono text-gray-600 mb-1">{m.label}</div>
                                <div className={`text-sm font-bold font-mono ${m.good ? "text-emerald-400" : "text-amber-400"}`}>{m.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Firebase */}
                {client.firebase && <FirebaseCard fb={client.firebase} />}
            </div>
        </div>
    );
}

// Merge live API snapshot data onto a ClientInfra object
function applyLiveSnapshots(client: ClientInfra, snapshots: any[]): ClientInfra {
    const clientSnaps = snapshots.filter((s: any) => s.client?.companyName === client.name);
    if (!clientSnaps.length) return client;

    const latest = (type: string) =>
        clientSnaps.filter((s: any) => s.checkType === type).sort((a: any, b: any) =>
            new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
        )[0];

    const sslSnap = latest('SSL');
    const uptimeSnap = latest('UPTIME');

    const updated = { ...client };

    if (sslSnap?.details) {
        const d = sslSnap.details as any;
        const daysLeft = d.daysLeft ?? client.ssl.daysLeft;
        updated.ssl = {
            ...client.ssl,
            issuer: d.issuer || client.ssl.issuer,
            expiryDate: d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : client.ssl.expiryDate,
            daysLeft,
            grade: (daysLeft > 60 ? 'A' : daysLeft > 30 ? 'B' : daysLeft > 0 ? 'C' : 'F') as any,
            valid: d.valid ?? client.ssl.valid,
        };
    }

    if (uptimeSnap?.details) {
        const d = uptimeSnap.details as any;
        const statusCode = d.statusCode ?? 200;
        const latencyMs = d.latencyMs ?? client.uptime.latencyMs;
        updated.uptime = {
            ...client.uptime,
            status: uptimeSnap.status === 'HEALTHY' ? 'up' : uptimeSnap.status === 'WARNING' ? 'degraded' : 'down',
            latencyMs,
            percentage: uptimeSnap.status === 'HEALTHY' ? client.uptime.percentage : uptimeSnap.status === 'WARNING' ? 95.0 : 0,
            lastChecked: new Date(uptimeSnap.checkedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
    }

    // Recalculate trust score based on live data
    let penalty = 0;
    if (updated.ssl.daysLeft < 14) penalty += 20;
    else if (updated.ssl.daysLeft < 30) penalty += 10;
    if (updated.uptime.status === 'down') penalty += 30;
    else if (updated.uptime.status === 'degraded') penalty += 15;
    if (!updated.domain.autoRenew) penalty += 5;
    updated.trustScore = Math.max(0, Math.min(100, 100 - penalty));

    return updated;
}

export default function InfrastructureModule() {
    const [selected, setSelected] = useState<ClientInfra | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [clients, setClients] = useState<ClientInfra[]>(CLIENT_INFRA);
    const [isLive, setIsLive] = useState(false);
    const [lastChecked, setLastChecked] = useState<string>('');

    const loadSnapshots = useCallback(async () => {
        try {
            const snapshots = await MonitoringAPI.getSnapshots();
            if (snapshots?.length) {
                setIsLive(true);
                setLastChecked(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                setClients(CLIENT_INFRA.map(c => applyLiveSnapshots(c, snapshots)));
            }
        } catch {
            // API unavailable — keep mock data
        }
    }, []);

    useEffect(() => {
        loadSnapshots();
    }, [loadSnapshots]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadSnapshots();
        setTimeout(() => setRefreshing(false), 800);
    };

    const firebaseClients = clients.filter(c => c.firebase !== null);

    return (
        <div className="relative space-y-8">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Infrastructure health across all active client deployments.</p>
                    {isLive && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                            <Radio size={9} className="animate-pulse" /> LIVE · {lastChecked}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={14} className={refreshing ? "animate-spin text-cyan-400" : ""} />
                    {refreshing ? "Refreshing..." : "Refresh All"}
                </button>
            </div>

            {/* Client Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {clients.map((client, i) => {
                    const tc = trustColor(client.trustScore);
                    const hasWarning = client.ssl.daysLeft < 30 || !client.domain.autoRenew || client.database.status !== "healthy" || client.uptime.status !== "up";

                    return (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => setSelected(client)}
                            className={`p-6 rounded-3xl bg-[#111827] border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200 group ${tc.glow}`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm mb-1">{client.name}</h4>
                                    <span className="text-xs font-mono text-gray-500">{client.domain.url}</span>
                                </div>
                                {hasWarning && (
                                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <AlertTriangle size={12} className="text-amber-400" />
                                    </div>
                                )}
                            </div>

                            {/* Trust Score */}
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Trust Score</span>
                                    <span className={`text-xl font-bold ${tc.text}`}>{client.trustScore}</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${client.trustScore}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.07 }}
                                        className={`h-full rounded-full ${client.trustScore >= 90 ? "bg-emerald-500" : client.trustScore >= 75 ? "bg-cyan-500" : client.trustScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                    />
                                </div>
                            </div>

                            {/* Quick metrics */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <ShieldCheck size={12} className={`${client.ssl.daysLeft < 30 ? "text-red-400" : "text-emerald-400"}`} />
                                    <div>
                                        <div className="text-[9px] font-mono text-gray-600">SSL</div>
                                        <div className={`text-xs font-bold ${client.ssl.daysLeft < 30 ? "text-red-400" : "text-white"}`}>
                                            {client.ssl.grade} · {client.ssl.daysLeft}d
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <Activity size={12} className={uptimeColor(client.uptime.status)} />
                                    <div>
                                        <div className="text-[9px] font-mono text-gray-600">Uptime</div>
                                        <div className={`text-xs font-bold ${uptimeColor(client.uptime.status)}`}>{client.uptime.percentage}%</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <Globe size={12} className={client.domain.daysLeft < 30 ? "text-amber-400" : "text-gray-400"} />
                                    <div>
                                        <div className="text-[9px] font-mono text-gray-600">Domain</div>
                                        <div className={`text-xs font-bold ${client.domain.daysLeft < 30 ? "text-amber-400" : "text-white"}`}>{client.domain.daysLeft}d left</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <Database size={12} className={dbColor(client.database.status)} />
                                    <div>
                                        <div className="text-[9px] font-mono text-gray-600">Database</div>
                                        <div className={`text-xs font-bold ${dbColor(client.database.status)} capitalize`}>{client.database.status}</div>
                                    </div>
                                </div>
                            </div>

                            {client.firebase && (
                                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <div className="flex items-center gap-2">
                                        <Flame size={12} className="text-orange-400" />
                                        <span className="text-[10px] font-mono text-gray-500">Firebase</span>
                                    </div>
                                    <span className={`text-xs font-bold font-mono ${(client.firebase.monthlySpend / client.firebase.budget) >= 0.8 ? "text-red-400" : "text-orange-300"}`}>
                                        {((client.firebase.monthlySpend / client.firebase.budget) * 100).toFixed(0)}% budget
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Firebase Projects Overview */}
            {firebaseClients.length > 0 && (
                <div className="p-8 rounded-3xl bg-[#111827] border border-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                        <Flame size={18} className="text-orange-400" />
                        <h3 className="text-lg font-bold text-white">Firebase Cost Monitor</h3>
                        <span className="text-xs font-mono text-gray-500 ml-auto">Billing period: Jun 1 – Jun 30, 2026</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {clients.filter(c => c.firebase).map(client => client.firebase && (
                            <FirebaseCard key={client.id} fb={client.firebase} />
                        ))}
                    </div>
                </div>
            )}

            {/* Detail Slide-over */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-xl z-50"
                        >
                            <ClientDetail client={selected} onClose={() => setSelected(null)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
