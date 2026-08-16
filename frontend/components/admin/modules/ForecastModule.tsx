"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, BarChart2, Loader2
} from "lucide-react";
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { BillingAPI, ProjectsAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";

type View = "revenue" | "cashflow" | "profitability";

interface CashflowEvent {
    date: Date;
    label: string;
    amount: number;
    type: "incoming" | "outgoing";
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-sm shadow-2xl">
                <p className="font-mono text-gray-400 text-xs mb-2">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {(p.value || 0).toLocaleString()}</p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ForecastModule() {
    const [activeView, setActiveView] = useState<View>("revenue");
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [subs, setSubs] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    const load = useCallback(async () => {
        try {
            const [inv, sub, exp, proj] = await Promise.all([
                BillingAPI.getInvoices(),
                ProjectsAPI.getAllSubscriptions(),
                ProjectsAPI.getExpenses(),
                ProjectsAPI.list(),
            ]);
            setInvoices(inv || []);
            setSubs(sub || []);
            setExpenses(exp || []);
            setProjects(proj || []);
        } catch {
            // leave everything empty — an honest blank forecast beats invented numbers
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const projectToClient = useMemo(() => {
        const map = new Map<string, { clientId: string; name: string }>();
        projects.forEach((p: any) => map.set(p.id, { clientId: p.clientId, name: p.client?.companyName || p.projectName }));
        return map;
    }, [projects]);

    // Revenue by month — built from paid invoices' actual payment dates.
    // Not "MRR" in the recurring-subscription sense: this business invoices
    // by phase, not by subscription, so this is realized revenue over time.
    const revenueByMonth = useMemo(() => {
        const paid = invoices.filter((i) => i.status === "PAID");
        const buckets = new Map<string, number>();
        paid.forEach((inv) => {
            const d = toDate(inv.paidAt) || toDate(inv.createdAt);
            if (!d) return;
            const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            buckets.set(key, (buckets.get(key) || 0) + (Number(inv.amount) || 0));
        });
        return Array.from(buckets, ([month, revenue]) => ({ month, revenue }));
    }, [invoices]);

    const thisMonthRevenue = useMemo(() => {
        const now = new Date();
        return invoices
            .filter((i) => i.status === "PAID")
            .filter((i) => {
                const d = toDate(i.paidAt) || toDate(i.createdAt);
                return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((a, i) => a + (Number(i.amount) || 0), 0);
    }, [invoices]);

    const outstanding = useMemo(
        () => invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((a, i) => a + (Number(i.amount) || 0), 0),
        [invoices]
    );

    const cashflowEvents: CashflowEvent[] = useMemo(() => {
        const incoming: CashflowEvent[] = invoices
            .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
            .map((i) => {
                const d = toDate(i.dueDate);
                return d ? { date: d, label: `${i.invoiceNumber} due — ${i.client?.companyName || 'Unknown client'}`, amount: Number(i.amount) || 0, type: "incoming" as const } : null;
            })
            .filter(Boolean) as CashflowEvent[];

        const outgoing: CashflowEvent[] = subs
            .filter((s) => s.status === "ACTIVE" && s.billingFrequency === "MONTHLY")
            .map((s) => {
                const d = toDate(s.renewalDate);
                const client = projectToClient.get(s.projectId);
                return d ? { date: d, label: `${s.serviceName} renewal — ${client?.name || 'Unassigned'}`, amount: Number(s.monthlyCost) || 0, type: "outgoing" as const } : null;
            })
            .filter(Boolean) as CashflowEvent[];

        return [...incoming, ...outgoing].sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [invoices, subs, projectToClient]);

    const next30 = cashflowEvents.filter((e) => {
        const days = (e.date.getTime() - Date.now()) / 86400000;
        return days >= -1 && days <= 30;
    });
    const totalAR = next30.filter((e) => e.type === "incoming").reduce((a, e) => a + e.amount, 0);
    const totalAP = next30.filter((e) => e.type === "outgoing").reduce((a, e) => a + e.amount, 0);
    const netCashflow = totalAR - totalAP;

    const profitability = useMemo(() => {
        const byClient = new Map<string, { name: string; invoiced: number; costs: number }>();
        invoices.filter((i) => i.status === "PAID").forEach((i) => {
            const key = i.clientId;
            const name = i.client?.companyName || "Unknown client";
            const row = byClient.get(key) || { name, invoiced: 0, costs: 0 };
            row.invoiced += Number(i.amount) || 0;
            byClient.set(key, row);
        });
        expenses.forEach((e) => {
            const client = projectToClient.get(e.projectId);
            if (!client) return;
            const row = byClient.get(client.clientId) || { name: client.name, invoiced: 0, costs: 0 };
            row.costs += Number(e.amount) || 0;
            byClient.set(client.clientId, row);
        });
        subs.filter((s) => s.status === "ACTIVE" && s.billingFrequency === "MONTHLY").forEach((s) => {
            const client = projectToClient.get(s.projectId);
            if (!client) return;
            const row = byClient.get(client.clientId) || { name: client.name, invoiced: 0, costs: 0 };
            row.costs += Number(s.monthlyCost) || 0;
            byClient.set(client.clientId, row);
        });
        return Array.from(byClient.values())
            .map((r) => ({ ...r, net: r.invoiced - r.costs, marginPct: r.invoiced > 0 ? Math.round(((r.invoiced - r.costs) / r.invoiced) * 100) : 0 }))
            .sort((a, b) => b.invoiced - a.invoiced);
    }, [invoices, expenses, subs, projectToClient]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Revenue This Month", value: thisMonthRevenue, icon: TrendingUp, color: "cyan" },
                    { label: "Outstanding (unpaid)", value: outstanding, icon: DollarSign, color: "amber" },
                    { label: "Incoming (30 days)", value: totalAR, icon: ArrowUpRight, color: "emerald" },
                    { label: "Net Cashflow (30 days)", value: netCashflow, icon: BarChart2, color: netCashflow >= 0 ? "emerald" : "red" },
                ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5">
                        <div className={`text-${kpi.color}-400 mb-3`}><kpi.icon size={18} /></div>
                        <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
                        <div className="text-lg font-bold text-white font-mono">{kpi.value.toLocaleString()}</div>
                    </motion.div>
                ))}
            </div>
            <p className="text-[11px] text-gray-600 -mt-4">Amounts summed at face value across invoice currencies — not currency-converted.</p>

            {/* View Tabs */}
            <div className="flex gap-2">
                {(["revenue", "cashflow", "profitability"] as const).map((v) => (
                    <button key={v} onClick={() => setActiveView(v)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${activeView === v ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}>
                        {v === "revenue" ? "Revenue" : v === "cashflow" ? "Cash Flow" : "Client Profitability"}
                    </button>
                ))}
            </div>

            {activeView === "revenue" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-3xl bg-[#111827] border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">Realized revenue by month</h3>
                    <p className="text-sm text-gray-500 mb-6">Paid invoices only. History starts from your first recorded payment — there's no backfilled trend data before that.</p>
                    {revenueByMonth.length === 0 ? (
                        <div className="py-16 text-center text-gray-600 font-mono text-sm">No paid invoices yet.</div>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={revenueByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="revenue" name="Revenue" fill="#22D3EE" fillOpacity={0.7} radius={[6, 6, 0, 0]} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </motion.div>
            )}

            {activeView === "cashflow" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-3xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">Cash Flow Timeline</h3>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Incoming</span>
                            <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Outgoing</span>
                        </div>
                    </div>
                    {cashflowEvents.length === 0 && (
                        <div className="py-16 text-center text-gray-600 font-mono text-sm">No upcoming invoices or subscription renewals.</div>
                    )}
                    {cashflowEvents.map((ev, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                            <div className="w-16 flex-shrink-0 text-center">
                                <div className="text-[10px] font-mono text-gray-600">DATE</div>
                                <div className="text-xs font-bold text-white font-mono">{ev.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            </div>
                            <div className={`flex-shrink-0 p-2 rounded-lg ${ev.type === "incoming" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                                {ev.type === "incoming" ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{ev.label}</p>
                            </div>
                            <div className={`text-sm font-bold font-mono flex-shrink-0 ${ev.type === "incoming" ? "text-emerald-400" : "text-red-400"}`}>
                                {ev.type === "incoming" ? "+" : "-"}{ev.amount.toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {activeView === "profitability" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden">
                    <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                        <span>Client</span><span>Invoiced (paid)</span><span>Running Costs</span><span>Net</span><span>Margin</span>
                    </div>
                    {profitability.length === 0 && (
                        <div className="py-16 text-center text-gray-600 font-mono text-sm">No paid invoices yet.</div>
                    )}
                    {profitability.map((row, i) => (
                        <motion.div key={row.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                            className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] gap-2 md:gap-4 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center last:border-0">
                            <div className="text-sm font-medium text-white">{row.name}</div>
                            <div className="font-mono font-bold text-white text-sm">{row.invoiced.toLocaleString()}</div>
                            <div className="font-mono text-sm text-red-400">{row.costs.toLocaleString()}</div>
                            <div className={`font-mono font-bold text-sm ${row.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>{row.net.toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, row.marginPct))}%` }} transition={{ duration: 0.8, delay: i * 0.06 }}
                                        className={`h-full rounded-full ${row.marginPct >= 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                                </div>
                                <span className={`text-xs font-mono w-12 text-right ${row.marginPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>{row.marginPct}%</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
