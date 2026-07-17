"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Receipt, Trash2 } from "lucide-react";
import { BillingAPI, ProjectsAPI, InvoiceLineItem } from "@/lib/api";
import { toDate, SerializedDate } from "@/lib/firestore";
import InvoicePreviewCard, { InvoicePreviewData } from "@/components/admin/invoices/InvoicePreviewCard";

interface ProjectOption {
  id: string;
  projectName: string;
  clientId?: string;
}

const CURRENCIES = ["GHS", "USD", "NGN", "ZAR", "GBP", "EUR", "KES", "XOF"];
const emptyItem = (): InvoiceLineItem => ({ type: "SERVICE", name: "", description: "", quantity: 1, unitPrice: 0 });

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

function toDateInputValue(value: SerializedDate): string {
  const date = toDate(value);
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [clientId, setClientId] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("DRAFT");
  const [clientInfo, setClientInfo] = useState<InvoicePreviewData["client"]>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issuedAt, setIssuedAt] = useState<SerializedDate>(undefined);
  const [company, setCompany] = useState<InvoicePreviewData["company"]>(undefined);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [projectId, setProjectId] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [includeWarranty, setIncludeWarranty] = useState(true);
  const [items, setItems] = useState<InvoiceLineItem[]>([]);

  useEffect(() => {
    Promise.all([BillingAPI.getInvoice(invoiceId), ProjectsAPI.list()])
      .then(([invoice, projectData]) => {
        if (invoice.status === "VOID") {
          setError("Voided invoices can no longer be edited.");
          setNotFound(true);
          return;
        }
        setInvoiceStatus(invoice.status);
        setClientId(invoice.clientId);
        setClientInfo(invoice.client ? { companyName: invoice.client.companyName, contactName: invoice.client.contactName, email: invoice.client.email } : null);
        setInvoiceNumber(invoice.invoiceNumber);
        setIssuedAt(invoice.issuedAt || invoice.createdAt);
        setCompany(invoice.company);
        setProjectId(invoice.projectId || "");
        setCurrency(invoice.currency);
        setDueDate(toDateInputValue(invoice.dueDate));
        setTaxPercent(invoice.taxPercent || 0);
        setDiscountPercent(invoice.discountPercent || 0);
        setNotes(invoice.notes || "");
        setIncludeWarranty(invoice.includeWarranty !== false);
        setItems(invoice.items?.length ? invoice.items.map((i: InvoiceLineItem) => ({ ...i, description: i.description || "" })) : [emptyItem()]);
        setProjects(Array.isArray(projectData) ? projectData : []);
      })
      .catch((requestError) => {
        console.error("Failed to load invoice:", requestError);
        setError("This invoice could not be loaded.");
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [invoiceId]);

  const clientProjects = useMemo(
    () => projects.filter((project) => !clientId || project.clientId === clientId),
    [projects, clientId],
  );
  const selectedProject = useMemo(() => clientProjects.find((p) => p.id === projectId), [clientProjects, projectId]);

  const updateItem = (index: number, patch: Partial<InvoiceLineItem>) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    setItems((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : current));
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const discountAmount = subtotal * ((Number(discountPercent) || 0) / 100);
  const taxAmount = (subtotal - discountAmount) * ((Number(taxPercent) || 0) / 100);
  const total = subtotal - discountAmount + taxAmount;

  const previewData: InvoicePreviewData = {
    invoiceNumber, status: invoiceStatus, currency,
    items: items.filter((item) => item.name?.trim()),
    subtotal, taxPercent: Number(taxPercent) || 0, taxAmount,
    discountPercent: Number(discountPercent) || 0, discountAmount,
    amount: total,
    notes: notes.trim() || undefined,
    issuedAt, dueDate: dueDate || undefined,
    client: clientInfo,
    project: selectedProject ? { projectName: selectedProject.projectName } : null,
    company,
    includeWarranty,
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const cleanItems = items
        .map((item) => ({ ...item, name: item.name.trim(), description: (item.description || "").trim(), quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) }))
        .filter((item) => item.name && item.quantity > 0);

      if (!cleanItems.length) {
        setError("Add at least one line item with a name, quantity, and price.");
        setSubmitting(false);
        return;
      }

      await BillingAPI.updateInvoice(invoiceId, {
        items: cleanItems,
        currency,
        projectId: projectId || undefined,
        dueDate,
        taxPercent: Number(taxPercent) || 0,
        discountPercent: Number(discountPercent) || 0,
        notes: notes.trim() || undefined,
        includeWarranty,
      });
      router.push(`/admin/invoices/${invoiceId}`);
    } catch (requestError) {
      console.error("Failed to update invoice:", requestError);
      setError("The invoice could not be updated. Check the details and try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-16 text-center">
        <p className="text-gray-400">{error}</p>
        <Link href={`/admin/invoices/${invoiceId}`} className="text-cyan-400 hover:underline">Back to invoice</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start gap-4">
        <Link href={`/admin/invoices/${invoiceId}`} className="mt-1 rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit invoice</h1>
          <p className="mt-1 text-gray-400">{clientInfo?.companyName || clientInfo?.contactName || clientId}</p>
        </div>
      </div>

      {invoiceStatus === "PAID" && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          This invoice is marked as paid. Saving changes updates the invoice record and PDF, but does not affect the payment already recorded.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Receipt size={20} />
            </div>
            <div>
              <div className="font-semibold text-white">Line items</div>
              <div className="text-xs text-gray-500">The client and invoice number can't be changed on a draft.</div>
            </div>
          </div>

          <label className="block space-y-2 text-sm text-gray-400">
            Project <span className="text-gray-600">(optional)</span>
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
            >
              <option value="">No linked project</option>
              {clientProjects.map((project) => (
                <option key={project.id} value={project.id}>{project.projectName}</option>
              ))}
            </select>
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Line items</div>
              <button
                type="button"
                onClick={() => setItems((current) => [...current, emptyItem()])}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
              >
                <Plus size={14} /> Add item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start gap-2">
                    <div className="w-28 shrink-0 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Type</div>
                      <select
                        value={item.type}
                        onChange={(event) => updateItem(index, { type: event.target.value as InvoiceLineItem["type"] })}
                        className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-2 py-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                      >
                        <option value="PRODUCT">Product</option>
                        <option value="SERVICE">Service</option>
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Item name</div>
                      <input
                        required
                        placeholder="e.g. Nexus HRM license (annual)"
                        value={item.name}
                        onChange={(event) => updateItem(index, { name: event.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm font-medium text-white outline-none placeholder:font-normal placeholder:text-gray-600 focus:border-cyan-500/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-red-500/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Description <span className="normal-case text-gray-600">(optional, shown in italics under the item)</span></div>
                    <input
                      placeholder="What this covers — shown as smaller italic text under the item name"
                      value={item.description || ""}
                      onChange={(event) => updateItem(index, { description: event.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2 text-sm italic text-gray-300 outline-none placeholder:not-italic placeholder:text-gray-600 focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="w-24 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Quantity</div>
                      <input
                        required
                        type="number"
                        min={1}
                        step={1}
                        value={item.quantity}
                        onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                        className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="w-36 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Unit price ({currency})</div>
                      <input
                        required
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })}
                        className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Line total</div>
                      <div className="text-sm font-semibold text-white">{money((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), currency)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block space-y-2 text-sm text-gray-400">
              Currency
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block space-y-2 text-sm text-gray-400">
              Due date
              <input
                required
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              />
            </label>
            <label className="block space-y-2 text-sm text-gray-400">
              Tax %
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={taxPercent}
                onChange={(event) => setTaxPercent(Number(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              />
            </label>
            <label className="block space-y-2 text-sm text-gray-400">
              Discount %
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={discountPercent}
                onChange={(event) => setDiscountPercent(Number(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm text-gray-400">
            Notes <span className="text-gray-600">(optional, shown on the invoice)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
            />
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={includeWarranty}
              onChange={(event) => setIncludeWarranty(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#080f1d] accent-cyan-500"
            />
            <span>
              <span className="font-medium text-white">Include warranty clause</span>
              <span className="block text-xs text-gray-500">Turn off for product-only or non-software sales — the warranty section is skipped on the invoice.</span>
            </span>
          </label>

          <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{money(subtotal, currency)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-gray-400"><span>Discount ({discountPercent}%)</span><span>-{money(discountAmount, currency)}</span></div>}
            {taxAmount > 0 && <div className="flex justify-between text-gray-400"><span>Tax ({taxPercent}%)</span><span>{money(taxAmount, currency)}</span></div>}
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white"><span>Total due</span><span>{money(total, currency)}</span></div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <Link href={`/admin/invoices/${invoiceId}`} className="rounded-lg px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">Cancel</Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        <div className="lg:sticky lg:top-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</div>
          <InvoicePreviewCard data={previewData} />
        </div>
      </div>
    </div>
  );
}
