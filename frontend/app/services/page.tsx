"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Layers,
    Cpu,
    Globe,
    Zap,
    Shield,
    Database,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
    const services = [
        {
            title: "Business Software",
            desc: "Custom-built systems that help you manage your business, finances, and team in one place.",
            icon: Layers,
            features: ["Stock Tracking", "Account Management", "Team Tools"],
            color: "cyan"
        },
        {
            title: "Custom Websites",
            desc: "Fast and reliable websites made for your business. We build sites that are easy to use and look great on any device.",
            icon: Globe,
            features: ["Modern Design", "Fast Loading", "Mobile Friendly"],
            color: "purple"
        },
        {
            title: "Smart Automation",
            desc: "Using smart logic to handle your repetitive tasks so you can focus on more important work.",
            icon: Cpu,
            features: ["Task Automation", "Data Analysis", "Easy Workflows"],
            color: "pink"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Our Services
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We build high-quality software and websites that help your business succeed.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-[#111827] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 relative group overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${service.color}-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${service.color}-500/10 transition-colors`}></div>
                            <div className={`w-14 h-14 rounded-2xl bg-${service.color}-500/10 flex items-center justify-center mb-8 text-${service.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                <service.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                {service.desc}
                            </p>
                            <ul className="space-y-4 mb-8">
                                {service.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3 text-xs font-medium text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-12 rounded-[40px] bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/5 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to discuss your project?</h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
                        Our team is ready to talk about your software needs. Let's build something great together.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-[#0B0F19] font-bold text-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all relative z-10"
                    >
                        Talk to Us <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
