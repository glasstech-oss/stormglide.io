"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle, Smartphone, Key } from "lucide-react";

export default function SecurityPage() {
    const protocols = [
        {
            title: "Safe Data",
            desc: "All your information is locked and protected so that only you can see it.",
            icon: Lock
        },
        {
            title: "Secure Access",
            desc: "We double-check every login to make sure your account is safe from strangers.",
            icon: Shield
        },
        {
            title: "Smart Protection",
            desc: "Our smart system watches for any suspicious activity 24/7 to keep your site running.",
            icon: Eye
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
                    <h1 className="text-5xl font-bold mb-6">Security</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Your business safety is our top priority. We build security into everything we create.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                    {protocols.map((protocol, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-20 h-20 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                                <protocol.icon size={32} className="text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{protocol.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {protocol.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-3xl bg-[#111827] border border-white/5 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Reliable Protection</h2>
                            <p className="text-gray-400 mb-8">
                                We test our systems every day to make sure they are safe. We are committed to keeping your business data private and secure.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Daily Safety Checks",
                                    "Secure Login Tools",
                                    "Fixed Permissions",
                                    "Private Activity Logs"
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                                        <CheckCircle size={16} className="text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-full border-2 border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                                <div className="w-3/4 h-3/4 rounded-full border border-cyan-500/40 animate-[spin_10s_linear_infinite_reverse] flex items-center justify-center">
                                    <Shield size={64} className="text-cyan-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
