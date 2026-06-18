"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Palette,
    Type,
    Image as ImageIcon,
    Moon,
    Sun,
    Save,
    RefreshCw,
    CheckCircle2,
    Layout
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsProvider";
import axios from "axios";

export default function SettingsPage() {
    const { settings, refreshSettings } = useSiteSettings();
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    if (!formData) return (
        <div className="flex items-center justify-center p-20">
            <RefreshCw className="animate-spin text-cyan-500" size={32} />
        </div>
    );

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus("idle");
        try {
            const adminToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_token='))
                ?.split('=')[1];

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/settings`,
                formData,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            await refreshSettings();
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            console.error("Failed to update settings:", error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleMode = (mode: 'dark' | 'light') => {
        if (mode === 'dark') {
            setFormData({ ...formData, backgroundColor: "#0B0F19", foregroundColor: "#ffffff" });
        } else {
            setFormData({ ...formData, backgroundColor: "#ffffff", foregroundColor: "#0B0F19" });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Layout className="text-cyan-400" /> Site Orchestration
                    </h1>
                    <p className="text-gray-500 mt-2">Manage global theme, branding and core site content.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saveStatus === "success" ? "Protocol Saved" : "Apply Changes"}
                </button>
            </div>

            {/* Quick Actions: Dark/Light Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => toggleMode('dark')}
                    className="p-6 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-cyan-500/50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                            <Moon className="text-cyan-400" />
                        </div>
                        <div className="text-left">
                            <span className="block text-white font-bold text-lg">Midnight Protocol</span>
                            <span className="text-gray-500 text-sm">Deep space aesthetic (Standard)</span>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => toggleMode('light')}
                    className="p-6 rounded-2xl bg-white border border-black/5 flex items-center justify-between hover:border-cyan-500/50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Sun className="text-orange-500" />
                        </div>
                        <div className="text-left">
                            <span className="block text-black font-bold text-lg">Solar Interface</span>
                            <span className="text-gray-400 text-sm">High clarity / Light mode</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Theming System */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <Palette className="text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Visual Engine</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ColorInput
                        label="Primary Color"
                        value={formData.primaryColor}
                        onChange={(val) => setFormData({ ...formData, primaryColor: val })}
                    />
                    <ColorInput
                        label="Secondary Color"
                        value={formData.secondaryColor}
                        onChange={(val) => setFormData({ ...formData, secondaryColor: val })}
                    />
                    <ColorInput
                        label="Accent Color"
                        value={formData.accentColor || "#F472B6"}
                        onChange={(val) => setFormData({ ...formData, accentColor: val })}
                    />
                    <ColorInput
                        label="Background"
                        value={formData.backgroundColor}
                        onChange={(val) => setFormData({ ...formData, backgroundColor: val })}
                    />
                </div>
            </div>

            {/* Branding & Content */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <ImageIcon className="text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Branding Authority</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Company Name</label>
                            <input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Logo URL</label>
                            <input
                                value={formData.logoUrl || ""}
                                placeholder="https://..."
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Hero Headline</label>
                        <input
                            value={formData.heroHeadline}
                            onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">{label}</label>
                <span className="text-[10px] font-mono text-gray-400">{value}</span>
            </div>
            <div className="flex gap-4">
                <div
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-lg"
                    style={{ backgroundColor: value }}
                ></div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                />
            </div>
        </div>
    );
}
