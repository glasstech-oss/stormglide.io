"use client";

import React, { useEffect } from "react";
import { Search, Bell, Command, UserCircle } from "lucide-react";
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4 z-[101]"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                            <Search className="text-gray-400" size={20} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search clients, projects, or invoices... (Cmd + K)"
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg"
                            />
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Activity</div>
                            <div className="space-y-2">
                                {["Apex Logistics Dashboard", "Nexus-HRM Invoices", "Global Site Branding"].map((item) => (
                                    <button key={item} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function Header() {
    const { setCommandPaletteOpen } = useAdminStore();

    return (
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#0B0F19]/50 backdrop-blur-xl sticky top-0 z-20">
            <div className="flex-1 max-w-xl">
                <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all text-gray-400 text-sm group"
                >
                    <Search size={18} className="group-hover:text-cyan-400 transition-colors" />
                    <span>Quick Search...</span>
                    <kbd className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-500">
                        <Command size={10} /> K
                    </kbd>
                </button>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                    <div className="text-right">
                        <div className="text-sm font-bold text-white">Stormglide Admin</div>
                        <div className="text-[10px] font-mono text-cyan-400">COMMANDER-X1</div>
                    </div>
                    <UserCircle size={32} className="text-gray-500" />
                </div>
            </div>
            <CommandPalette />
        </header>
    );
}
