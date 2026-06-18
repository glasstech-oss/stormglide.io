"use client";

import React from "react";
import SiteControl from "@/components/admin/SiteControl";
import {
    TrendingUp,
    Users,
    Zap,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    Server
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useAdminStore } from "@/store/adminStore";

// Mock data for the MRR Chart
const mrrData = [
    { month: "Jan", mrr: 12500 },
    { month: "Feb", mrr: 15800 },
    { month: "Mar", mrr: 14200 },
    { month: "Apr", mrr: 19500 },
    { month: "May", mrr: 21000 },
    { month: "Jun", mrr: 28400 },
    { month: "Jul", mrr: 32000 },
];

const auditLogs = [
    { id: 1, action: "Invoice INV-001 sent", entity: "Apex Logistics", time: "2 mins ago", status: "success" },
    { id: 2, action: "Staging feedback received", entity: "Nexus-MFG", time: "15 mins ago", status: "info" },
    { id: 3, action: "Security scan completed", entity: "System Core", time: "1 hour ago", status: "success" },
    { id: 4, action: "API Key rotated", entity: "Cloud Infrastructure", time: "3 hours ago", status: "warning" },
];

const servers = [
    { name: "Nexus-Sales Production", status: "Online", latency: "12ms", load: "14%" },
    { name: "Stormglide API Gateway", status: "Online", latency: "8ms", load: "22%" },
    { name: "PostgreSQL Master", status: "Online", latency: "2ms", load: "31%" },
    { name: "HRM-Staging", status: "Maintenance", latency: "-", load: "-" },
];

import SettingsPage from "../settings/page";

export default function DashboardPage() {
    const { activeTab } = useAdminStore();

    return (
        <div className="space-y-8 pb-20">
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {activeTab === 'dashboard' ? 'Admin Overview' :
                            activeTab === 'settings' ? 'Site Orchestration' :
                                'Access restricted'}
                    </h1>
                    <p className="text-gray-400">
                        {activeTab === 'dashboard' ? 'View and manage your business performance and logs.' :
                            activeTab === 'settings' ? 'Update your website name, colors, and content easily.' :
                                'You do not have permission to see this page.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-cyan-400" />
                        <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {activeTab === 'dashboard' && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Monthly Revenue", value: 32000, color: "cyan", icon: TrendingUp, trend: "+12.5%" },
                            { label: "Active Clients", value: 24, color: "purple", icon: Users, trend: "+2" },
                            { label: "Project Progress", value: "98.2%", color: "emerald", icon: Zap, trend: "Good" },
                            { label: "Security", value: "Safe", color: "blue", icon: ShieldCheck, trend: "Active" },
                        ].map((kpi, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-[#111827] border border-white/5 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-${kpi.color}-500/10 transition-colors`}></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl bg-${kpi.color}-500/10 text-${kpi.color}-400`}>
                                            <kpi.icon size={20} />
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                            {kpi.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <Activity size={10} />}
                                            {kpi.trend}
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm font-medium mb-1">{kpi.label}</div>
                                    <div className="text-2xl font-bold text-white">
                                        {typeof kpi.value === 'number' ? formatCurrency(kpi.value, 'USD') : kpi.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* MRR Chart */}
                        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#111827] border border-white/5">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Revenue Overview</h3>
                                    <p className="text-sm text-gray-400">Monthly revenue growth</p>
                                </div>
                                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-cyan-500/50">
                                    <option>Last 7 Months</option>
                                    <option>This Year</option>
                                </select>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mrrData}>
                                        <defs>
                                            <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#22D3EE' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="mrr"
                                            stroke="#22D3EE"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorMrr)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Audit Logs */}
                        <div className="p-8 rounded-3xl bg-[#111827] border border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-cyan-400" />
                                Audit Logs
                            </h3>
                            <div className="space-y-6">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className={`w-2 h-2 rounded-full ring-4 ring-${log.status === 'success' ? 'emerald' : log.status === 'warning' ? 'amber' : 'blue'}-500/20 bg-${log.status === 'success' ? 'emerald' : log.status === 'warning' ? 'amber' : 'blue'}-500`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{log.action}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <span>{log.entity}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                <span>{log.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all mt-4">
                                    View All Logs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* System Pulse / Server Status */}
                    <div className="p-8 rounded-3xl bg-[#111827] border border-white/5">
                        <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <Server size={20} className="text-purple-400" />
                            System Pulse
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {servers.map((server, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="text-sm font-bold text-gray-200 truncate w-3/4">{server.name}</div>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${server.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            <Activity size={10} />
                                            {server.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Latency</div>
                                            <div className="text-sm font-mono text-cyan-400">{server.latency}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Load</div>
                                            <div className="text-sm font-mono text-purple-400">{server.load}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'dashboard' && (
                <>
                    {/* ... existing dashboard content ... */}
                </>
            )}

            {activeTab === 'settings' && <SettingsPage />}

            {(activeTab !== 'dashboard' && activeTab !== 'settings') && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
                        🛠️
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Module Under Construction</h3>
                        <p className="text-gray-400 max-w-md">Commander, this secure module is currently being calibrated for your high-performance operations.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
