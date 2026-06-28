"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthAPI } from "@/lib/api";

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
            const { accessToken } = await AuthAPI.adminLogin(password);
            if (!auth) throw new Error('Firebase not initialized — check environment variables.');
            await signInWithCustomToken(auth, accessToken);
            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Invalid Commander Authorization Key.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            if (!auth) throw new Error('Firebase not initialized — check environment variables.');
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // Verify user is authorized (you may want to check against an allowlist)
            if (result.user.email === 'johnsedofiadakey@gmail.com' || result.user.email?.endsWith('@stormglide.io')) {
                router.push("/admin/dashboard");
            } else {
                setError("Your Google account is not authorized for admin access.");
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err?.message || "Google sign-in failed. Make sure your account is authorized.");
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
                    <p className="text-gray-400">Restricted Access · Staff Only</p>
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 group"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {isLoading ? "Signing in..." : "Sign in with Google"}
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                        <span className="text-xs text-gray-500 font-mono uppercase">or</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-white/10 to-transparent" />
                    </div>

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
                                <div className="w-6 h-6 border-2 border-[#0B0F19]/20 border-t-[#0B0F19] rounded-full animate-spin" />
                            ) : (
                                <>Log In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
                    Stormglide Admin Panel v3.0.0
                </p>
            </motion.div>
        </div>
    );
}
