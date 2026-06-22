"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, AlertTriangle, CheckCircle2, TrendingDown, Plus, Filter } from "lucide-react";

type BilledTo = "stormglide" | "client";
type SubStatus = "active" | "expiring" | "expired";

interface Subscription {
    id: string;
    clientId: string;
    client: string;
    service: string;
    category: string;
    monthlyCost: number;
    currency: string;
    billedTo: BilledTo;
    renewalDate: string;
    status: SubStatus;
}

const SUBS: Subscription[] = [
    { id: "s1", clientId: "c1", client: "Apex Logistics Ltd.", service: "Firebase (Blaze)", category: "Backend", monthlyCost: 410, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s2", clientId: "c1", client: "Apex Logistics Ltd.", service: "Vercel Pro", category: "Hosting", monthlyCost: 80, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 15, 2026", status: "active" },
    { id: "s3", clientId: "c1", client: "Apex Logistics Ltd.", service: "Cloudinary", category: "Media", monthlyCost: 45, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 22, 2026", status: "active" },
    { id: "s4", clientId: "c1", client: "Apex Logistics Ltd.", service: "Paystack", category: "Payments", monthlyCost: 0, currency: "GHS", billedTo: "client", renewalDate: "Usage-based", status: "active" },
    { id: "s5", clientId: "c2", client: "Nexus-MFG", service: "AWS EC2 (t3.medium)", category: "Hosting", monthlyCost: 380, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s6", clientId: "c2", client: "Nexus-MFG", service: "SendGrid", category: "Email", monthlyCost: 120, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 10, 2026", status: "active" },
    { id: "s7", clientId: "c2", client: "Nexus-MFG", service: "Sentry", category: "Monitoring", monthlyCost: 95, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s8", clientId: "c3", client: "Coastal Pharma", service: "Vercel Pro", category: "Hosting", monthlyCost: 80, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s9", clientId: "c4", client: "BioLink Technologies", service: "Firebase (Blaze)", category: "Backend", monthlyCost: 284, currency: "GHS", billedTo: "client", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s10", clientId: "c4", client: "BioLink Technologies", service: "Google Maps API", category: "Maps", monthlyCost: 160, currency: "GHS", billedTo: "client", renewalDate: "Usage-based", status: "active" },
    { id: "s11", clientId: "c4", client: "BioLink Technologies", service: "Twilio SMS", category: "Messaging", monthlyCost: 220, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 01, 2026", status: "active" },
    { id: "s12", clientId: "c5", client: "StarTech Holdings", service: "DigitalOcean Droplet", category: "Hosting", monthlyCost: 200, currency: "GHS", billedTo: "stormglide", renewalDate: "Jul 05, 2026", status: "active" },
    { id: "s13", clientId: "c5", client: "StarTech Holdings", service: "Postmark", category: "Email", monthlyCost: 60, currency: "GHS", billedTo: "stormglide", renewalDate: "Jun 29, 2026", status: "expiring" },
];

const CLIENTS = ["All Clients", "Apex Logistics Ltd.", "Nexus-MFG", "Coastal Pharma", "BioLink Technologies", "StarTech Holdings"];
const CATEGORIES = ["All Categories", "Hosting", "Backend", "Email", "Media", "Payments", "Monitoring", "Maps", "Messaging"];

const STATUS_CFG: Record<SubStatus, { icon: React.ComponentType<{ size?: number; className?: string }>, color: string, bg: string }> = {
    active: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    expiring: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    expired: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function fmt(n: number, currency: string) {
    if (n === 0) return "Usage-based";
    return `${currency} ${n.toLocaleString()}`;
}

export default function SubscriptionsModule() {
    const [clientFilter, setClientFilter] = useState("All Clients");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [billedFilter, setBilledFilter] = useState<"all" | BilledTo>("all");

    const filtered = SUBS.filter(s => {
        const matchClient = clientFilter === "All Clients" || s.client === clientFilter;
        const matchCategory = categoryFilter === "All Categories" || s.category === categoryFilter;
        const matchBilled = billedFilter === "all" || s.billedTo === billedFilter;
        return matchClient && matchCategory && matchBilled;
    });

    const totalMonthly = SUBS.filter(s => s.billedTo === "stormglide").reduce((acc, s) => acc + s.monthlyCost, 0);
    const clientBilled = SUBS.filter(s => s.billedTo === "client").reduce((acc, s) => acc + s.monthlyCost, 0);
    const expiring = SUBS.filter(s => s.status === "expiring" || s.status === "expired").length;

    // Per-client cost rollup
    const clientRollup = CLIENTS.slice(1).map(name => {
        const subs = SUBS.filter(s => s.client === name && s.billedTo === "stormglide");
        return { name, cost: subs.reduce((a, s) => a + s.monthlyCost, 0), count: subs.length };
    }).sort((a, b) => b.cost - a.cost);
    const maxCost = Math.max(...clientRollup.map(r => r.cost), 1);

    return (
        <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Our Monthly Cost", value: `GHS ${totalMonthly.toLocaleString()}`, icon: TrendingDown, color: "cyan", note: "paid by Stormglide" },
                    { label: "Client-Paid Services", value: `GHS ${clientBilled.toLocaleString()}`, icon: Package, color: "purple", note: "billed to clients" },
                    { label: "Active Subscriptions", value: SUBS.length, icon: CheckCircle2, color: "emerald", note: "across all projects" },
                    { label: "Expiring Soon", value: expiring, icon: Clock, color: "amber", note: "needs attention" },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5">
                        <div className={`text-${s.color}-400 mb-3`}><s.icon size={18} /></div>
                        <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                        <div className="text-xl font-bold text-white font-mono">{s.value}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{s.note}</div>
                    </motion.div>
                ))}
            </div>

            {/* Cost per client bar chart */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-white/5">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <TrendingDown size={15} className="text-cyan-400" /> Monthly cost breakdown by client (billed by Stormglide)
                </h3>
                <div className="space-y-3">
                    {clientRollup.map((row, i) => (
                        <div key={row.name} className="flex items-center gap-4">
                            <div className="text-xs text-gray-400 w-40 flex-shrink-0 truncate">{row.name}</div>
                            <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(row.cost / maxCost) * 100}%` }}
                                    transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.08 }}
                                    className="h-full bg-gradient-to-r from-cyan-500/70 to-purple-500/40 rounded-full"
                                />
                            </div>
                            <div className="text-xs font-mono text-white w-24 text-right flex-shrink-0">
                                {row.cost > 0 ? `GHS ${row.cost}` : "—"}
                                <span className="text-gray-600 ml-1">({row.count})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50">
                    {CLIENTS.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {(["all", "stormglide", "client"] as const).map(f => (
                    <button key={f} onClick={() => setBilledFilter(f)}
                        className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${billedFilter === f ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}>
                        {f === "all" ? "All" : f === "stormglide" ? "We Pay" : "Client Pays"}
                    </button>
                ))}
                <button className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]">
                    <Plus size={15} /> Add Subscription
                </button>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_1.5fr] gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Service</span><span>Client</span><span>Category</span><span>Billed To</span><span>Monthly Cost</span><span>Renewal</span>
                </div>
                <div className="divide-y divide-white/5">
                    {filtered.map((sub, i) => {
                        const cfg = STATUS_CFG[sub.status];
                        const SIcon = cfg.icon;
                        return (
                            <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_1.5fr] gap-2 md:gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        {sub.service.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{sub.service}</div>
                                        {sub.status === "expiring" && <div className="text-[10px] text-amber-400 font-mono">Renewing soon</div>}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400 truncate">{sub.client}</div>
                                <div className="text-xs text-gray-500 px-2 py-1 rounded-lg bg-white/5 w-fit">{sub.category}</div>
                                <div>
                                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border ${sub.billedTo === "stormglide" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"}`}>
                                        {sub.billedTo === "stormglide" ? "Us" : "Client"}
                                    </span>
                                </div>
                                <div className="font-mono font-bold text-white text-sm">{fmt(sub.monthlyCost, sub.currency)}</div>
                                <div className="flex items-center gap-2">
                                    <SIcon size={12} className={cfg.color} />
                                    <span className="text-xs font-mono text-gray-400">{sub.renewalDate}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
