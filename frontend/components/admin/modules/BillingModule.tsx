"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BillingAPI } from "@/lib/api";
import {
    CreditCard, TrendingUp, AlertCircle, Download,
    Plus, CheckCircle2, Clock, XCircle, FileText, Filter
} from "lucide-react";

type InvoiceStatus = "PAID" | "PENDING" | "OVERDUE";

interface Invoice {
    id: string;
    client: string;
    project: string;
    date: string;
    dueDate: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
}

const INVOICES: Invoice[] = [
    { id: "INV-2026-001", client: "Apex Logistics Ltd.", project: "Apex Enterprise Core Architecture", date: "Feb 01, 2026", dueDate: "Feb 15, 2026", amount: 25000, currency: "GHS", status: "PAID" },
    { id: "INV-2026-002", client: "Nexus-MFG", project: "Nexus Manufacturing Portal", date: "Mar 10, 2026", dueDate: "Mar 25, 2026", amount: 18500, currency: "GHS", status: "PAID" },
    { id: "INV-2026-003", client: "Coastal Pharma", project: "Coastal Distribution System", date: "Jun 01, 2026", dueDate: "Jun 15, 2026", amount: 12000, currency: "GHS", status: "PENDING" },
    { id: "INV-2026-004", client: "BioLink Technologies", project: "BioLink Patient Connect", date: "Apr 22, 2026", dueDate: "May 06, 2026", amount: 35000, currency: "GHS", status: "PAID" },
    { id: "INV-2026-005", client: "StarTech Holdings", project: "StarTech Operations Suite", date: "Jun 05, 2026", dueDate: "Jun 15, 2026", amount: 8500, currency: "GHS", status: "OVERDUE" },
    { id: "INV-2026-006", client: "Apex Logistics Ltd.", project: "Apex Enterprise Core Architecture — Phase 2", date: "Jun 18, 2026", dueDate: "Jul 02, 2026", amount: 30000, currency: "GHS", status: "PENDING" },
];

const STATUS_CONFIG: Record<InvoiceStatus, { icon: React.ComponentType<{ size?: number; className?: string }>, color: string, bg: string }> = {
    PAID: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    PENDING: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    OVERDUE: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function fmtAmount(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString()}`;
}

export default function BillingModule() {
    const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
    const [filter, setFilter] = useState<InvoiceStatus | "ALL">("ALL");

    useEffect(() => {
        BillingAPI.getInvoices().then((apiInvoices: any[]) => {
            if (!apiInvoices || apiInvoices.length === 0) return;
            const mapped: Invoice[] = apiInvoices.map((inv: any) => ({
                id: inv.invoiceNumber,
                client: inv.client?.companyName || "Unknown",
                project: inv.project?.projectName || "General",
                date: new Date(inv.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                dueDate: new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                amount: Number(inv.amount),
                currency: inv.currency,
                status: (inv.status === "PAID" ? "PAID" : inv.status === "OVERDUE" ? "OVERDUE" : "PENDING") as InvoiceStatus,
            }));
            setInvoices(mapped);
        }).catch(() => {});
    }, []);

    const filtered = invoices.filter(inv => filter === "ALL" || inv.status === filter);
    const totalCollected = invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices.filter(i => i.status === "PENDING").reduce((s, i) => s + i.amount, 0);
    const totalOverdue = invoices.filter(i => i.status === "OVERDUE").reduce((s, i) => s + i.amount, 0);
    const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Invoiced", value: fmtAmount(totalInvoiced, "GHS"), icon: FileText, color: "cyan" },
                    { label: "Collected", value: fmtAmount(totalCollected, "GHS"), icon: TrendingUp, color: "emerald" },
                    { label: "Awaiting Payment", value: fmtAmount(totalPending, "GHS"), icon: Clock, color: "amber" },
                    { label: "Overdue", value: fmtAmount(totalOverdue, "GHS"), icon: AlertCircle, color: "red" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5"
                    >
                        <div className={`text-${stat.color}-400 mb-3`}>
                            <stat.icon size={18} />
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2">
                    {(["ALL", "PAID", "PENDING", "OVERDUE"] as const).map(f => {
                        const cfg = f !== "ALL" ? STATUS_CONFIG[f] : null;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === f
                                    ? f === "ALL"
                                        ? "bg-white/10 border-white/20 text-white"
                                        : `${cfg!.bg} ${cfg!.color} border-current`
                                    : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                {f === "ALL" ? "All Invoices" : f.charAt(0) + f.slice(1).toLowerCase()}
                                <span className="ml-2 text-[10px] font-mono opacity-60">
                                    {f === "ALL" ? invoices.length : invoices.filter(inv => inv.status === f).length}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]">
                    <Plus size={16} /> Generate Invoice
                </button>
            </div>

            {/* Invoice Table */}
            <div className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_3fr_1.5fr_1.5fr_1.5fr_auto] gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Invoice</span>
                    <span>Project</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span></span>
                </div>

                <div className="divide-y divide-white/5">
                    {filtered.map((inv, i) => {
                        const cfg = STATUS_CONFIG[inv.status];
                        const StatusIcon = cfg.icon;
                        return (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1.5fr_1.5fr_1.5fr_auto] gap-2 md:gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors items-center"
                            >
                                <div>
                                    <div className="font-mono text-sm text-white">{inv.id}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{inv.client}</div>
                                </div>
                                <div className="text-sm text-gray-300 truncate">{inv.project}</div>
                                <div className="font-mono text-xs text-gray-500">
                                    <span className="block">{inv.date}</span>
                                    <span className="text-gray-600">due {inv.dueDate}</span>
                                </div>
                                <div className="font-mono font-bold text-white">{fmtAmount(inv.amount, inv.currency)}</div>
                                <div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                                        <StatusIcon size={11} />
                                        {inv.status}
                                    </span>
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all">
                                    <Download size={12} /> PDF
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
