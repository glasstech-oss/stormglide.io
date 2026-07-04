"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setAuthReady(true);
            return;
        }
        if (!auth) {
            window.location.replace('/admin/login?reason=configuration');
            return;
        }
        const firebaseAuth = auth;

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (!user) {
                await fetch('/api/auth/admin-logout', { method: 'POST' }).catch(() => undefined);
                window.location.replace('/admin/login?reason=session');
                return;
            }

            try {
                const token = await user.getIdTokenResult();
                if (token.claims.role !== 'OMEGA' && token.claims.role !== 'ADMIN') {
                    await signOut(firebaseAuth).catch(() => undefined);
                    await fetch('/api/auth/admin-logout', { method: 'POST' }).catch(() => undefined);
                    window.location.replace('/admin/login?reason=permission');
                    return;
                }
                setAuthReady(true);
            } catch {
                window.location.replace('/admin/login?reason=session');
            }
        });

        return unsubscribe;
    }, [pathname]);

    if (pathname === "/admin/login") return <>{children}</>;

    if (!authReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050a14] text-white">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
                    Verifying secure session
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0f18] font-sans text-white">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
