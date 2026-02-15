"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessKey: password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Authorization failed.');
            }

            const { accessToken } = await response.json();

            // Store the real JWT token
            document.cookie = `admin_token=${accessToken}; path=/; max-age=86400; SameSite=Strict`;

            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid Commander Authorization Key.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        <Lock size={40} className="text-[#0B0F19]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">Admin Login</h1>
                    <p className="text-gray-400">Restricted Access • Staff Only</p>
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••••••"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono tracking-widest"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-white text-[#0B0F19] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-[#0B0F19]/20 border-t-[#0B0F19] rounded-full animate-spin" />
                            ) : (
                                <>
                                    Log In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
                    Stormglide Admin Panel v2.6.4
                </p>
            </motion.div>
        </div>
    );
}
