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

    // Admin pages own their full viewport. Keeping them inside the animated
    // public shell creates a zero-height containing block for fixed layouts in Safari.
    if (isAdminRoute) return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col pb-24 md:pb-0">

            {/* ========================================= */}
            {/* DESKTOP TOP NAVIGATION                    */}
            {/* ========================================= */}
            <header
                    className={`fixed top-0 w-full z-50 transition-all duration-500 hidden md:block ${isScrolled
                        ? "bg-[#060709]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/30"
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
                                        className="relative px-1 py-2 text-sm font-medium tracking-wide transition-colors hover:text-[#5ad1ff]"
                                    >
                                        <span className={isActive ? "text-[#5ad1ff]" : "text-white/50"}>
                                            {link.name}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="desktop-active-indicator"
                                                className="absolute left-0 bottom-0 w-full h-[2px] bg-[#5ad1ff] rounded-full shadow-[0_0_10px_rgba(90,209,255,0.5)]"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Live Pulse & CTA */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ad1ff] opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5ad1ff] shadow-[0_0_8px_rgba(90,209,255,0.7)]"></span>
                                </span>
                                <span className="text-[11px] font-mono text-[#5ad1ff]/80 tracking-wider">SYSTEMS ONLINE</span>
                            </div>

                            <Link
                                href="/contact"
                                className="px-6 py-2.5 rounded-full bg-[#5ad1ff] text-[#04181f] font-semibold text-sm hover:shadow-[0_0_0_6px_rgba(90,209,255,0.16)] transition-all duration-300"
                            >
                                Start a project
                            </Link>
                        </div>
                    </div>
            </header>

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

            <Footer />

            {/* ========================================= */}
            {/* MOBILE BOTTOM NAVIGATION (PWA FEEL)       */}
            {/* ========================================= */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-2">
                    <div className="relative flex items-center justify-around w-full bg-[#0d1117]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl py-3 shadow-[0_-20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(90,209,255,0.04)]">
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
                                    <div className={`relative z-10 transition-colors duration-300 ${isActive ? "text-[#5ad1ff]" : "text-white/30"}`}>
                                        <Icon strokeWidth={isActive ? 2.5 : 1.8} size={22} />
                                    </div>

                                    {/* Text indicator for mobile */}
                                    <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${isActive ? "text-[#5ad1ff] opacity-100" : "text-white/30 opacity-0 h-0"}`}>
                                        {link.name.split(" ")[0]}
                                    </span>

                                    {/* Animated Glowing Background Pill for Active State */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-active-indicator"
                                            className="absolute inset-0 bg-[#5ad1ff]/10 rounded-xl border border-[#5ad1ff]/20"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
            </nav>
        </div>
    );
}
