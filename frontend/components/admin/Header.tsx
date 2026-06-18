"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Command, UserCircle, Activity, Globe, ShieldCheck } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { AnimatePresence, motion } from "framer-motion";

export function CommandPalette() {
    const { isCommandPaletteOpen, setCommandPaletteOpen } = useAdminStore();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandPaletteOpen(!isCommandPaletteOpen);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isCommandPaletteOpen, setCommandPaletteOpen]);

    return (
        <AnimatePresence>
            {isCommandPaletteOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCommandPaletteOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -40 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-[101]"
                    >
                        <div className="flex items-center gap-4 px-8 py-6 border-b border-white/5 bg-white/5">
                            <Search className="text-cyan-500" size={24} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Execute command or search systemic entities..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-xl font-medium"
                            />
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-[0.3em]">Operational History</div>
                            <div className="space-y-3">
                                {["Global Revenue Projections", "Security Audit: Nexus-Alpha", "Entity Re-deployment"].map((item) => (
                                    <button key={item} className="w-full text-left px-6 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all text-gray-400 font-mono text-sm flex items-center justify-between group">
                                        <span>{item}</span>
                                        <Activity size={14} className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                            <div className="flex gap-4">
                                <span><kbd className="text-gray-400">↑↓</kbd> NAVIGATE</span>
                                <span><kbd className="text-gray-400">↵</kbd> SELECT</span>
                            </div>
                            <span>SYSTEM_ID: STORM_OS_V2</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function Header() {
    const { setCommandPaletteOpen } = useAdminStore();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/20 backdrop-blur-xl sticky top-0 z-20 overflow-hidden">
            {/* Ambient Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

            <div className="flex-1 max-w-xl">
                <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="w-full flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-[#020617] border border-white/5 hover:border-cyan-500/30 transition-all text-gray-500 text-sm group shadow-inner"
                >
                    <Search size={18} className="group-hover:text-cyan-400 transition-colors" />
                    <span className="font-mono text-xs tracking-wider">INITIATE_CORE_SEARCH...</span>
                    <kbd className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] text-gray-500">
                        <Command size={10} /> K
                    </kbd>
                </button>
            </div>

            <div className="flex items-center gap-8">
                {/* HUD Metrics */}
                <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mb-1">Local_Node_Time</span>
                        <span className="text-xs font-mono font-bold text-white tracking-widest">{currentTime}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase mb-1">Latency</span>
                        <span className="text-xs font-mono font-bold text-emerald-500 tracking-widest">12ms</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 group">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></span>
                    </button>

                    <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2 justify-end">
                                <ShieldCheck size={14} className="text-cyan-500" /> STARK_ADAM
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 tracking-[0.2em] flex items-center gap-2 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SEC_LVL: OMEGA
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 p-[1px]">
                            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                                <UserCircle size={28} className="text-cyan-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommandPalette />
        </header>
    );
}
