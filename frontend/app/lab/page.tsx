"use client";

import React from "react";
import { motion } from "framer-motion";
import { Beaker, Binary, Cpu, Magnet, Zap } from "lucide-react";

export default function LabPage() {
    const experiments = [
        {
            title: "Smart Supply",
            status: "Testing",
            desc: "A tool that predicts when you need to order more stock for your business.",
            load: "Low",
            tags: ["AI", "Inventory"]
        },
        {
            title: "Quick Dashboard",
            status: "Live",
            desc: "A fast and simple way to see all your business information in one view.",
            load: "Active",
            tags: ["Web", "Easy"]
        },
        {
            title: "Safe System",
            status: "Staging",
            desc: "New tools to keep your data even safer from online threats.",
            load: "New",
            tags: ["Security", "Software"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-4 text-cyan-400 mb-6 font-mono tracking-widest text-sm">
                        <Beaker size={20} />
                        EXPERIMENTAL PROJECTS
                    </div>
                    <h1 className="text-5xl font-bold mb-6 italic tracking-tighter">EXPERIMENTS</h1>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        This is where we test new ideas and build next-generation tools to help your business work better and faster.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {experiments.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-[#111827] border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold font-mono tracking-tight">{exp.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${exp.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                    {exp.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed italic">
                                "{exp.desc}"
                            </p>
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Status</div>
                                    <div className="text-lg font-mono text-cyan-400">{exp.load}</div>
                                </div>
                                <div className="flex gap-2 text-[10px] font-mono text-gray-600">
                                    {exp.tags.map(t => <span key={t}>#{t}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
