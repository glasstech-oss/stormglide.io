"use client";

import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative font-sans">

            {/* --- VISUAL OVERLAYS (Mission Control Aesthetic) --- */}

            {/* 1. Base Grid Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* 2. Radial Vignette for Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>

            {/* 3. Scanning Line Animation */}
            <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden opacity-[0.03]">
                <motion.div
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-full h-1/2 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
                />
            </div>

            {/* 4. Subtle CRT Noise / Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* --- CONTENT LAYOUT --- */}

            {/* Sidebar */}
            <div className="relative z-20 border-r border-white/5 shadow-2xl">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <Header />
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
                    {/* Scanline Overlay (Static texture) */}
                    <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="admin-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>

                    {/* Background Glows for specific sections */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                </main>
            </div>
        </div>
    );
}
