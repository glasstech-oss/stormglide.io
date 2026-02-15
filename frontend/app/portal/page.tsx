"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Circle,
    ExternalLink,
    MessageSquare,
    FileText,
    CreditCard,
    Activity,
    LogOut,
    ShieldCheck,
    Zap,
    ChevronRight
} from "lucide-react";

// ==========================================
// 1. DATA MODELS (Mirroring the Prisma Schema)
// ==========================================
type ProjectPhase = "DISCOVERY" | "UI_UX_DESIGN" | "BACKEND_ARCHITECTURE" | "STAGING" | "PRODUCTION";

interface Milestone {
    id: string;
    phase: ProjectPhase;
    title: string;
    isCompleted: boolean;
    date: string;
}

// Simulated data fetching from your NestJS Backend
const mockClientData = {
    companyName: "Apex Logistics Ltd.",
    contactName: "David",
    activeProject: {
        jobId: "PRJ-2026-X8F9",
        name: "Apex Enterprise Core Architecture",
        currentPhase: "BACKEND_ARCHITECTURE" as ProjectPhase,
        stagingUrl: "https://staging.apex.stormglide.io",
        isLiveSandboxActive: true,
        milestones: [
            { id: "m1", phase: "DISCOVERY", title: "Deep Discovery & Requirements", isCompleted: true, date: "Jan 15, 2026" },
            { id: "m2", phase: "UI_UX_DESIGN", title: "UI/UX Interactive Prototyping", isCompleted: true, date: "Jan 28, 2026" },
            { id: "m3", phase: "BACKEND_ARCHITECTURE", title: "Database Schema & API Architecture", isCompleted: false, date: "In Progress" },
            { id: "m4", phase: "STAGING", title: "Live Staging Sandbox Deployment", isCompleted: false, date: "Pending" },
            { id: "m5", phase: "PRODUCTION", title: "Production Launch & Handover", isCompleted: false, date: "Pending" },
        ] as Milestone[],
    },
    recentInvoice: {
        id: "INV-2026-001",
        amount: "25,000",
        currency: "GHS", // Routing context via Paystack
        status: "PAID",
        date: "Feb 01, 2026"
    }
};

// ==========================================
// 2. MAIN DASHBOARD COMPONENT
// ==========================================
export default function ClientPortal() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(mockClientData);

    // Simulate network request for Skeleton Loaders
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const project = data.activeProject;

    // Determine active phase index for the glowing progress line
    const activePhaseIndex = project.milestones.findIndex(m => m.phase === project.currentPhase);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-32 md:pb-12 px-6 lg:px-8 max-w-7xl mx-auto">

            {/* ========================================== */}
            {/* HEADER: CLIENT GREETING & SECURITY BADGE   */}
            {/* ========================================== */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.contactName}</h1>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                            <ShieldCheck size={14} /> Secure Session
                        </div>
                    </div>
                    <p className="text-gray-400">Viewing active deployment matrix for <span className="text-white font-semibold">{data.companyName}</span>.</p>
                </div>

                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 w-full md:w-auto">
                    <LogOut size={16} /> End Session
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ========================================== */}
                {/* LEFT COLUMN: THE JOB ID TRACKER            */}
                {/* ========================================== */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Project Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-3xl bg-[#111827] border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
                            <div>
                                <div className="text-xs text-cyan-400 font-mono tracking-widest mb-2 flex items-center gap-2">
                                    <Activity size={14} /> ACTIVE DEPLOYMENT
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                                <div className="flex items-center gap-3 text-sm font-mono text-gray-400">
                                    <span>JOB ID:</span>
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white tracking-wider">{project.jobId}</span>
                                </div>
                            </div>

                            {/* The Live Sandbox Trigger */}
                            <button
                                disabled={!project.isLiveSandboxActive}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${project.isLiveSandboxActive
                                        ? "bg-cyan-500 text-[#0B0F19] hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                <Zap size={18} />
                                {project.isLiveSandboxActive ? "Launch Live Sandbox" : "Sandbox Offline"}
                            </button>
                        </div>

                        {/* The Timeline Architecture */}
                        <div className="relative pl-4 md:pl-8">
                            {/* Vertical connecting line */}
                            <div className="absolute top-2 bottom-6 left-[27px] md:left-[43px] w-[2px] bg-gray-800 rounded-full"></div>

                            {/* Glowing active line segment */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(activePhaseIndex / (project.milestones.length - 1)) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute top-2 left-[27px] md:left-[43px] w-[2px] bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] z-0"
                            ></motion.div>

                            <div className="space-y-10">
                                {isLoading ? (
                                    // Skeleton Loaders for the timeline
                                    Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="flex gap-6 animate-pulse">
                                            <div className="relative z-10 w-6 h-6 rounded-full bg-gray-800 border-4 border-[#111827]"></div>
                                            <div className="flex-1 space-y-3 pt-1">
                                                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                                                <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Actual Timeline Nodes
                                    project.milestones.map((milestone, index) => {
                                        const isActive = index === activePhaseIndex;
                                        const isPast = index < activePhaseIndex;

                                        return (
                                            <motion.div
                                                key={milestone.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                                className="flex gap-6 relative z-10 group"
                                            >
                                                {/* Node Icon */}
                                                <div className="relative mt-0.5">
                                                    {isPast ? (
                                                        <CheckCircle2 className="text-cyan-400 bg-[#111827] rounded-full relative z-10 shadow-[0_0_15px_rgba(34,211,238,0.3)]" size={24} />
                                                    ) : isActive ? (
                                                        <div className="w-6 h-6 rounded-full bg-[#111827] border-2 border-purple-400 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                                        </div>
                                                    ) : (
                                                        <Circle className="text-gray-700 bg-[#111827] rounded-full relative z-10" size={24} />
                                                    )}
                                                </div>

                                                {/* Node Content */}
                                                <div className={`flex-1 ${isActive ? "bg-white/5 border border-white/10 p-4 rounded-xl -mt-4" : ""}`}>
                                                    <h3 className={`text-lg font-bold mb-1 ${isActive ? "text-purple-400" : isPast ? "text-white" : "text-gray-500"}`}>
                                                        {milestone.title}
                                                    </h3>
                                                    <div className={`text-sm font-mono ${isActive || isPast ? "text-gray-400" : "text-gray-600"}`}>
                                                        {milestone.date}
                                                    </div>

                                                    {/* Active Phase specific controls */}
                                                    {isActive && (
                                                        <div className="mt-4 flex gap-3">
                                                            <button className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center gap-1.5">
                                                                <ExternalLink size={12} /> View Architecture Docs
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: BILLING & QUICK ACTIONS      */}
                {/* ========================================== */}
                <div className="space-y-6">

                    {/* Quick Support & Feedback Module */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-3xl bg-[#111827] border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MessageSquare size={18} className="text-cyan-400" /> Direct Comms
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">Need to leave feedback on the staging build or talk to the architecture team?</p>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm">
                                <span>Submit Staging Feedback</span>
                                <ChevronRight size={16} className="text-gray-500" />
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm">
                                <span>WhatsApp Core Team</span>
                                <ChevronRight size={16} className="text-gray-500" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Billing & Invoice Engine Module */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-3xl bg-gradient-to-b from-[#111827] to-[#1a2235] border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard size={18} className="text-emerald-400" /> Financial Hub
                        </h3>

                        <div className="p-4 rounded-2xl bg-black/30 border border-white/5 mb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs text-gray-500 font-mono mb-1">LATEST INVOICE</div>
                                    <div className="font-mono text-white text-sm">{data.recentInvoice.id}</div>
                                </div>
                                <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider">
                                    {data.recentInvoice.status}
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-gray-400 font-mono text-sm">{data.recentInvoice.currency}</span>
                                <span className="text-2xl font-bold text-white">{data.recentInvoice.amount}</span>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm font-medium">
                            <FileText size={16} /> View All Invoices
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
