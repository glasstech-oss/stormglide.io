"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Layers,
    Terminal,
    Briefcase,
    Activity,
    Menu,
    X,
    ChevronRight,
    ShieldAlert
} from "lucide-react";

// The core navigation map for Stormglide
const NAV_LINKS = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/services", icon: Layers },
    { name: "Portfolio", path: "/portfolio", icon: Briefcase },
    { name: "Dashboard", path: "/portal", icon: Activity },
];

import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Detect scroll for glassmorphism effect on desktop header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col pb-24 md:pb-0">

            {/* ========================================= */}
            {/* DESKTOP TOP NAVIGATION                    */}
            {/* ========================================= */}
            {!isAdminRoute && (
                <header
                    className={`fixed top-0 w-full z-50 transition-all duration-300 hidden md:block ${isScrolled
                        ? "bg-[#0B0F19]/70 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-cyan-900/10"
                        : "bg-transparent border-b border-transparent"
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

                        {/* Logo & Brand */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-[50rem] h-[16rem] translate-y-6">
                                <img
                                    src="/logo.png"
                                    alt="Stormglide Logo"
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                                />
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <nav className="flex items-center gap-8">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className="relative px-1 py-2 text-sm font-medium tracking-wide transition-colors hover:text-cyan-400"
                                    >
                                        <span className={isActive ? "text-cyan-400" : "text-gray-400"}>
                                            {link.name}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="desktop-active-indicator"
                                                className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Live Pulse & CTA */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                </span>
                                <span className="text-xs font-mono text-emerald-400 tracking-wider">ALL SYSTEMS WORKING</span>
                            </div>

                            <Link
                                href="/contact"
                                className="px-6 py-2.5 rounded-lg bg-white text-[#0B0F19] font-semibold text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Start Your Project
                            </Link>
                        </div>
                    </div>
                </header>
            )}

            {/* ========================================= */}
            {/* MAIN CONTENT AREA WITH ROUTE ANIMATIONS   */}
            {/* ========================================= */}
            <main className="pt-0 md:pt-20 flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {!isAdminRoute && <Footer />}

            {/* ========================================= */}
            {/* MOBILE BOTTOM NAVIGATION (PWA FEEL)       */}
            {/* ========================================= */}
            {!isAdminRoute && (
                <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-2">
                    <div className="relative flex items-center justify-around w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.path;
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="relative flex flex-col items-center justify-center w-16 h-12 rounded-xl"
                                    // Haptic feedback trigger for mobile browsers that support it
                                    onClick={() => {
                                        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
                                            window.navigator.vibrate(50);
                                        }
                                    }}
                                >
                                    <div className={`relative z-10 transition-colors duration-300 ${isActive ? "text-cyan-400" : "text-gray-500"}`}>
                                        <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
                                    </div>

                                    {/* Text indicator for mobile */}
                                    <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${isActive ? "text-cyan-400 opacity-100" : "text-gray-500 opacity-0 h-0"}`}>
                                        {link.name.split(" ")[0]}
                                    </span>

                                    {/* Animated Glowing Background Pill for Active State */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-active-indicator"
                                            className="absolute inset-0 bg-cyan-500/10 rounded-xl border border-cyan-500/20"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
