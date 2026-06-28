"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    browserSessionPersistence,
    GoogleAuthProvider,
    setPersistence,
    signInWithCustomToken,
    signInWithPopup,
    signOut,
    User,
} from "firebase/auth";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { AuthAPI } from "@/lib/api";

type LoginMethod = "google" | "key" | null;

function BrandMark({ className = "" }: { className?: string }) {
    return (
        <span className={`grid grid-cols-2 grid-rows-3 gap-1 ${className}`} aria-hidden="true">
            <span className="col-start-1 row-start-1 rounded-[2px] bg-slate-200" />
            <span className="col-start-2 row-start-1 rounded-[2px] bg-[#1688ff] shadow-[0_0_18px_rgba(22,136,255,0.55)]" />
            <span className="col-start-1 row-start-2 rounded-[2px] bg-slate-200" />
            <span className="col-start-2 row-start-2 rounded-[2px] bg-slate-200" />
            <span className="col-start-1 row-start-3 rounded-[2px] bg-slate-200" />
        </span>
    );
}

function GoogleIcon() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
            <path d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
        </svg>
    );
}

function readError(error: unknown): string {
    const candidate = error as {
        code?: string;
        message?: string;
        response?: { data?: { message?: string } };
    };

    if (candidate.code === "auth/popup-closed-by-user" || candidate.code === "auth/cancelled-popup-request") {
        return "Google sign-in was cancelled.";
    }
    if (candidate.code === "auth/unauthorized-domain") {
        return "This domain is not authorized for Google sign-in.";
    }
    return candidate.response?.data?.message || candidate.message || "Sign-in could not be completed.";
}

export default function AdminLoginPage() {
    const [accessKey, setAccessKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const establishSession = async (user: User) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch("/api/auth/admin-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ idToken }),
        });
        const result = await response.json() as { message?: string };
        if (!response.ok) throw new Error(result.message || "Unable to create a secure admin session.");

        router.replace("/admin/dashboard");
        router.refresh();
    };

    const handleGoogleSignIn = async () => {
        setLoginMethod("google");
        setError("");

        try {
            if (!auth) throw new Error("Firebase authentication is not configured.");
            await setPersistence(auth, browserSessionPersistence);

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const result = await signInWithPopup(auth, provider);

            await AuthAPI.authorizeGoogleAdmin();
            await establishSession(result.user);
        } catch (signInError) {
            if (auth?.currentUser) await signOut(auth).catch(() => undefined);
            setError(readError(signInError));
            setLoginMethod(null);
        }
    };

    const handleKeySignIn = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginMethod("key");
        setError("");

        try {
            if (!auth) throw new Error("Firebase authentication is not configured.");
            await setPersistence(auth, browserSessionPersistence);
            const { accessToken } = await AuthAPI.adminLogin(accessKey);
            const credential = await signInWithCustomToken(auth, accessToken);
            await establishSession(credential.user);
        } catch (signInError) {
            if (auth?.currentUser) await signOut(auth).catch(() => undefined);
            setError(readError(signInError));
            setLoginMethod(null);
        }
    };

    const isLoading = loginMethod !== null;

    return (
        <div className="relative min-h-screen overflow-y-auto bg-[#050a14] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(22,136,255,0.14),transparent_30%),radial-gradient(circle_at_82%_85%,rgba(34,211,238,0.07),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

            <Link
                href="/"
                className="absolute left-5 top-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white md:left-8 md:top-8"
            >
                <ArrowLeft size={17} />
                Public site
            </Link>

            <main className="relative mx-auto grid min-h-full w-full max-w-6xl items-center gap-12 px-5 py-28 lg:grid-cols-[1fr_440px] lg:px-10 lg:py-16">
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="hidden max-w-xl lg:block"
                >
                    <div className="mb-9 flex items-center gap-4">
                        <BrandMark className="h-12 w-8" />
                        <div>
                            <div className="text-2xl font-semibold tracking-tight">stormglide<span className="text-[#1688ff]">.io</span></div>
                            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Operations system</div>
                        </div>
                    </div>
                    <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-slate-100 xl:text-5xl">
                        One secure place to run delivery, clients, and infrastructure.
                    </h1>
                    <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
                        {["Identity verified", "Encrypted session", "Role protected"].map((label) => (
                            <div key={label} className="border-l border-[#1688ff]/40 pl-3 text-xs leading-5 text-slate-400">
                                <CheckCircle2 className="mb-2 text-[#45b9ff]" size={16} />
                                {label}
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.06 }}
                    className="w-full rounded-lg border border-white/10 bg-[#0a1220]/90 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
                >
                    <div className="mb-8 flex items-start justify-between gap-5">
                        <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#45b9ff]">Restricted access</p>
                            <h2 className="text-2xl font-semibold tracking-tight">Admin sign in</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-400">Use an approved Google identity or your authorization key.</p>
                        </div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#1688ff]/25 bg-[#1688ff]/10 text-[#45b9ff]">
                            <ShieldCheck size={22} />
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-white px-4 font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                        {loginMethod === "google" ? <LoaderCircle className="animate-spin" size={19} /> : <GoogleIcon />}
                        {loginMethod === "google" ? "Verifying identity..." : "Continue with Google"}
                    </button>

                    <div className="my-6 flex items-center gap-3" aria-hidden="true">
                        <span className="h-px flex-1 bg-white/10" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">or use secure key</span>
                        <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <form onSubmit={handleKeySignIn} className="space-y-4">
                        <div>
                            <label htmlFor="admin-key" className="mb-2 block text-xs font-medium text-slate-300">Authorization key</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                                <input
                                    id="admin-key"
                                    type={showKey ? "text" : "password"}
                                    value={accessKey}
                                    onChange={(event) => { setAccessKey(event.target.value); setError(""); }}
                                    autoComplete="current-password"
                                    placeholder="Enter your private key"
                                    required
                                    className="min-h-12 w-full rounded-lg border border-white/10 bg-black/25 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-[#1688ff]/70 focus:ring-2 focus:ring-[#1688ff]/15"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey((visible) => !visible)}
                                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-300"
                                    aria-label={showKey ? "Hide authorization key" : "Show authorization key"}
                                >
                                    {showKey ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                role="alert"
                                className="flex gap-2.5 rounded-lg border border-red-400/20 bg-red-400/[0.08] p-3 text-sm leading-5 text-red-200"
                            >
                                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !accessKey.trim()}
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#1688ff]/40 bg-[#1688ff] px-4 font-semibold text-white transition hover:bg-[#2996ff] hover:shadow-[0_0_0_4px_rgba(22,136,255,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {loginMethod === "key" ? <LoaderCircle className="animate-spin" size={18} /> : <LockKeyhole size={17} />}
                            {loginMethod === "key" ? "Opening secure session..." : "Access command center"}
                            {!isLoading && <ArrowRight size={17} />}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[11px] leading-5 text-slate-600">
                        Access attempts are authenticated by Firebase and restricted by server-side role checks.
                    </p>
                </motion.section>
            </main>
        </div>
    );
}
