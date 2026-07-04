"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { PublicInvoiceAPI } from "@/lib/api";
import InvoicePreviewCard, { InvoicePreviewData } from "@/components/admin/invoices/InvoicePreviewCard";

type LoadState = "loading" | "ready" | "error";

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

function PublicInvoiceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const invoiceId = params.id as string;
  const justPaid = searchParams.get("paid") === "1";

  const [state, setState] = useState<LoadState>("loading");
  const [invoice, setInvoice] = useState<InvoicePreviewData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    load();
  }, [invoiceId]);

  const load = async () => {
    setState("loading");
    try {
      const data = await PublicInvoiceAPI.get(invoiceId);
      setInvoice(data);
      setState("ready");
    } catch (requestError: unknown) {
      const status = (requestError as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
      setErrorMsg(
        status === 404 ? "We couldn't find this invoice. Double-check the link you were sent."
          : status === 410 ? "This invoice has been voided and is no longer payable."
          : "This invoice couldn't be loaded right now. Please try again shortly."
      );
      setState("error");
    }
  };

  const pay = async () => {
    setPaying(true);
    setPayError("");
    try {
      const result = await PublicInvoiceAPI.pay(invoiceId);
      if (result.alreadyPaid) {
        await load();
        return;
      }
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setPayError("Could not start payment. Please try again.");
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPayError(message || "Could not start payment right now. Please try again shortly.");
    } finally {
      setPaying(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050a14]">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 size={18} className="animate-spin" /> Loading invoice
        </div>
      </div>
    );
  }

  if (state === "error" || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050a14] px-4">
        <div className="max-w-sm rounded-2xl border border-white/10 bg-[#0a0f18] p-8 text-center">
          <XCircle size={32} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-lg font-semibold text-white">Invoice unavailable</h1>
          <p className="mt-2 text-sm text-slate-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "PAID";
  const primary = invoice.company?.primaryColor || "#22D3EE";

  return (
    <div className="min-h-screen bg-[#050a14] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-[850px]">
        {(isPaid || justPaid) && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/25 bg-green-500/10 px-5 py-4 text-sm text-green-300">
            <CheckCircle2 size={20} className="shrink-0" />
            <div>
              <div className="font-semibold">Payment received</div>
              <div className="text-green-400/80">This invoice has been marked as paid. Thank you.</div>
            </div>
          </div>
        )}

        <InvoicePreviewCard data={invoice} />

        {!isPaid && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0a0f18] p-6 text-center">
            <button
              onClick={pay}
              disabled={paying}
              style={{ backgroundColor: primary }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {paying ? <Loader2 size={18} className="animate-spin" /> : null}
              {paying ? "Starting payment..." : `Pay ${money(invoice.amount, invoice.currency)} now`}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={13} /> Card, Mobile Money, or Bank Transfer via Paystack
            </div>
            {payError && <p className="mt-3 text-sm text-red-400">{payError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicInvoicePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050a14]">
        <Loader2 size={28} className="animate-spin text-cyan-400" />
      </div>
    }>
      <PublicInvoiceContent />
    </Suspense>
  );
}
