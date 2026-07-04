"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Receipt } from "lucide-react";
import { BillingAPI } from "@/lib/api";
import { formatDate, SerializedDate } from "@/lib/firestore";

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: SerializedDate;
  issuedAt?: SerializedDate;
  createdAt?: SerializedDate;
  client?: { companyName?: string; contactName?: string };
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-500/10 text-gray-400",
  SENT: "bg-blue-500/10 text-blue-400",
  PAID: "bg-green-500/10 text-green-400",
  OVERDUE: "bg-red-500/10 text-red-400",
  VOID: "bg-gray-500/10 text-gray-500 line-through",
};

function money(amount: number, currency = "GHS") {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await BillingAPI.getInvoices(filterStatus || undefined);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error("Failed to fetch invoices:", requestError);
      setError("Invoices could not be loaded. Refresh the page or sign in again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return invoices.filter((invoice) =>
      invoice.invoiceNumber?.toLowerCase().includes(term) ||
      invoice.client?.companyName?.toLowerCase().includes(term),
    );
  }, [invoices, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-gray-400">Bill clients for products and services, and track what's been paid.</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-cyan-400 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/20"
        >
          <Plus size={18} />
          <span>New Invoice</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
          />
        </div>
        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="VOID">Void</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#111827] py-16 text-center text-gray-500">
          <Receipt size={28} className="mx-auto mb-3 text-gray-600" />
          No invoices found. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/admin/invoices/${invoice.id}`}
              className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#111827] p-6 transition-all hover:border-cyan-500/30 hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-mono text-sm font-bold text-white transition-colors group-hover:text-cyan-400">
                    {invoice.invoiceNumber}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[invoice.status] || "bg-gray-500/10 text-gray-400"}`}>
                    {invoice.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-400">
                  {invoice.client?.companyName || "Unassigned client"} · Due {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-lg font-semibold text-white">{money(Number(invoice.amount), invoice.currency)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
