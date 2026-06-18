"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Terminal, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export default function PortfolioPage() {
    const projects = [
        {
            title: "Business System Update",
            client: "Global Logistics Group",
            desc: "We improved their old shipping system, making it faster and easier for the team to use every day.",
            stats: { speed: "+42%", saving: "$12k/mo", security: "High" },
            image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1000",
            tags: ["Business", "Database", "Modern"]
        },
        {
            title: "Trading Dashboard",
            client: "Sovereign Wealth Fund",
            desc: "A clean and fast dashboard for wealth managers to see their data in real-time without any delays.",
            stats: { uptime: "99.99%", users: "2,000+", security: "Bank-Grade" },
            image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1000",
            tags: ["Finance", "Website", "Fast"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Work</h1>
                    <p className="text-xl text-gray-500 font-mono uppercase tracking-[0.2em]">Recent Projects</p>
                </motion.div>

                <div className="space-y-32">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Visual Side */}
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
                                    <div className="absolute inset-0 bg-[#0B0F19]/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Info Side */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="flex items-center gap-3 text-cyan-400 text-sm font-mono tracking-widest">
                                    <Terminal size={14} />
                                    PROJECT_RECORD_{i.toString().padStart(3, '0')}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold mb-2">{project.title}</h2>
                                    <p className="text-gray-400 text-lg leading-relaxed">{project.desc}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/5">
                                    {Object.entries(project.stats).map(([k, v]) => (
                                        <div key={k}>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k}</div>
                                            <div className="text-lg font-bold text-white tracking-tight">{v}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
