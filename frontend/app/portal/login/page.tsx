"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AuthAPI } from "@/lib/api";

export default function PortalLoginPage() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }
        setState("loading");
        setErrorMsg("");
        try {
            // Persisted so /auth/verify can complete signInWithEmailLink in same browser
            localStorage.setItem("emailForSignIn", email);
            await AuthAPI.requestMagicLink(email);
            setState("sent");
        } catch (err: any) {
            setState("error");
            setErrorMsg(err?.response?.data?.message || "Failed to send magic link. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#060709] flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="w-10 h-10 rounded-xl bg-[#020617] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Zap size={22} className="text-cyan-400" />
                    </div>
                    <div>
                        <div className="text-xs font-mono font-bold text-cyan-500 tracking-[0.2em]">STORMGLIDE</div>
                        <div className="text-[10px] font-mono text-gray-600 tracking-widest">CLIENT PORTAL</div>
                    </div>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <h1 className="text-2xl font-bold text-white mb-2">Access Your Portal</h1>
                        <p className="text-sm text-gray-400">Enter your email to receive a secure, one-time login link. No password needed.</p>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {state !== "sent" ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@company.com"
                                            autoFocus
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all text-sm"
                                        />
                                    </div>

                                    {(state === "error" || errorMsg) && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-red-400 px-1"
                                        >
                                            {errorMsg}
                                        </motion.p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={state === "loading"}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500 text-[#04181f] font-bold text-sm hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-60 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                                    >
                                        {state === "loading" ? (
                                            <><Loader2 size={16} className="animate-spin" /> Sending…</>
                                        ) : (
                                            <>Send Magic Link <ArrowRight size={16} /></>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-600 pt-2">
                                        Didn't receive an email? Check your spam folder or contact your account manager.
                                    </p>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-4 py-4"
                                >
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 size={32} className="text-emerald-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Check your inbox</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        We sent a secure link to <span className="text-cyan-400 font-medium">{email}</span>.
                                        Click it to instantly access your project portal. The link expires in 15 minutes.
                                    </p>
                                    <button
                                        onClick={() => { setState("idle"); setEmail(""); }}
                                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        Use a different email
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-700 mt-6 font-mono">
                    STORMGLIDE.IO · SECURE MAGIC LINK AUTH
                </p>
            </motion.div>
        </div>
    );
}
