"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccessPage() {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const res = await fetch("/api/auth/access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (res.ok) {
                router.push("/");
            } else {
                setError(true);
                setLoading(false);
            }
        } catch (err) {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cyan-950/30 border border-cyan-500/20 mb-4 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                        <Shield size={40} className="text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Access Protocol</h1>
                    <p className="text-slate-400 text-sm">Restricted Environment. Authorization Required.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    if (error) setError(false);
                                }}
                                placeholder="Enter Access Code"
                                className={`w-full bg-slate-900/50 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500'} rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600 font-mono tracking-widest text-center`}
                                autoFocus
                            />
                        </div>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-400 text-xs justify-center font-mono"
                            >
                                <AlertCircle size={12} />
                                <span>INVALID AUTHORIZATION CREDENTIALS</span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Initialize Session</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-slate-600 font-mono tracking-[0.2em] uppercase">
                        Secured by Stormglide Architecture
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
