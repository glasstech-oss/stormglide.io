import React, { useState } from "react";
import { LayoutTemplate, Sliders, Palette, Type, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveShowcase() {
    // --- Zero-Code Sandbox State ---
    const [themeColor, setThemeColor] = useState("#22D3EE"); // Default Cyan
    const [headlineText, setHeadlineText] = useState("Empower Your Business.");

    return (
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pb-32 z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                    Easy <span className="text-purple-400">Control</span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm">
                    Our system is built so you can change things easily without needing any technical skills.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-white/5 border border-white/10 flex flex-col relative overflow-hidden group"
            >
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/15 transition-colors duration-700"></div>

                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <LayoutTemplate size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Try It Out</h3>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">Status: Working</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 items-center gap-2">
                        <Zap size={14} className="text-yellow-400 animate-pulse" /> LIVE PREVIEW
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

                    {/* Control Panel (Left) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-6 shadow-inner">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-4">
                                <Sliders size={14} /> TOOL OPTIONS
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-medium flex items-center gap-2 mb-1"><Type size={14} /> Title Text</label>
                                <input
                                    type="text"
                                    value={headlineText}
                                    onChange={(e) => setHeadlineText(e.target.value)}
                                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
                                    placeholder="Enter title..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs text-gray-400 font-medium flex items-center gap-2 mb-1"><Palette size={14} /> Brand Color</label>
                                <div className="flex gap-3">
                                    {["#22D3EE", "#A855F7", "#10B981", "#F43F5E"].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setThemeColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color, boxShadow: themeColor === color ? `0 0 15px ${color}80` : '' }}
                                        >
                                            {themeColor === color && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simulated Live Website (Right) */}
                    <div className="md:col-span-3 p-8 rounded-3xl bg-[#0B0F19] border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px] shadow-2xl">
                        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:20px_20px]"></div>

                        <AnimatePresence mode="wait">
                            <motion.h4
                                key={headlineText}
                                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-white mb-6 leading-tight relative z-10"
                            >
                                {headlineText || "System Ready."}
                            </motion.h4>
                        </AnimatePresence>

                        <div className="w-2/3 h-2 bg-white/5 rounded-full mb-3 relative z-10">
                            <motion.div
                                animate={{ backgroundColor: themeColor }}
                                className="h-full w-1/2 rounded-full opacity-20"
                            />
                        </div>
                        <div className="w-1/2 h-2 bg-white/5 rounded-full mb-10 relative z-10"></div>

                        <motion.button
                            animate={{
                                backgroundColor: themeColor,
                                boxShadow: `0 0 30px ${themeColor}60`,
                                color: "#0B0F19"
                            }}
                            className="px-8 py-3 rounded-xl font-bold text-base flex items-center gap-3 transition-all duration-500 relative z-10 transform hover:scale-105"
                        >
                            Launch Genesis <ArrowRight size={18} />
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
