"use client";

import React from "react";
import { motion } from "framer-motion";
import InteractiveShowcase from "@/components/InteractiveShowcase";
import GenesisEngine from "@/components/GenesisEngine";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-32 md:pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-32"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        We Build Software that Works
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        We build fast software, custom websites, and business systems that help your company grow.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 rounded-xl bg-cyan-500 text-[#0B0F19] font-bold text-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                            Start Your Project
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                            See Our Work
                        </button>
                    </div>
                </motion.div>

                {/* Main Visual Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-32"
                >
                    <GenesisEngine />
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                    {[
                        { title: "Business Software", desc: "Complete systems to manage your company operations easily.", icon: "⚡", color: "cyan" },
                        { title: "Custom Websites", desc: "Beautiful and fast websites made specifically for your needs.", icon: "🎯", color: "purple" },
                        { title: "Smart Automation", desc: "Simple tools that use smart logic to handle your repetitive tasks.", icon: "🤖", color: "emerald" },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-500/5 blur-3xl group-hover:bg-${feature.color}-500/10 transition-colors`}></div>
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Zero-Code Control Showcase (Modified) */}
                <div id="advantage">
                    <InteractiveShowcase />
                </div>

            </div>
        </div>
    );
}
