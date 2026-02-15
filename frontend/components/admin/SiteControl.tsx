"use client";

import React, { useState } from "react";
import { Settings2, Palette, Type, Save, RotateCcw, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function SiteControl() {
    const [settings, setSettings] = useState({
        brandHeadline: "We Don't Just Write Code",
        brandSubtext: "We architect high-performance software systems...",
        primaryColor: "#22D3EE",
        secondaryColor: "#A855F7",
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call to update SiteSettings in Prisma
        setTimeout(() => {
            setIsSaving(false);
            alert("Site configuration deployed successfully!");
        }, 1000);
    };

    return (
        <div className="p-8 rounded-3xl bg-[#111827] border border-white/5 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Settings2 className="text-cyan-400" size={24} />
                        Global Site Control
                    </h3>
                    <p className="text-gray-400 text-sm">Modify branding, typography, and visual tokens in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all font-medium">
                        <Eye size={16} /> Preview Site
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 text-[#0B0F19] text-sm font-bold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
                    >
                        <Save size={16} /> {isSaving ? "Deploying..." : "Deploy Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Text Content */}
                <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Type size={14} /> Typography & Content
                    </h4>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Hero Headline</label>
                            <input
                                type="text"
                                value={settings.brandHeadline}
                                onChange={(e) => setSettings({ ...settings, brandHeadline: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Hero Subtext</label>
                            <textarea
                                rows={3}
                                value={settings.brandSubtext}
                                onChange={(e) => setSettings({ ...settings, brandSubtext: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Branding & Colors */}
                <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Palette size={14} /> Brand Identity
                    </h4>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Primary Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-mono uppercase"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Secondary Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={settings.secondaryColor}
                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                    className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.secondaryColor}
                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-mono uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview of Palette */}
                    <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                        <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">Token Preview</div>
                        <div className="flex gap-4">
                            <div className="flex-1 h-20 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]" style={{ backgroundColor: settings.primaryColor }}></div>
                            <div className="flex-1 h-20 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]" style={{ backgroundColor: settings.secondaryColor }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
