"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface SiteSettings {
    companyName: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    backgroundColor: string;
    foregroundColor?: string;
    heroHeadline: string;
    heroSubtext: string;
    contactEmail?: string;
    contactPhone?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
}

const SiteSettingsContext = createContext<{
    settings: SiteSettings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}>({
    settings: null,
    loading: true,
    refreshSettings: async () => { },
});

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/settings`);
            setSettings(response.data);
            applyTheme(response.data);
        } catch (error) {
            console.error('Failed to fetch site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (s: SiteSettings) => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.style.setProperty('--primary', s.primaryColor);
            root.style.setProperty('--secondary', s.secondaryColor);
            root.style.setProperty('--accent', s.accentColor || '#F472B6');
            root.style.setProperty('--background', s.backgroundColor);
            root.style.setProperty('--foreground', s.foregroundColor || '#ffffff');
            root.style.setProperty('--card', s.backgroundColor === '#ffffff' ? '#f8fafc' : '#111827');
            root.style.setProperty('--border', s.backgroundColor === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)');

            // Update favicon if provided
            if (s.faviconUrl) {
                const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (link) link.href = s.faviconUrl;
            }

            // Update title if needed
            document.title = s.companyName;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
