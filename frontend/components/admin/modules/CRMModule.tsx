"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Plus, Search, X, ChevronRight, Building2, Mail,
    Phone, Globe, MapPin, Briefcase, Calendar, DollarSign,
    CheckSquare, FileText, ArrowRight, ArrowLeft, Check,
    ExternalLink, MoreVertical
} from "lucide-react";
import { CrmAPI } from "@/lib/api";

type Phase = "DISCOVERY" | "UI_UX_DESIGN" | "BACKEND_ARCHITECTURE" | "STAGING" | "PRODUCTION" | "COMPLETED";

interface Client {
    id: string;
    company: string;
    contact: string;
    email: string;
    phone: string;
    project: string;
    phase: Phase;
    startDate: string;
    budget: string;
    country: string;
}

const PHASE_CONFIG: Record<Phase, { label: string; color: string; bg: string }> = {
    DISCOVERY: { label: "Discovery", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    UI_UX_DESIGN: { label: "UI/UX Design", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    BACKEND_ARCHITECTURE: { label: "Backend Arch.", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    STAGING: { label: "Staging", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    PRODUCTION: { label: "Production", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    COMPLETED: { label: "Completed", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
};

const INITIAL_CLIENTS: Client[] = [
    { id: "c1", company: "Apex Logistics Ltd.", contact: "David Mensah", email: "david@apexlogistics.gh", phone: "+233 24 123 4567", project: "Apex Enterprise Core Architecture", phase: "BACKEND_ARCHITECTURE", startDate: "Jan 10, 2026", budget: "GHS 120,000", country: "Ghana" },
    { id: "c2", company: "Nexus-MFG", contact: "James Owusu", email: "james@nexusmfg.com", phone: "+233 50 987 6543", project: "Nexus Manufacturing Portal", phase: "STAGING", startDate: "Feb 20, 2026", budget: "GHS 85,000", country: "Ghana" },
    { id: "c3", company: "Coastal Pharma", contact: "Abena Asante", email: "abena@coastalpharma.gh", phone: "+233 27 555 0192", project: "Coastal Distribution System", phase: "DISCOVERY", startDate: "Jun 01, 2026", budget: "GHS 65,000", country: "Ghana" },
    { id: "c4", company: "BioLink Technologies", contact: "Kwame Osei", email: "kwame@biolink.io", phone: "+233 20 444 8812", project: "BioLink Patient Connect", phase: "COMPLETED", startDate: "Oct 05, 2025", budget: "GHS 140,000", country: "Ghana" },
    { id: "c5", company: "StarTech Holdings", contact: "Ama Darko", email: "ama@startechgh.com", phone: "+233 54 321 7890", project: "StarTech Operations Suite", phase: "UI_UX_DESIGN", startDate: "Jun 20, 2026", budget: "GHS 55,000", country: "Ghana" },
];

// ─── Onboarding Form ───────────────────────────────────────────────
interface FormData {
    // Step 1 — Client Info
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    country: string;
    website: string;
    // Step 2 — Project Scope
    projectName: string;
    projectType: string;
    description: string;
    goals: string;
    technicalRequirements: string;
    services: string[];
    // Step 3 — Timeline & Engagement
    startDate: string;
    deadline: string;
    budgetRange: string;
    hearAboutUs: string;
    additionalNotes: string;
}

const BLANK_FORM: FormData = {
    companyName: "", contactName: "", email: "", phone: "", country: "", website: "",
    projectName: "", projectType: "", description: "", goals: "", technicalRequirements: "",
    services: [],
    startDate: "", deadline: "", budgetRange: "", hearAboutUs: "", additionalNotes: "",
};

const SERVICES_LIST = [
    "Web Application", "Mobile App (iOS/Android)", "ERP / Business System",
    "E-commerce Platform", "REST API / Backend", "UI/UX Design",
    "Database Architecture", "Cloud & DevOps", "AI Integration", "Ongoing Support & SLA",
];

const PROJECT_TYPES = [
    "Enterprise Web Application", "Mobile Application", "ERP System",
    "E-commerce Platform", "Custom Software", "Data Dashboard", "Other",
];

const BUDGET_RANGES = [
    "Under GHS 10,000", "GHS 10,000 – 30,000", "GHS 30,000 – 70,000",
    "GHS 70,000 – 150,000", "GHS 150,000+", "To be discussed",
];

const HEAR_ABOUT = [
    "Google Search", "LinkedIn", "Referral", "Social Media", "Word of Mouth", "Other",
];

function StepIndicator({ step, current }: { step: number; current: number }) {
    return (
        <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        s < current ? "bg-cyan-500 text-[#04181f]" :
                        s === current ? "bg-white/10 border-2 border-cyan-400 text-cyan-400" :
                        "bg-white/5 border border-white/10 text-gray-600"
                    }`}>
                        {s < current ? <Check size={14} /> : s}
                    </div>
                    {s < 3 && <div className={`h-[1px] w-12 transition-all duration-300 ${s < current ? "bg-cyan-500" : "bg-white/10"}`} />}
                </React.Fragment>
            ))}
        </div>
    );
}

const STEP_LABELS = ["Client Information", "Project Scope", "Timeline & Engagement"];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase flex items-center gap-1">
                {label}
                {required && <span className="text-cyan-400 text-base leading-none">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all";
const textareaCls = `${inputCls} resize-none min-h-[100px]`;

function OnboardingForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: FormData) => void }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(BLANK_FORM);
    const [submitted, setSubmitted] = useState(false);

    const set = (key: keyof FormData, val: string | string[]) => setForm(prev => ({ ...prev, [key]: val }));
    const toggleService = (s: string) => {
        set("services", form.services.includes(s)
            ? form.services.filter(x => x !== s)
            : [...form.services, s]);
    };

    const handleFinalSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            onSubmit(form);
        }, 1800);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-12 gap-6"
            >
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(90,209,255,0.2)]">
                    <Check size={36} className="text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Client Onboarded</h3>
                    <p className="text-gray-400">Profile for <span className="text-white font-semibold">{form.companyName}</span> has been created and logged.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Form Header */}
            <div className="p-8 border-b border-white/5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">New Client Onboarding</h2>
                    <p className="text-sm text-gray-500">{STEP_LABELS[step - 1]}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <X size={18} />
                </button>
            </div>

            {/* Step Indicator */}
            <div className="px-8 pt-6 pb-4">
                <StepIndicator step={step} current={step} />
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Company Name" required>
                                    <input value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Apex Logistics Ltd." className={inputCls} />
                                </Field>
                                <Field label="Primary Contact Name" required>
                                    <input value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="e.g. David Mensah" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Email Address" required>
                                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="david@company.com" className={inputCls} />
                                </Field>
                                <Field label="Phone Number" required>
                                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+233 24 000 0000" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Country">
                                    <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="e.g. Ghana" className={inputCls} />
                                </Field>
                                <Field label="Company Website">
                                    <input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://company.com" className={inputCls} />
                                </Field>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Project Name" required>
                                    <input value={form.projectName} onChange={e => set("projectName", e.target.value)} placeholder="e.g. Apex Enterprise Core" className={inputCls} />
                                </Field>
                                <Field label="Project Type" required>
                                    <select value={form.projectType} onChange={e => set("projectType", e.target.value)} className={inputCls}>
                                        <option value="" disabled>Select a type...</option>
                                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <Field label="Project Description" required>
                                <textarea
                                    value={form.description}
                                    onChange={e => set("description", e.target.value)}
                                    placeholder="Describe what the project is about — what problem it solves, who will use it, and what the core features should be..."
                                    className={textareaCls}
                                    style={{ minHeight: 120 }}
                                />
                            </Field>
                            <Field label="Goals & Success Criteria" required>
                                <textarea
                                    value={form.goals}
                                    onChange={e => set("goals", e.target.value)}
                                    placeholder="What does a successful project look like? Include KPIs, user adoption targets, performance benchmarks, or business outcomes..."
                                    className={textareaCls}
                                />
                            </Field>
                            <Field label="Technical Requirements & Preferences">
                                <textarea
                                    value={form.technicalRequirements}
                                    onChange={e => set("technicalRequirements", e.target.value)}
                                    placeholder="Any preferred tech stack, required integrations (Paystack, Salesforce, ERP systems), infrastructure constraints, security/compliance needs..."
                                    className={textareaCls}
                                />
                            </Field>
                            <Field label="Services Required">
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    {SERVICES_LIST.map(s => {
                                        const selected = form.services.includes(s);
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => toggleService(s)}
                                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm text-left transition-all duration-200 ${
                                                    selected
                                                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${selected ? "bg-cyan-500 border-cyan-500" : "border-white/20"}`}>
                                                    {selected && <Check size={10} className="text-[#04181f]" />}
                                                </div>
                                                <span className="text-xs">{s}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Preferred Start Date">
                                    <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} className={inputCls} />
                                </Field>
                                <Field label="Target Completion Date">
                                    <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Estimated Budget Range" required>
                                <div className="grid grid-cols-2 gap-2">
                                    {BUDGET_RANGES.map(b => {
                                        const selected = form.budgetRange === b;
                                        return (
                                            <button
                                                key={b}
                                                type="button"
                                                onClick={() => set("budgetRange", b)}
                                                className={`px-4 py-3 rounded-xl border text-sm transition-all duration-200 text-left ${
                                                    selected
                                                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                                                }`}
                                            >
                                                {b}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                            <Field label="How Did You Hear About Stormglide?">
                                <select value={form.hearAboutUs} onChange={e => set("hearAboutUs", e.target.value)} className={inputCls}>
                                    <option value="">Select...</option>
                                    {HEAR_ABOUT.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </Field>
                            <Field label="Additional Notes">
                                <textarea
                                    value={form.additionalNotes}
                                    onChange={e => set("additionalNotes", e.target.value)}
                                    placeholder="Anything else we should know — past vendors, internal deadlines, stakeholders involved, or any red flags to be aware of..."
                                    className={textareaCls}
                                    style={{ minHeight: 120 }}
                                />
                            </Field>

                            {/* Summary */}
                            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                                <p className="text-xs font-mono text-cyan-400/70 mb-3 tracking-widest uppercase">Submission Summary</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">Client:</span><span className="text-white font-medium">{form.companyName || "—"}</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">Contact:</span><span className="text-white font-medium">{form.contactName || "—"}</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">Project:</span><span className="text-white font-medium">{form.projectName || "—"}</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">Budget:</span><span className="text-white font-medium">{form.budgetRange || "—"}</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">Services:</span><span className="text-white font-medium">{form.services.length > 0 ? form.services.join(", ") : "—"}</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="p-8 border-t border-white/5 flex items-center justify-between">
                <button
                    onClick={() => step > 1 && setStep(s => s - 1)}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <div className="text-xs font-mono text-gray-600">Step {step} of 3</div>
                {step < 3 ? (
                    <button
                        onClick={() => setStep(s => s + 1)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]"
                    >
                        Continue <ArrowRight size={15} />
                    </button>
                ) : (
                    <button
                        onClick={handleFinalSubmit}
                        disabled={!form.companyName || !form.contactName || !form.projectName || !form.budgetRange}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-[#04181f] text-sm font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Check size={15} /> Submit & Create Profile
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── CRM Main ─────────────────────────────────────────────────────
export default function CRMModule() {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [search, setSearch] = useState("");
    const [phaseFilter, setPhaseFilter] = useState<Phase | "ALL">("ALL");
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [selected, setSelected] = useState<Client | null>(null);
    const [portalSending, setPortalSending] = useState(false);
    const [portalSent, setPortalSent] = useState(false);

    useEffect(() => {
        CrmAPI.getClients().then((apiClients: any[]) => {
            if (!apiClients || apiClients.length === 0) return;
            const mapped: Client[] = apiClients.map((c: any) => ({
                id: c.id,
                company: c.companyName,
                contact: c.contactName,
                email: c.user?.email || "",
                phone: c.whatsappNumber || "",
                project: c.projects?.[0]?.projectName || "No project yet",
                phase: (c.projects?.[0]?.currentPhase || "DISCOVERY") as Phase,
                startDate: c.projects?.[0]?.startDate
                    ? new Date(c.projects[0].startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "TBD",
                budget: "—",
                country: c.region || "Ghana",
            }));
            setClients(mapped);
        }).catch(() => {}); // silent fallback to mock data
    }, []);

    const filtered = clients.filter(c => {
        const matchPhase = phaseFilter === "ALL" || c.phase === phaseFilter;
        const matchSearch = search === "" || c.company.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase());
        return matchPhase && matchSearch;
    });

    const handleNewClient = (data: FormData) => {
        const newClient: Client = {
            id: `c${clients.length + 1}`,
            company: data.companyName,
            contact: data.contactName,
            email: data.email,
            phone: data.phone,
            project: data.projectName,
            phase: "DISCOVERY",
            startDate: data.startDate || "TBD",
            budget: data.budgetRange,
            country: data.country,
        };
        setClients(prev => [newClient, ...prev]);
        setShowOnboarding(false);
    };

    return (
        <div className="relative space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search clients..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-52"
                        />
                    </div>
                    <select
                        value={phaseFilter}
                        onChange={e => setPhaseFilter(e.target.value as Phase | "ALL")}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
                    >
                        <option value="ALL">All Phases</option>
                        {Object.entries(PHASE_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowOnboarding(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]"
                >
                    <Plus size={16} /> Onboard New Client
                </button>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((client, i) => {
                    const pCfg = PHASE_CONFIG[client.phase];
                    return (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => setSelected(client)}
                            className="p-6 rounded-3xl bg-[#111827] border border-white/5 hover:border-white/10 cursor-pointer group transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                                        {client.company.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">{client.company}</div>
                                        <div className="text-xs text-gray-500">{client.contact}</div>
                                    </div>
                                </div>
                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg border text-xs font-bold ${pCfg.bg} ${pCfg.color}`}>
                                    {pCfg.label}
                                </span>
                            </div>

                            <div className="text-sm text-gray-400 mb-4 line-clamp-1">{client.project}</div>

                            <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1"><Mail size={11} /> {client.email}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    {client.budget}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-gray-600 font-mono text-sm">No clients match your filters.</div>
                )}
            </div>

            {/* Client Detail Slide-over */}
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
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d1117] border-l border-white/5 z-50 overflow-y-auto"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-xl">
                                            {selected.company.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{selected.company}</h3>
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-bold mt-1 ${PHASE_CONFIG[selected.phase].bg} ${PHASE_CONFIG[selected.phase].color}`}>
                                                {PHASE_CONFIG[selected.phase].label}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelected(null); setPortalSent(false); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: Users, label: "Contact", value: selected.contact },
                                        { icon: Mail, label: "Email", value: selected.email },
                                        { icon: Phone, label: "Phone", value: selected.phone },
                                        { icon: MapPin, label: "Country", value: selected.country },
                                        { icon: Briefcase, label: "Project", value: selected.project },
                                        { icon: Calendar, label: "Start Date", value: selected.startDate },
                                        { icon: DollarSign, label: "Budget", value: selected.budget },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                            <row.icon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-0.5">{row.label}</div>
                                                <div className="text-sm text-white font-medium">{row.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={async () => {
                                            if (!selected || portalSending) return;
                                            setPortalSending(true);
                                            setPortalSent(false);
                                            try {
                                                await CrmAPI.sendPortalAccess(selected.id);
                                                setPortalSent(true);
                                                setTimeout(() => setPortalSent(false), 4000);
                                            } catch {
                                                // silently fail if mock id
                                            } finally {
                                                setPortalSending(false);
                                            }
                                        }}
                                        disabled={portalSending}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                                            portalSent
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                                        } disabled:opacity-50 disabled:cursor-wait`}
                                    >
                                        <ExternalLink size={15} />
                                        {portalSending ? "Sending magic link..." : portalSent ? "Portal link sent!" : "Send Portal Access Link"}
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-bold hover:bg-white/10 transition-all">
                                        <Mail size={15} /> Compose Email
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Onboarding Form Slide-over */}
            <AnimatePresence>
                {showOnboarding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOnboarding(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0d1117] border-l border-white/5 z-50 flex flex-col"
                        >
                            <OnboardingForm onClose={() => setShowOnboarding(false)} onSubmit={handleNewClient} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
