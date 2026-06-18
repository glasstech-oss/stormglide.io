"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Terminal,
    Linkedin,
    Twitter,
    Github,
    Mail,
    ShieldCheck,
    ArrowUpRight
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Services",
            links: [
                { name: "Business Software", href: "/services" },
                { name: "Custom Websites", href: "/services" },
                { name: "Smart Tools", href: "/services" },
                { name: "Our Work", href: "/portfolio" },
            ]
        },
        {
            title: "Links",
            links: [
                { name: "Experiments", href: "/lab" },
                { name: "System Status", href: "/admin/dashboard" },
                { name: "Open Source", href: "https://github.com/glasstech-oss" },
                { name: "Security", href: "/security" },
            ]
        },
        {
            title: "Connect",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "Client Login", href: "/portal" },
                { name: "Support", href: "mailto:hello@stormglide.io" },
            ]
        }
    ];

    return (
        <footer className="relative bg-[#0B0F19] border-t border-white/5 pt-24 pb-12 px-6 lg:px-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                                <div className="absolute inset-0 bg-[#0B0F19] rounded-xl group-hover:bg-transparent transition-colors duration-300"></div>
                                <Terminal className="relative z-10 w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-xl font-bold tracking-wider text-white">
                                STORMGLIDE<span className="text-cyan-400">.IO</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            We build high-performance software and custom websites for your business. We help you take control of your work.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Mail, href: "mailto:engineering@stormglide.io" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="lg:col-span-1">
                            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 text-sm hover:text-cyan-400 flex items-center gap-1 group transition-colors"
                                        >
                                            {link.name}
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-mono">
                    <div className="flex items-center gap-4">
                        <span>© {currentYear} STORMGLIDE ENGINEERING.</span>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-gray-300">PRIVACY</Link>
                            <Link href="#" className="hover:text-gray-300">TERMS</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Stealth Admin Button */}
                        <Link
                            href="/admin/login"
                            title="System Access"
                            className="opacity-10 hover:opacity-100 hover:text-cyan-500 transition-all duration-700 cursor-default hover:cursor-pointer"
                        >
                            <ShieldCheck size={14} />
                        </Link>
                        <span className="text-gray-700">STATUS: ALL WORKING</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
