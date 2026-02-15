"use client";

import React, { useState, useEffect } from "react";
import {
    Settings2,
    Palette,
    Type,
    Share2,
    Save,
    Image as ImageIcon,
    Globe,
    Mail,
    Phone,
    Twitter,
    Linkedin,
    Github,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSiteSettings } from "@/context/SiteSettingsProvider";

export default function AdminSettingsPage() {
    const { settings: initialSettings, refreshSettings } = useSiteSettings();
    const [activeTab, setActiveTab] = useState("general");
    const [settings, setSettings] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        setStatus(null);
        try {
            // Basic Auth: admin@stormglide.com : unlockme
            const authHeader = 'Basic ' + btoa('admin@stormglide.com:unlockme');

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/settings`,
                settings,
                { headers: { 'Authorization': authHeader } }
            );

            await refreshSettings();
            setStatus({ type: 'success', msg: 'Global Site Settings updated and deployed.' });
        } catch (error) {
            console.error('Save failed:', error);
            setStatus({ type: 'error', msg: 'Commander, the deployment failed. Check backend logs.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (!settings) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-mono text-xs uppercase tracking-widest">Synchronizing Settings...</p>
        </div>
    );

    const tabs = [
        { id: "general", label: "General", icon: Settings2 },
        { id: "theme", label: "Theme & Colors", icon: Palette },
        { id: "content", label: "Hero & Content", icon: Type },
        { id: "socials", label: "Socials", icon: Share2 },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Global Site Control</h1>
                    <p className="text-gray-400">Manage Stormglide.io branding and public identity from the command center.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-cyan-500 text-[#0B0F19] font-bold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? "Deploying..." : "Save Changes"}
                </motion.button>
            </div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                >
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{status.msg}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 group ${activeTab === tab.id
                                    ? "bg-white/5 text-cyan-400 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <tab.icon size={20} className={activeTab === tab.id ? "scale-110" : "group-hover:scale-110"} />
                            <span className="font-bold text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-8"
                        >
                            {activeTab === "general" && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <Globe className="text-cyan-400" size={20} />
                                            General Identity
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Company Name</label>
                                                <input
                                                    type="text"
                                                    value={settings.companyName}
                                                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Admin Email</label>
                                                <input
                                                    type="email"
                                                    value={settings.contactEmail || ""}
                                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                    placeholder="admin@stormglide.io"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <ImageIcon className="text-purple-400" size={20} />
                                            Visual Assets
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Logo URL</label>
                                                <input
                                                    type="text"
                                                    value={settings.logoUrl || ""}
                                                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                    placeholder="https://stormglide.io/logo.png"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Favicon URL</label>
                                                <input
                                                    type="text"
                                                    value={settings.faviconUrl || ""}
                                                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                    placeholder="https://stormglide.io/favicon.ico"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "theme" && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <Palette className="text-cyan-400" size={20} />
                                            Color System Control
                                        </h3>
                                        <p className="text-sm text-gray-400 italic">Adjusting these values will instantly transform the public frontend tokens.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Primary Color */}
                                            <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Primary Accent</label>
                                                    <div className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">CSS TOKEN: --primary</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="color"
                                                        value={settings.primaryColor}
                                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                        className="w-16 h-16 rounded-xl bg-transparent border-none cursor-pointer outline-none transition-transform hover:scale-105"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.primaryColor}
                                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white font-mono uppercase text-lg focus:outline-none focus:border-cyan-500/50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Secondary Color */}
                                            <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secondary Accent</label>
                                                    <div className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20">CSS TOKEN: --secondary</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="color"
                                                        value={settings.secondaryColor}
                                                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                        className="w-16 h-16 rounded-xl bg-transparent border-none cursor-pointer outline-none transition-transform hover:scale-105"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.secondaryColor}
                                                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white font-mono uppercase text-lg focus:outline-none focus:border-purple-500/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4 mt-6">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deep Background Control</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="color"
                                                    value={settings.backgroundColor}
                                                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                    className="w-16 h-16 rounded-xl bg-transparent border-none cursor-pointer outline-none transition-transform hover:scale-105"
                                                />
                                                <input
                                                    type="text"
                                                    value={settings.backgroundColor}
                                                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white font-mono uppercase text-lg focus:outline-none focus:border-gray-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "content" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Type className="text-cyan-400" size={20} />
                                        Hero Section Messaging
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Primary Headline</label>
                                            <input
                                                type="text"
                                                value={settings.heroHeadline}
                                                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold text-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Hero Subtext</label>
                                            <textarea
                                                rows={5}
                                                value={settings.heroSubtext}
                                                onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium leading-relaxed resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "socials" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Share2 className="text-cyan-400" size={20} />
                                        Social Ecosystem
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        {[
                                            { id: "twitterUrl", label: "X / Twitter", icon: Twitter, color: "text-blue-400" },
                                            { id: "linkedinUrl", label: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
                                            { id: "githubUrl", label: "GitHub", icon: Github, color: "text-gray-300" },
                                        ].map((platform) => (
                                            <div key={platform.id} className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                                    <platform.icon size={14} className={platform.color} />
                                                    {platform.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings[platform.id] || ""}
                                                    onChange={(e) => setSettings({ ...settings, [platform.id]: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium font-mono text-sm"
                                                    placeholder={`https://${platform.label.toLowerCase()}.com/stormglide`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
