"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, LayoutTemplate, Sliders, Palette, Type, ArrowRight, Zap } from "lucide-react";

export default function InteractiveShowcase() {
    // --- ROI Calculator State ---
    const [manualHours, setManualHours] = useState(40);
    const hourlyRate = 25; // Estimated blended hourly rate of admin staff
    const weeksPerYear = 52;
    const automatedHours = manualHours * 0.15; // Nexus automates 85% of the work

    const annualCostManual = manualHours * hourlyRate * weeksPerYear;
    const annualCostAutomated = automatedHours * hourlyRate * weeksPerYear;
    const moneySaved = annualCostManual - annualCostAutomated;
    const hoursSaved = (manualHours - automatedHours) * weeksPerYear;

    // --- Zero-Code Sandbox State ---
    const [themeColor, setThemeColor] = useState("#22D3EE"); // Default Cyan
    const [headlineText, setHeadlineText] = useState("Empower Your Business.");

    return (
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    The <span className="text-cyan-400">Stormglide</span> Advantage
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    We don't just build software; we engineer time and total operational control.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ========================================== */}
                {/* 1. DYNAMIC ROI CALCULATOR                  */}
                {/* ========================================== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-[#111827] to-[#1f2937] border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <Calculator size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">ROI Calculator</h3>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-400 mb-4 tracking-wider">
                                <span>MANUAL ADMIN HOURS / WEEK</span>
                                <span className="text-white">{manualHours} hrs</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="200"
                                step="5"
                                value={manualHours}
                                onChange={(e) => setManualHours(Number(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                <div className="text-xs text-gray-500 font-mono mb-1 tracking-wider">ANNUAL TIME SAVED</div>
                                <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                    {hoursSaved.toLocaleString()} <span className="text-sm text-gray-400 font-normal">hrs</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <div className="text-xs text-emerald-500 font-mono mb-1 tracking-wider">CAPITAL SAVED</div>
                                <div className="text-3xl font-bold text-emerald-400 flex items-baseline gap-1">
                                    <span className="text-lg">$</span>{moneySaved.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            By replacing manual inventory, HR, and procurement spreadsheets with the <span className="text-white font-semibold">Nexus Core</span>, you reclaim massive operational capital.
                        </p>
                    </div>
                </motion.div>

                {/* ========================================== */}
                {/* 2. ZERO-CODE CMS SANDBOX                   */}
                {/* ========================================== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-3xl bg-[#111827] border border-white/5 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                                <LayoutTemplate size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Zero-Code Control</h3>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                            <Zap size={14} className="text-yellow-400" /> Live Sandbox
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6">

                        {/* Control Panel (Left) */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider mb-2">
                                    <Sliders size={14} /> ADMIN DASHBOARD
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 flex items-center gap-2 mb-2"><Type size={12} /> Headline Text</label>
                                    <input
                                        type="text"
                                        value={headlineText}
                                        onChange={(e) => setHeadlineText(e.target.value)}
                                        className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 flex items-center gap-2 mb-2"><Palette size={12} /> Brand Color</label>
                                    <div className="flex gap-2">
                                        {["#22D3EE", "#A855F7", "#10B981", "#F43F5E"].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setThemeColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simulated Live Website (Right) */}
                        <div className="md:col-span-3 p-4 rounded-2xl bg-[#0B0F19] border border-white/10 flex flex-col justify-center items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                            <motion.h4
                                key={headlineText}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-bold text-white mb-3 max-w-[200px] leading-tight"
                            >
                                {headlineText || "Enter text..."}
                            </motion.h4>

                            <div className="w-full max-w-[150px] h-2 bg-gray-800 rounded-full mb-2"></div>
                            <div className="w-full max-w-[120px] h-2 bg-gray-800 rounded-full mb-6"></div>

                            <motion.button
                                animate={{ backgroundColor: themeColor, boxShadow: `0 0 20px ${themeColor}40` }}
                                className="px-5 py-2.5 rounded-lg text-[#0B0F19] font-bold text-sm flex items-center gap-2 transition-colors duration-300"
                            >
                                Get Started <ArrowRight size={16} />
                            </motion.button>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
