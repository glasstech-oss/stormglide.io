"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Globe, ArrowRight, ShieldCheck } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const [formData, setFormData] = useState({
        name: "",
        organization: "",
        email: "",
        missionScope: "Business Software",
        details: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/crm/lead`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to send message.");

            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("idle");
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Information Side */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-5xl font-bold mb-6 tracking-tight">Start Your Project</h1>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Ready to grow your business? Send us a message below. Our team will look at your details and get back to you within 24 hours.
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Email Us", val: "hello@stormglide.io" },
                                { icon: MapPin, label: "Our Location", val: "Distributed Team" },
                                { icon: Globe, label: "Work Status", val: "Vailable for new projects" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-all">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-lg font-medium text-white">{item.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex gap-4 items-center">
                            <ShieldCheck className="text-cyan-400" size={24} />
                            <p className="text-sm text-gray-400">
                                Your information is kept safe and secure.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-3xl bg-[#111827] border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>

                        {status === "success" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold">Message Received</h3>
                                <p className="text-gray-400">Thank you! We have received your project details.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Name</label>
                                        <input
                                            value={formData.organization}
                                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">I Want To Build</label>
                                    <select
                                        value={formData.missionScope}
                                        onChange={(e) => setFormData({ ...formData, missionScope: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all text-gray-400"
                                    >
                                        <option>Business Software</option>
                                        <option>Custom Website</option>
                                        <option>Smart Tools</option>
                                        <option>System Help</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Details</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    disabled={status === "loading"}
                                    className="w-full py-4 rounded-xl bg-cyan-500 text-[#0B0F19] font-bold text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === "loading" ? "Sending..." : "Send Message"} <ArrowRight size={20} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
