"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Home, Bot, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";

const serviceItems = [
    {
        title: "Internet of Things (IoT)",
        description: "Seamlessly connect devices and systems for real-time monitoring and control.",
        icon: Cpu,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20"
    },
    {
        title: "Home Automation",
        description: "Intelligent living environments that adapt to your lifestyle and preferences.",
        icon: Home,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Robotics & AI Agents",
        description: "Autonomous agents and robotic systems designed for efficiency and precision.",
        icon: Bot,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "Bot Creation",
        description: "Custom-built algorithmic bots for trading, chat, and process automation.",
        icon: BrainCircuit,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20"
    }
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    Engineering <span className="text-cyan-400">The Future</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    We architect advanced technological solutions that bridge the gap between imagination and reality.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceItems.map((service, index) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`group relative p-8 rounded-3xl bg-[#111827]/50 backdrop-blur-sm border ${service.border} hover:border-opacity-50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/10`}
                    >
                        <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <service.icon className={`w-7 h-7 ${service.color}`} />
                        </div>

                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                            {service.title}
                        </h3>

                        <p className="text-slate-400 leading-relaxed mb-6">
                            {service.description}
                        </p>

                        <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-white transition-colors">
                            <span>Explore Solution</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-20 text-center"
            >
                <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-1"
                >
                    Start Your Project
                </Link>
            </motion.div>
        </div>
    );
}
