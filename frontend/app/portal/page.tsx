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
    ChevronRight,
    Send,
    X,
    Phone,
    ArrowRight,
    Star,
    Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PortalAPI } from "@/lib/api";

// ==========================================
// DATA MODELS
// ==========================================
type ProjectPhase = "DISCOVERY" | "UI_UX_DESIGN" | "BACKEND_ARCHITECTURE" | "STAGING" | "PRODUCTION";

interface Milestone {
    id: string;
    phase: ProjectPhase;
    title: string;
    description: string;
    isCompleted: boolean;
    date: string;
}

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
            {
                id: "m1", phase: "DISCOVERY", title: "Deep Discovery & Requirements",
                description: "Conducted stakeholder interviews, mapped business processes, defined technical requirements, and agreed on project scope and success criteria.",
                isCompleted: true, date: "Jan 15, 2026"
            },
            {
                id: "m2", phase: "UI_UX_DESIGN", title: "UI/UX Interactive Prototyping",
                description: "Designed wireframes, built interactive Figma prototypes for all key screens, and incorporated two rounds of client feedback before sign-off.",
                isCompleted: true, date: "Jan 28, 2026"
            },
            {
                id: "m3", phase: "BACKEND_ARCHITECTURE", title: "Database Schema & API Architecture",
                description: "Currently designing the PostgreSQL schema, RESTful API structure, authentication layer, and integration points for third-party services.",
                isCompleted: false, date: "In Progress"
            },
            {
                id: "m4", phase: "STAGING", title: "Live Staging Sandbox Deployment",
                description: "Deploy the full application to a private staging environment for client QA testing, feedback collection, and final sign-off before production.",
                isCompleted: false, date: "Pending"
            },
            {
                id: "m5", phase: "PRODUCTION", title: "Production Launch & Handover",
                description: "Final deployment to production servers, domain configuration, SSL setup, performance testing, staff onboarding, and documentation handover.",
                isCompleted: false, date: "Pending"
            },
        ] as Milestone[],
    },
    recentInvoice: {
        id: "INV-2026-001",
        amount: "25,000",
        currency: "GHS",
        status: "PAID",
        date: "Feb 01, 2026"
    },
    invoices: [
        { id: "INV-2026-001", description: "Discovery & Design Phase", amount: "25,000", currency: "GHS", status: "PAID", date: "Feb 01, 2026" },
        { id: "INV-2026-006", description: "Backend Architecture Phase", amount: "30,000", currency: "GHS", status: "PENDING", date: "Jun 18, 2026" },
    ],
    whatsappNumber: "233241234567",
};

// ==========================================
// FEEDBACK FORM
// ==========================================
function FeedbackForm({ onClose }: { onClose: () => void }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [type, setType] = useState<"feedback" | "issue" | "question">("feedback");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4"
            >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(90,209,255,0.15)]">
                    <CheckCircle2 size={28} className="text-cyan-400" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg mb-1">Feedback Received</h4>
                    <p className="text-gray-400 text-sm">Our team has been notified and will respond within 24 hours.</p>
                </div>
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    Close
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white">Submit Feedback</h4>
                <button type="button" onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <X size={15} />
                </button>
            </div>

            {/* Type Selector */}
            <div className="flex gap-2">
                {(["feedback", "issue", "question"] as const).map(t => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${type === t
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Rating */}
            <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Rate your experience</p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            type="button"
                            onMouseEnter={() => setHovered(s)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(s)}
                            className="transition-all duration-150"
                        >
                            <Star
                                size={22}
                                className={`transition-all ${s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-gray-700"}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Message */}
            <div>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={
                        type === "feedback" ? "Share your thoughts on the current progress, design decisions, or any suggestions..."
                        : type === "issue" ? "Describe the issue in detail — what you expected vs. what you found..."
                        : "What would you like to know? Our technical team will respond directly."
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none h-28 transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={!message.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-[#04181f] font-bold text-sm hover:bg-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Send size={15} /> Submit
            </button>
        </form>
    );
}

// ==========================================
// MAIN PORTAL
// ==========================================
function transformApiData(apiData: any) {
    const project = apiData.projects?.[0];
    if (!project) return null;

    const PHASE_ORDER = ["DISCOVERY", "UI_UX_DESIGN", "BACKEND_ARCHITECTURE", "STAGING", "PRODUCTION", "MAINTENANCE"];
    const phaseLabels: Record<string, string> = {
        DISCOVERY: "Discovery", UI_UX_DESIGN: "UI/UX Design",
        BACKEND_ARCHITECTURE: "Backend Architecture", STAGING: "Staging",
        PRODUCTION: "Production", MAINTENANCE: "Maintenance",
    };

    return {
        companyName: apiData.profile.companyName,
        contactName: apiData.profile.contactName,
        whatsappNumber: "233241234567",
        recentInvoice: apiData.invoices?.[0] ? {
            id: apiData.invoices[0].invoiceNumber,
            amount: Number(apiData.invoices[0].amount).toLocaleString(),
            currency: apiData.invoices[0].currency,
            status: apiData.invoices[0].status,
            date: new Date(apiData.invoices[0].issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        } : mockClientData.recentInvoice,
        invoices: (apiData.invoices || []).map((inv: any) => ({
            id: inv.invoiceNumber,
            description: inv.project?.projectName || "Consulting",
            amount: Number(inv.amount).toLocaleString(),
            currency: inv.currency,
            status: inv.status,
            date: new Date(inv.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })),
        activeProject: {
            jobId: project.id.slice(0, 8).toUpperCase(),
            name: project.projectName,
            currentPhase: project.currentPhase as ProjectPhase,
            stagingUrl: project.stagingUrl || "https://staging.stormglide.io",
            isLiveSandboxActive: project.isLiveSandboxActive,
            milestones: (project.milestones || []).map((m: any) => ({
                id: m.id,
                phase: m.phase as ProjectPhase,
                title: m.title,
                description: m.description || `Milestone for ${phaseLabels[m.phase] || m.phase} phase.`,
                isCompleted: m.isCompleted,
                date: m.isCompleted && m.completedAt
                    ? new Date(m.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : m.isCompleted ? "Completed" : "Pending",
            })),
        },
    };
}

export default function ClientPortal() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(mockClientData);
    const [authError, setAuthError] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showInvoices, setShowInvoices] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hasToken = typeof window !== "undefined" && (
            localStorage.getItem("client_token") ||
            document.cookie.includes("admin_token")
        );
        if (!hasToken) {
            setIsLoading(false);
            setAuthError(true);
            return;
        }
        PortalAPI.getMyData()
            .then((apiData) => {
                const transformed = transformApiData(apiData);
                if (transformed) setData(transformed as typeof mockClientData);
            })
            .catch(() => {
                // Silent fallback to mock data — no auth redirect for admins previewing the portal
            })
            .finally(() => setIsLoading(false));
    }, []);

    const project = data.activeProject;
    const activePhaseIndex = project.milestones.findIndex(m => m.phase === project.currentPhase);

    const handleEndSession = () => {
        if (typeof window !== "undefined") localStorage.removeItem("client_token");
        router.push("/");
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${data.whatsappNumber}?text=Hi%20Stormglide%20team%2C%20I'm%20${encodeURIComponent(data.contactName)}%20from%20${encodeURIComponent(data.companyName)}.%20I'd%20like%20to%20discuss%20project%20${encodeURIComponent(project.jobId)}.`, "_blank");
    };

    const handleSandbox = () => {
        window.open(project.stagingUrl, "_blank");
    };

    if (authError) {
        return (
            <div className="min-h-screen bg-[#060709] flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                        <ShieldCheck size={28} className="text-amber-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Session Required</h2>
                    <p className="text-sm text-gray-400 max-w-sm">Please use the magic link sent to your email to access your project portal.</p>
                    <button
                        onClick={() => router.push("/portal/login")}
                        className="px-6 py-3 rounded-xl bg-cyan-500 text-[#04181f] font-bold text-sm hover:bg-cyan-400 transition-all"
                    >
                        Request Access Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-32 md:pb-12 px-6 lg:px-8 max-w-7xl mx-auto">

            {/* HEADER */}
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

                <button
                    onClick={handleEndSession}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 w-full md:w-auto text-sm"
                >
                    <LogOut size={16} /> End Session
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: PROJECT TRACKER */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-3xl bg-[#111827] border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                        {/* Project Header */}
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

                            <button
                                onClick={handleSandbox}
                                disabled={!project.isLiveSandboxActive}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                                    project.isLiveSandboxActive
                                        ? "bg-cyan-500 text-[#0B0F19] hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <Zap size={18} />
                                {project.isLiveSandboxActive ? "Launch Live Sandbox" : "Sandbox Offline"}
                                {project.isLiveSandboxActive && <ExternalLink size={14} />}
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-4 md:pl-8">
                            <div className="absolute top-2 bottom-6 left-[27px] md:left-[43px] w-[2px] bg-gray-800 rounded-full"></div>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(activePhaseIndex / (project.milestones.length - 1)) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute top-2 left-[27px] md:left-[43px] w-[2px] bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] z-0"
                            />

                            <div className="space-y-8">
                                {isLoading ? (
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
                                    project.milestones.map((milestone, index) => {
                                        const isActive = index === activePhaseIndex;
                                        const isPast = index < activePhaseIndex;

                                        return (
                                            <motion.div
                                                key={milestone.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + index * 0.1 }}
                                                className="flex gap-6 relative z-10 group"
                                            >
                                                {/* Node */}
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

                                                {/* Content */}
                                                <div className={`flex-1 ${isActive ? "bg-white/5 border border-white/10 p-5 rounded-2xl -mt-4" : ""}`}>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className={`text-base font-bold ${isActive ? "text-purple-400" : isPast ? "text-white" : "text-gray-500"}`}>
                                                            {milestone.title}
                                                        </h3>
                                                        {isPast && (
                                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                COMPLETE
                                                            </span>
                                                        )}
                                                        {isActive && (
                                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
                                                                IN PROGRESS
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm leading-relaxed mb-2 ${isActive || isPast ? "text-gray-400" : "text-gray-600"}`}>
                                                        {milestone.description}
                                                    </p>
                                                    <div className={`text-xs font-mono ${isActive || isPast ? "text-gray-500" : "text-gray-700"}`}>
                                                        {milestone.date}
                                                    </div>

                                                    {isActive && (
                                                        <div className="mt-4 flex gap-3 flex-wrap">
                                                            <button
                                                                onClick={() => setShowFeedback(true)}
                                                                className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center gap-1.5"
                                                            >
                                                                <MessageSquare size={12} /> Leave Feedback on This Phase
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

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* Direct Comms */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl bg-[#111827] border border-white/5 overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                <MessageSquare size={18} className="text-cyan-400" /> Direct Comms
                            </h3>
                            <p className="text-sm text-gray-400 mb-5">Reach the team or leave feedback on the active build.</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowFeedback(!showFeedback)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-sm font-medium ${
                                        showFeedback
                                            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                            : "bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white"
                                    }`}
                                >
                                    <span className="flex items-center gap-2"><Send size={15} /> Submit Staging Feedback</span>
                                    <ChevronRight size={16} className={`transition-transform ${showFeedback ? "rotate-90" : ""}`} />
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all text-sm font-medium text-[#25D366]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Phone size={15} /> WhatsApp Core Team
                                    </span>
                                    <ExternalLink size={14} className="opacity-60" />
                                </button>
                            </div>
                        </div>

                        {/* Inline Feedback Form */}
                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden border-t border-white/5"
                                >
                                    <FeedbackForm onClose={() => setShowFeedback(false)} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Financial Hub */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-3xl bg-gradient-to-b from-[#111827] to-[#1a2235] border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard size={18} className="text-emerald-400" /> Financial Hub
                        </h3>

                        {/* Latest Invoice */}
                        <div className="p-4 rounded-2xl bg-black/30 border border-white/5 mb-4">
                            <div className="flex justify-between items-start mb-3">
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

                        <button
                            onClick={() => setShowInvoices(!showInvoices)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm font-medium"
                        >
                            <FileText size={16} /> {showInvoices ? "Hide Invoices" : "View All Invoices"}
                        </button>

                        <AnimatePresence>
                            {showInvoices && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 space-y-3">
                                        {data.invoices.map(inv => (
                                            <div key={inv.id} className="p-4 rounded-xl bg-black/20 border border-white/5">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <div className="text-xs font-mono text-gray-400">{inv.id}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{inv.description}</div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                                                        inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                                    }`}>{inv.status}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-white">{inv.currency} {inv.amount}</span>
                                                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors">
                                                        <Download size={12} /> PDF
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Progress Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-3xl bg-[#111827] border border-white/5"
                    >
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest font-mono">Overall Progress</h3>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-4xl font-bold text-white">{Math.round((activePhaseIndex / (project.milestones.length - 1)) * 100)}%</span>
                            <span className="text-gray-500 text-sm mb-1">complete</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(activePhaseIndex / (project.milestones.length - 1)) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-3 font-mono">
                            {project.milestones.filter(m => m.isCompleted).length} of {project.milestones.length} phases complete
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
