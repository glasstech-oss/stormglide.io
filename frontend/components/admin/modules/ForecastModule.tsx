"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, ArrowUpRight, ArrowDownRight, Calendar,
    DollarSign, BarChart2, Target
} from "lucide-react";
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

const MRR_DATA = [
    { month: "Jan", actual: 12500, projected: null },
    { month: "Feb", actual: 15800, projected: null },
    { month: "Mar", actual: 14200, projected: null },
    { month: "Apr", actual: 19500, projected: null },
    { month: "May", actual: 21000, projected: null },
    { month: "Jun", actual: 28400, projected: null },
    { month: "Jul", actual: null, projected: 34000 },
    { month: "Aug", actual: null, projected: 38500 },
    { month: "Sep", actual: null, projected: 42000 },
];

const CASHFLOW_EVENTS = [
    { date: "Jun 25", label: "INV-2026-006 due — Apex Logistics", amount: 30000, type: "incoming" as const },
    { date: "Jun 29", label: "Postmark renewal — StarTech", amount: 60, type: "outgoing" as const },
    { date: "Jul 01", label: "AWS EC2 renewal — Nexus-MFG", amount: 380, type: "outgoing" as const },
    { date: "Jul 01", label: "Firebase billing — Apex Logistics", amount: 410, type: "outgoing" as const },
    { date: "Jul 01", label: "SendGrid + Sentry — Nexus-MFG", amount: 215, type: "outgoing" as const },
    { date: "Jul 02", label: "INV-2026-003 due — Coastal Pharma", amount: 12000, type: "incoming" as const },
    { date: "Jul 05", label: "DigitalOcean renewal — StarTech", amount: 200, type: "outgoing" as const },
    { date: "Jul 10", label: "Maps API billing — BioLink", amount: 160, type: "outgoing" as const },
    { date: "Jul 15", label: "Vercel Pro — Apex Logistics", amount: 80, type: "outgoing" as const },
    { date: "Jul 18", label: "Phase completion invoice — Nexus-MFG", amount: 20000, type: "incoming" as const },
    { date: "Jul 22", label: "Cloudinary renewal — Apex", amount: 45, type: "outgoing" as const },
    { date: "Aug 01", label: "Expected retainer — BioLink SLA", amount: 8500, type: "incoming" as const },
];

const PROFITABILITY = [
    { client: "BioLink Technologies", invoiced: 140000, costs: 664, marginPct: 99.5, phase: "COMPLETED" },
    { client: "Apex Logistics Ltd.", invoiced: 55000, costs: 535, marginPct: 99.0, phase: "BACKEND_ARCH" },
    { client: "Nexus-MFG", invoiced: 18500, costs: 595, marginPct: 96.8, phase: "STAGING" },
    { client: "Coastal Pharma", invoiced: 12000, costs: 80, marginPct: 99.3, phase: "DISCOVERY" },
    { client: "StarTech Holdings", invoiced: 8500, costs: 260, marginPct: 96.9, phase: "UI/UX" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 text-sm shadow-2xl">
                <p className="font-mono text-gray-400 text-xs mb-2">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color }} className="font-bold">
                        {p.name}: GHS {(p.value || 0).toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ForecastModule() {
    const [activeView, setActiveView] = useState<"mrr" | "cashflow" | "profitability">("mrr");

    const currentMRR = 28400;
    const projectedMRR = 42000;
    const growthPct = (((projectedMRR - currentMRR) / currentMRR) * 100).toFixed(1);
    const totalAR = CASHFLOW_EVENTS.filter(e => e.type === "incoming").reduce((a, e) => a + e.amount, 0);
    const totalAP = CASHFLOW_EVENTS.filter(e => e.type === "outgoing").reduce((a, e) => a + e.amount, 0);
    const netCashflow = totalAR - totalAP;

    return (
        <div className="space-y-8">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Current MRR", value: `GHS ${currentMRR.toLocaleString()}`, sub: "Jun 2026", icon: TrendingUp, color: "cyan" },
                    { label: "Projected MRR (Sep)", value: `GHS ${projectedMRR.toLocaleString()}`, sub: `+${growthPct}% growth`, icon: Target, color: "purple" },
                    { label: "Incoming (60 days)", value: `GHS ${totalAR.toLocaleString()}`, sub: "invoices + retainers", icon: ArrowUpRight, color: "emerald" },
                    { label: "Net Cashflow", value: `GHS ${netCashflow.toLocaleString()}`, sub: "next 60 days", icon: BarChart2, color: netCashflow > 0 ? "emerald" : "red" },
                ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-[#111827] border border-white/5">
                        <div className={`text-${kpi.color}-400 mb-3`}><kpi.icon size={18} /></div>
                        <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
                        <div className="text-lg font-bold text-white font-mono">{kpi.value}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{kpi.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* View Tabs */}
            <div className="flex gap-2">
                {(["mrr", "cashflow", "profitability"] as const).map(v => (
                    <button key={v} onClick={() => setActiveView(v)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${activeView === v ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"}`}>
                        {v === "mrr" ? "MRR Projection" : v === "cashflow" ? "Cash Flow (60 days)" : "Project Profitability"}
                    </button>
                ))}
            </div>

            {/* MRR Chart */}
            {activeView === "mrr" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-3xl bg-[#111827] border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">MRR Growth + 3-Month Projection</h3>
                            <p className="text-sm text-gray-500 mt-1">Solid = actual · Dashed = projected</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">ARR (projected)</div>
                            <div className="text-2xl font-bold text-cyan-400 font-mono">GHS {(projectedMRR * 12).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={MRR_DATA}>
                                <defs>
                                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="actual" name="Actual MRR" fill="#22D3EE" fillOpacity={0.7} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="projected" name="Projected MRR" fill="#A855F7" fillOpacity={0.5} radius={[6, 6, 0, 0]} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Cash Flow Timeline */}
            {activeView === "cashflow" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-3xl bg-[#111827] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">Cash Flow Calendar</h3>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Incoming</span>
                            <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Outgoing</span>
                        </div>
                    </div>
                    {CASHFLOW_EVENTS.map((ev, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="w-14 flex-shrink-0 text-center">
                                <div className="text-[10px] font-mono text-gray-600">DATE</div>
                                <div className="text-xs font-bold text-white font-mono">{ev.date}</div>
                            </div>
                            <div className={`flex-shrink-0 p-2 rounded-lg ${ev.type === "incoming" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                                {ev.type === "incoming"
                                    ? <ArrowUpRight size={14} className="text-emerald-400" />
                                    : <ArrowDownRight size={14} className="text-red-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{ev.label}</p>
                            </div>
                            <div className={`text-sm font-bold font-mono flex-shrink-0 ${ev.type === "incoming" ? "text-emerald-400" : "text-red-400"}`}>
                                {ev.type === "incoming" ? "+" : "-"}GHS {ev.amount.toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Net 60-day cashflow</span>
                        <span className={`text-xl font-bold font-mono ${netCashflow > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {netCashflow > 0 ? "+" : ""}GHS {netCashflow.toLocaleString()}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Profitability */}
            {activeView === "profitability" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden">
                    <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                        <span>Client</span><span>Invoiced</span><span>Running Costs</span><span>Net Profit</span><span>Margin</span>
                    </div>
                    {PROFITABILITY.map((row, i) => {
                        const net = row.invoiced - row.costs;
                        return (
                            <motion.div
                                key={row.client}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] gap-2 md:gap-4 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center last:border-0"
                            >
                                <div>
                                    <div className="text-sm font-medium text-white">{row.client}</div>
                                    <div className="text-[10px] font-mono text-gray-600 mt-0.5">{row.phase}</div>
                                </div>
                                <div className="font-mono font-bold text-white text-sm">GHS {row.invoiced.toLocaleString()}</div>
                                <div className="font-mono text-sm text-red-400">GHS {row.costs.toLocaleString()}</div>
                                <div className="font-mono font-bold text-emerald-400 text-sm">GHS {net.toLocaleString()}</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${row.marginPct}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.06 }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-emerald-400 w-12 text-right">{row.marginPct}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div className="px-6 py-5 bg-white/[0.02] border-t border-white/10">
                        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 text-sm">
                            <div className="font-bold text-gray-400">TOTAL</div>
                            <div className="font-bold font-mono text-white">GHS {PROFITABILITY.reduce((a, r) => a + r.invoiced, 0).toLocaleString()}</div>
                            <div className="font-bold font-mono text-red-400">GHS {PROFITABILITY.reduce((a, r) => a + r.costs, 0).toLocaleString()}</div>
                            <div className="font-bold font-mono text-emerald-400">GHS {PROFITABILITY.reduce((a, r) => a + r.invoiced - r.costs, 0).toLocaleString()}</div>
                            <div className="font-bold font-mono text-emerald-400">98.8%</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
