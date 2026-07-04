"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText } from "lucide-react";
import { BillingAPI, ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate } from "@/lib/firestore";

interface Invoice {
    id: string;
    invoiceNumber?: string;
    clientName?: string;
    client?: { companyName?: string };
    projectId?: string;
    projectName?: string;
    amount: number;
    currency?: string;
    status: string;
    issuedAt?: SerializedDate;
    dueDate?: SerializedDate;
}

interface Expense {
    id: string;
    projectId: string;
    vendor: string;
    category?: string;
    amount: number;
    currency?: string;
    paidAt?: SerializedDate;
    reference?: string;
}

interface ProjectName { id: string; projectName: string }

function money(amount: number, currency = "GHS") {
    try {
        return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
    } catch {
        return `${currency} ${(amount || 0).toLocaleString()}`;
    }
}

function groupedTotals(records: Array<{ amount: number; currency?: string }>) {
    return Object.entries(records.reduce<Record<string, number>>((totals, record) => {
        const currency = record.currency || "GHS";
        totals[currency] = (totals[currency] || 0) + Number(record.amount || 0);
        return totals;
    }, {})).map(([currency, amount]) => money(amount, currency)).join(" · ") || money(0);
}

export default function BillingModule() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [projects, setProjects] = useState<ProjectName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([BillingAPI.getInvoices(), ProjectsAPI.getExpenses(), ProjectsAPI.list()])
            .then(([invoiceData, expenseData, projectData]) => {
                setInvoices(Array.isArray(invoiceData) ? invoiceData : invoiceData?.invoices || []);
                setExpenses(Array.isArray(expenseData) ? expenseData : []);
                setProjects(Array.isArray(projectData) ? projectData : []);
            })
            .catch((requestError) => {
                console.error("Failed to load payments:", requestError);
                setError("Payments could not be loaded.");
            })
            .finally(() => setLoading(false));
    }, []);

    const projectNames = useMemo(() => Object.fromEntries(projects.map((project) => [project.id, project.projectName])), [projects]);
    const paidInvoices = invoices.filter((invoice) => invoice.status === "PAID");
    const openInvoices = invoices.filter((invoice) => ["SENT", "PENDING", "OVERDUE"].includes(invoice.status));

    if (loading) return <div className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />;

    return (
        <div className="space-y-6">
            {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    { label: "Client payments received", value: groupedTotals(paidInvoices), color: "text-emerald-400" },
                    { label: "Outstanding invoices", value: groupedTotals(openInvoices), color: "text-amber-400" },
                    { label: "Project expenses paid", value: groupedTotals(expenses), color: "text-rose-400" },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-[#101722] p-5">
                        <div className="text-xs text-slate-500">{item.label}</div>
                        <div className={`mt-2 text-lg font-semibold ${item.color}`}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="overflow-hidden rounded-xl border border-white/10 bg-[#101722]">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ArrowDownLeft size={18} className="text-emerald-400" />
                            <div><h2 className="font-semibold text-white">Client invoices</h2><p className="text-xs text-slate-500">Money billed to and received from clients.</p></div>
                        </div>
                        <Link href="/admin/invoices/new" className="flex shrink-0 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/20">
                            <Plus size={13} /> New
                        </Link>
                    </div>
                    {invoices.length === 0 ? <Empty text="No invoices recorded." /> : (
                        <div className="divide-y divide-white/10">
                            {invoices.map((invoice) => (
                                <Link key={invoice.id} href={`/admin/invoices/${invoice.id}`} className="grid gap-2 px-5 py-4 transition hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1fr)_auto]">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-white">{invoice.invoiceNumber || invoice.id}</div>
                                        <div className="mt-1 text-xs text-slate-500">{invoice.client?.companyName || invoice.clientName || invoice.projectName || "Client invoice"} · Due {formatDate(invoice.dueDate)}</div>
                                    </div>
                                    <div className="sm:text-right"><div className="text-sm font-semibold text-white">{money(Number(invoice.amount), invoice.currency)}</div><div className="mt-1 text-xs text-slate-500">{invoice.status}</div></div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="overflow-hidden rounded-xl border border-white/10 bg-[#101722]">
                    <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                        <ArrowUpRight size={18} className="text-rose-400" />
                        <div><h2 className="font-semibold text-white">Project expenses</h2><p className="text-xs text-slate-500">Payments made for domains, hosting, software and vendors.</p></div>
                    </div>
                    {expenses.length === 0 ? <Empty text="No project expenses recorded." /> : (
                        <div className="divide-y divide-white/10">
                            {expenses.map((expense) => (
                                <Link key={expense.id} href={`/admin/projects/${expense.projectId}`} className="grid gap-2 px-5 py-4 transition hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1fr)_auto]">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 truncate text-sm font-medium text-white"><ReceiptText size={14} className="text-slate-500" />{expense.vendor}</div>
                                        <div className="mt-1 truncate text-xs text-slate-500">{projectNames[expense.projectId] || "Project"} · {expense.category || "Expense"} · {formatDate(expense.paidAt)}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-rose-400 sm:text-right">{money(Number(expense.amount), expense.currency)}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return <div className="px-5 py-12 text-center text-sm text-slate-500">{text}</div>;
}
