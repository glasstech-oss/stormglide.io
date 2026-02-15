import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

// We use Inter for main UI and Fira Code for the Developer Terminal/Code blocks
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "Stormglide.io | Enterprise Systems Architecture",
    description: "We don't just write code. We architect high-performance software systems, custom web apps, and enterprise ERPs.",
    manifest: "/manifest.json", // Essential for the PWA installability
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Stormglide",
    },
};

export const viewport: Viewport = {
    themeColor: "#0B0F19",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents zooming on mobile to maintain the native app feel
};

import { SiteSettingsProvider } from "@/context/SiteSettingsProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${firaCode.variable} bg-[#0B0F19]`}>
            <body className="antialiased bg-[#0B0F19] text-white">
                <SiteSettingsProvider>
                    <AppShell>
                        {children}
                    </AppShell>
                </SiteSettingsProvider>
            </body>
        </html>
    );
}
