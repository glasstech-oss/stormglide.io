"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Pencil,
  Send,
} from "lucide-react";
import { BillingAPI } from "@/lib/api";
import { SerializedDate } from "@/lib/firestore";
import InvoicePreviewCard, { InvoicePreviewData } from "@/components/admin/invoices/InvoicePreviewCard";

type InvoiceData = InvoicePreviewData & {
  id: string;
  invoiceNumber: string;
  status: string;
  paymentLink?: string | null;
  dueDate: SerializedDate;
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  SENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PAID: "bg-green-500/10 text-green-400 border-green-500/20",
  OVERDUE: "bg-red-500/10 text-red-400 border-red-500/20",
  VOID: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await BillingAPI.getInvoice(invoiceId);
      setInvoice(data);
    } catch (requestError) {
      console.error("Failed to fetch invoice:", requestError);
      setError("This invoice could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    setActionLoading("send");
    try {
      const updated = await BillingAPI.sendInvoice(invoiceId);
      setInvoice(updated);
    } catch (requestError) {
      console.error("Failed to send invoice:", requestError);
      setError("Could not send the invoice. Check the client has an email on file.");
    } finally {
      setActionLoading(null);
    }
  };

  const markPaid = async () => {
    setActionLoading("paid");
    try {
      await BillingAPI.updateInvoiceStatus(invoiceId, "PAID");
      await fetchInvoice();
    } catch (requestError) {
      console.error("Failed to mark invoice paid:", requestError);
      setError("Could not update the invoice status.");
    } finally {
      setActionLoading(null);
    }
  };

  const downloadPdf = async () => {
    if (!invoice) return;
    setActionLoading("pdf");
    try {
      await BillingAPI.downloadInvoicePdf(invoiceId, invoice.invoiceNumber);
    } catch (requestError) {
      console.error("Failed to download PDF:", requestError);
      setError("Could not generate the PDF right now.");
    } finally {
      setActionLoading(null);
    }
  };

  const copyPayLink = async () => {
    const url = `${window.location.origin}/invoice/${invoiceId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="py-16 text-center text-gray-500">{error || "Invoice not found"}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/invoices" className="mt-1 rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[invoice.status] || STATUS_STYLES.DRAFT}`}>
                {invoice.status}
              </span>
            </div>
            <p className="mt-1 text-gray-400">{invoice.client?.companyName || "Unassigned client"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {invoice.status !== "PAID" && invoice.status !== "VOID" && (
            <Link
              href={`/admin/invoices/${invoiceId}/edit`}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
            >
              <Pencil size={15} /> Edit
            </Link>
          )}
          <button
            onClick={copyPayLink}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
          >
            <Copy size={15} /> {copied ? "Copied!" : "Copy pay link"}
          </button>
          <button
            onClick={downloadPdf}
            disabled={actionLoading === "pdf"}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            {actionLoading === "pdf" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} PDF
          </button>
          {invoice.status !== "PAID" && invoice.status !== "VOID" && (
            <button
              onClick={markPaid}
              disabled={actionLoading === "paid"}
              className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400 transition hover:bg-green-500/20 disabled:opacity-50"
            >
              {actionLoading === "paid" ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />} Mark paid
            </button>
          )}
          {invoice.status !== "PAID" && invoice.status !== "VOID" && (
            <button
              onClick={send}
              disabled={actionLoading === "send"}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {actionLoading === "send" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {invoice.status === "DRAFT" ? "Send invoice" : "Resend"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      {/* Branded invoice preview */}
      <InvoicePreviewCard data={invoice} />
    </div>
  );
}
