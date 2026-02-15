"use client";

import React from "react";
import { motion } from "framer-motion";
import InteractiveShowcase from "@/components/InteractiveShowcase";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-32 md:pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        We Don't Just Write Code
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
                        We architect high-performance software systems, custom web apps, and enterprise ERPs that transform businesses.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 rounded-xl bg-cyan-500 text-[#0B0F19] font-bold text-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                            Start Your Project
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                            View Our Arsenal
                        </button>
                    </div>
                </motion.div>

                {/* Placeholder for React Flow Node Graph */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="w-full h-96 rounded-3xl bg-gradient-to-br from-[#111827] to-[#1a2235] border border-white/5 flex items-center justify-center mb-20"
                >
                    <div className="text-center">
                        <div className="text-6xl mb-4">🚀</div>
                        <p className="text-gray-400 text-lg">Interactive Node Graph Coming Soon</p>
                        <p className="text-gray-500 text-sm mt-2">React Flow • Real-time Architecture Visualization</p>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Enterprise ERPs", desc: "Full-stack production management systems", icon: "⚡" },
                        { title: "Custom Web Apps", desc: "Tailored solutions for your business", icon: "🎯" },
                        { title: "AI Integration", desc: "Intelligent automation & insights", icon: "🤖" },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Interactive Showcase (ROI + CMS Sandbox) */}
                <InteractiveShowcase />

            </div>
        </div>
    );
}
