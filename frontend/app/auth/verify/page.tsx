"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthAPI } from "@/lib/api";

type State = "loading" | "success" | "error";

function VerifyContent() {
    const router = useRouter();
    const [state, setState] = useState<State>("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const run = async () => {
            if (typeof window === "undefined") return;

            if (!auth) {
                setState("error");
                setErrorMsg("Firebase is not configured. Please contact support.");
                return;
            }

            if (!isSignInWithEmailLink(auth, window.location.href)) {
                setState("error");
                setErrorMsg("This URL is not a valid sign-in link. Please request a new magic link.");
                return;
            }

            let email = localStorage.getItem("emailForSignIn");
            if (!email) {
                // Ask user to provide email if it was lost (different browser)
                email = window.prompt("Please enter your email to complete sign-in:") || "";
            }
            if (!email) {
                setState("error");
                setErrorMsg("Email address is required to complete sign-in.");
                return;
            }

            try {
                await signInWithEmailLink(auth!, email, window.location.href);
                localStorage.removeItem("emailForSignIn");
                // Register/update user record in Firestore
                try { await AuthAPI.syncUser(); } catch { /* non-fatal */ }
                setState("success");
                setTimeout(() => router.push("/portal"), 2000);
            } catch (err: any) {
                setState("error");
                setErrorMsg(
                    err?.code === "auth/invalid-action-code"
                        ? "This link has expired or already been used. Please request a new one."
                        : err?.message || "Authentication failed. Please request a new magic link."
                );
            }
        };
        run();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#060709] flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="w-10 h-10 rounded-xl bg-[#020617] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Zap size={22} className="text-cyan-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-500 tracking-[0.2em]">STORMGLIDE</span>
                </div>

                <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-10 text-center">
                    {state === "loading" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex justify-center">
                                <Loader2 size={48} className="text-cyan-400 animate-spin" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Verifying your identity</h2>
                            <p className="text-sm text-gray-500">Authenticating your secure session…</p>
                        </motion.div>
                    )}

                    {state === "success" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white">Identity Confirmed</h2>
                            <p className="text-sm text-gray-400">Your session is active. Redirecting to your project portal…</p>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2 }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}

                    {state === "error" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <XCircle size={32} className="text-red-400" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
                            <p className="text-sm text-gray-400 leading-relaxed">{errorMsg}</p>
                            <button
                                onClick={() => router.push("/portal/login")}
                                className="mt-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium"
                            >
                                Request a New Link
                            </button>
                        </motion.div>
                    )}
                </div>

                <p className="text-center text-xs text-gray-600 mt-6 font-mono">
                    SECURE SESSION · STORMGLIDE.IO
                </p>
            </motion.div>
        </div>
    );
}

export default function AuthVerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#060709] flex items-center justify-center">
                <Loader2 size={48} className="text-cyan-400 animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
