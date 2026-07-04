"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Palette,
    Type,
    Image as ImageIcon,
    Moon,
    Sun,
    Save,
    RefreshCw,
    CheckCircle2,
    Receipt,
    Upload,
    X,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsProvider";
import { SettingsAPI } from "@/lib/api";

export default function SettingsPage() {
    const { settings, refreshSettings } = useSiteSettings();
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    if (!formData) return (
        <div className="flex items-center justify-center p-20">
            <RefreshCw className="animate-spin text-cyan-500" size={32} />
        </div>
    );

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus("idle");
        try {
            await SettingsAPI.update(formData);
            await refreshSettings();
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            console.error("Failed to update settings:", error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleMode = (mode: 'dark' | 'light') => {
        if (mode === 'dark') {
            setFormData({ ...formData, backgroundColor: "#0B0F19", foregroundColor: "#ffffff" });
        } else {
            setFormData({ ...formData, backgroundColor: "#ffffff", foregroundColor: "#0B0F19" });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saveStatus === "success" ? "Saved" : "Save changes"}
                </button>
            </div>

            {/* Quick Actions: Dark/Light Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => toggleMode('dark')}
                    className="p-6 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-cyan-500/50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                            <Moon className="text-cyan-400" />
                        </div>
                        <div className="text-left">
                            <span className="block text-white font-bold text-lg">Dark theme</span>
                            <span className="text-gray-500 text-sm">Dark website appearance</span>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => toggleMode('light')}
                    className="p-6 rounded-2xl bg-white border border-black/5 flex items-center justify-between hover:border-cyan-500/50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Sun className="text-orange-500" />
                        </div>
                        <div className="text-left">
                            <span className="block text-black font-bold text-lg">Light theme</span>
                            <span className="text-gray-400 text-sm">Light website appearance</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Theming System */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <Palette className="text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Appearance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ColorInput
                        label="Primary Color"
                        value={formData.primaryColor}
                        onChange={(val) => setFormData({ ...formData, primaryColor: val })}
                    />
                    <ColorInput
                        label="Secondary Color"
                        value={formData.secondaryColor}
                        onChange={(val) => setFormData({ ...formData, secondaryColor: val })}
                    />
                    <ColorInput
                        label="Accent Color"
                        value={formData.accentColor || "#F472B6"}
                        onChange={(val) => setFormData({ ...formData, accentColor: val })}
                    />
                    <ColorInput
                        label="Background"
                        value={formData.backgroundColor}
                        onChange={(val) => setFormData({ ...formData, backgroundColor: val })}
                    />
                </div>
            </div>

            {/* Branding & Content */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <ImageIcon className="text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Brand and content</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Company Name</label>
                            <input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <LogoUpload
                            value={formData.logoDataUri || formData.logoUrl}
                            onChange={(dataUri) => setFormData({ ...formData, logoDataUri: dataUri })}
                            onClear={() => setFormData({ ...formData, logoDataUri: "" })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Hero Headline</label>
                        <input
                            value={formData.heroHeadline}
                            onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* Invoicing */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <Receipt className="text-emerald-400" />
                    <div>
                        <h2 className="text-xl font-bold text-white">Invoicing</h2>
                        <p className="text-sm text-gray-500 mt-1">Shown on every invoice — header, bank transfer details, terms, and warranty.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TextField label="Invoice Company Name" value={formData.invoiceCompanyName} onChange={(v) => setFormData({ ...formData, invoiceCompanyName: v })} />
                        <TextField label="Invoice Address" value={formData.invoiceAddress} onChange={(v) => setFormData({ ...formData, invoiceAddress: v })} />
                        <TextField label="TIN / Business Reg. No." value={formData.invoiceTaxId} placeholder="Optional" onChange={(v) => setFormData({ ...formData, invoiceTaxId: v })} />
                    </div>

                    <div className="border-t border-white/5 pt-6">
                        <h3 className="text-sm font-bold text-white mb-4">Bank account 1</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <TextField label="Bank Name" value={formData.bankPrimaryName} onChange={(v) => setFormData({ ...formData, bankPrimaryName: v })} />
                            <TextField label="Account Name" value={formData.bankPrimaryAccountName} onChange={(v) => setFormData({ ...formData, bankPrimaryAccountName: v })} />
                            <TextField label="Account Number" value={formData.bankPrimaryAccountNumber} onChange={(v) => setFormData({ ...formData, bankPrimaryAccountNumber: v })} />
                            <TextField label="Branch" value={formData.bankPrimaryBranch} onChange={(v) => setFormData({ ...formData, bankPrimaryBranch: v })} />
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-6">
                        <h3 className="text-sm font-bold text-white mb-4">Bank account 2 <span className="text-gray-500 font-normal">(optional)</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <TextField label="Bank Name" value={formData.bankSecondaryName} onChange={(v) => setFormData({ ...formData, bankSecondaryName: v })} />
                            <TextField label="Account Name" value={formData.bankSecondaryAccountName} onChange={(v) => setFormData({ ...formData, bankSecondaryAccountName: v })} />
                            <TextField label="Account Number" value={formData.bankSecondaryAccountNumber} onChange={(v) => setFormData({ ...formData, bankSecondaryAccountNumber: v })} />
                            <TextField label="Branch" value={formData.bankSecondaryBranch} onChange={(v) => setFormData({ ...formData, bankSecondaryBranch: v })} />
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Terms &amp; Conditions</label>
                            <textarea
                                rows={4}
                                value={formData.invoiceTerms}
                                onChange={(e) => setFormData({ ...formData, invoiceTerms: e.target.value })}
                                className="w-full resize-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Warranty</label>
                            <textarea
                                rows={4}
                                value={formData.invoiceWarranty}
                                onChange={(e) => setFormData({ ...formData, invoiceWarranty: e.target.value })}
                                className="w-full resize-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (val: string) => void; placeholder?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">{label}</label>
            <input
                value={value || ""}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
        </div>
    );
}

const MAX_LOGO_FILE_BYTES = 500 * 1024; // 500KB raw — keeps base64 well under Firestore's 1MB doc limit

function LogoUpload({ value, onChange, onClear }: { value?: string; onChange: (dataUri: string) => void; onClear: () => void }) {
    const [error, setError] = useState("");
    const inputId = "logo-upload-input";

    const handleFile = (file: File | undefined) => {
        setError("");
        if (!file) return;
        if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) {
            setError("Please choose a PNG or JPEG image.");
            return;
        }
        if (file.size > MAX_LOGO_FILE_BYTES) {
            setError(`That file is too large (${Math.round(file.size / 1024)}KB). Keep it under ${MAX_LOGO_FILE_BYTES / 1024}KB.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") onChange(reader.result);
        };
        reader.onerror = () => setError("Could not read that file. Try again.");
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Logo</label>
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-2">
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt="Logo preview" className="h-full w-full object-contain" />
                    ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <label
                            htmlFor={inputId}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition hover:border-cyan-500/50"
                        >
                            <Upload size={15} /> Choose file
                        </label>
                        <input
                            id={inputId}
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                            className="hidden"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={() => { onClear(); setError(""); }}
                                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
                            >
                                <X size={14} /> Remove
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">PNG or JPEG, up to {MAX_LOGO_FILE_BYTES / 1024}KB. Used on invoices and the site header.</p>
                    {error && <p className="text-xs text-red-400">{error}</p>}
                </div>
            </div>
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">{label}</label>
                <span className="text-[10px] font-mono text-gray-400">{value}</span>
            </div>
            <div className="flex gap-4">
                <div
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-lg"
                    style={{ backgroundColor: value }}
                ></div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                />
            </div>
        </div>
    );
}
