import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code, Space_Grotesk, Space_Mono, Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400","500","600","700"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono", weight: ["400","700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
    title: "Stormglide.io | Enterprise Systems Architecture",
    description: "We don't just write code. We architect high-performance software systems, custom web apps, and enterprise ERPs.",
    manifest: "/manifest.webmanifest",
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
        <html lang="en" className={`${inter.variable} ${firaCode.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${manrope.variable} bg-[#0B0F19]`}>
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
