"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Receipt, Trash2, UserPlus, X } from "lucide-react";
import { BillingAPI, CrmAPI, ProjectsAPI, SettingsAPI, InvoiceLineItem } from "@/lib/api";
import InvoicePreviewCard, { InvoicePreviewData, PreviewCompany } from "@/components/admin/invoices/InvoicePreviewCard";

interface ClientOption {
  id: string;
  companyName?: string;
  contactName?: string;
  email?: string;
}

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

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [includeWarranty, setIncludeWarranty] = useState(true);
  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem()]);

  const [showQuickClient, setShowQuickClient] = useState(false);
  const [quickClient, setQuickClient] = useState({ companyName: "", contactName: "", email: "", whatsappNumber: "" });
  const [creatingClient, setCreatingClient] = useState(false);
  const [quickClientError, setQuickClientError] = useState("");
  const [company, setCompany] = useState<PreviewCompany | undefined>(undefined);

  useEffect(() => {
    SettingsAPI.get().then((settings) => {
      setCompany({
        name: settings.invoiceCompanyName, address: settings.invoiceAddress, taxId: settings.invoiceTaxId,
        email: settings.contactEmail, phone: settings.contactPhone,
        logoUrl: settings.logoDataUri || settings.logoUrl,
        primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor,
        bankPrimary: { name: settings.bankPrimaryName, accountName: settings.bankPrimaryAccountName, accountNumber: settings.bankPrimaryAccountNumber, branch: settings.bankPrimaryBranch },
        bankSecondary: { name: settings.bankSecondaryName, accountName: settings.bankSecondaryAccountName, accountNumber: settings.bankSecondaryAccountNumber, branch: settings.bankSecondaryBranch },
        terms: settings.invoiceTerms, warranty: settings.invoiceWarranty,
      });
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    Promise.all([CrmAPI.getClients(), ProjectsAPI.list()])
      .then(([clientData, projectData]) => {
        setClients(Array.isArray(clientData) ? clientData : clientData?.clients || []);
        setProjects(Array.isArray(projectData) ? projectData : []);
      })
      .catch(() => setError("Clients could not be loaded."))
      .finally(() => setLoadingClients(false));
  }, []);

  const clientProjects = useMemo(
    () => projects.filter((project) => !clientId || project.clientId === clientId),
    [projects, clientId],
  );

  const selectedClient = useMemo(() => clients.find((c) => c.id === clientId), [clients, clientId]);
  const selectedProject = useMemo(() => clientProjects.find((p) => p.id === projectId), [clientProjects, projectId]);

  const createQuickClient = async (event: FormEvent) => {
    event.preventDefault();
    if (!quickClient.companyName.trim() || !quickClient.contactName.trim()) {
      setQuickClientError("Company and contact name are required.");
      return;
    }
    setCreatingClient(true);
    setQuickClientError("");
    try {
      const created = await CrmAPI.createClient({
        companyName: quickClient.companyName.trim(),
        contactName: quickClient.contactName.trim(),
        email: quickClient.email.trim() || undefined,
        whatsappNumber: quickClient.whatsappNumber.trim() || undefined,
      });
      const newClient: ClientOption = { id: created.id, companyName: created.companyName, contactName: created.contactName, email: quickClient.email.trim() || undefined };
      setClients((current) => [newClient, ...current]);
      setClientId(created.id);
      setShowQuickClient(false);
      setQuickClient({ companyName: "", contactName: "", email: "", whatsappNumber: "" });
    } catch (requestError) {
      console.error("Failed to create client:", requestError);
      setQuickClientError("Could not create this client. Try again.");
    } finally {
      setCreatingClient(false);
    }
  };

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
    status: "DRAFT",
    currency,
    items: items.filter((item) => item.name.trim()),
    subtotal, taxPercent: Number(taxPercent) || 0, taxAmount,
    discountPercent: Number(discountPercent) || 0, discountAmount,
    amount: total,
    notes: notes.trim() || undefined,
    issuedAt: new Date().toISOString(),
    dueDate: dueDate || undefined,
    client: selectedClient ? { companyName: selectedClient.companyName, contactName: selectedClient.contactName, email: selectedClient.email } : null,
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
      if (!dueDate) {
        setError("Set a due date for this invoice.");
        setSubmitting(false);
        return;
      }

      const invoice = await BillingAPI.createInvoice(clientId, {
        items: cleanItems,
        currency,
        projectId: projectId || undefined,
        dueDate,
        taxPercent: Number(taxPercent) || 0,
        discountPercent: Number(discountPercent) || 0,
        notes: notes.trim() || undefined,
        includeWarranty,
      });
      router.push(`/admin/invoices/${invoice.id}`);
    } catch (requestError) {
      console.error("Failed to create invoice:", requestError);
      setError("The invoice could not be created. Check the details and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/admin/invoices" className="mt-1 rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New invoice</h1>
          <p className="mt-1 text-gray-400">Bill a client for products, services, or both — saved as a draft until you send it.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Receipt size={20} />
              </div>
              <div>
                <div className="font-semibold text-white">Bill to</div>
                <div className="text-xs text-gray-500">Any client works here — not just software project clients.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowQuickClient((v) => !v)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
            >
              {showQuickClient ? <X size={14} /> : <UserPlus size={14} />}
              {showQuickClient ? "Cancel" : "New client"}
            </button>
          </div>

          {showQuickClient && (
            <div className="space-y-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="text-xs text-gray-400">Quick add — just enough to invoice them. No project setup required.</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Company or customer name *"
                  value={quickClient.companyName}
                  onChange={(event) => setQuickClient({ ...quickClient, companyName: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
                />
                <input
                  required
                  placeholder="Contact name *"
                  value={quickClient.contactName}
                  onChange={(event) => setQuickClient({ ...quickClient, contactName: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
                />
                <input
                  type="email"
                  placeholder="Email (needed to send the invoice)"
                  value={quickClient.email}
                  onChange={(event) => setQuickClient({ ...quickClient, email: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
                />
                <input
                  placeholder="WhatsApp / phone (optional)"
                  value={quickClient.whatsappNumber}
                  onChange={(event) => setQuickClient({ ...quickClient, whatsappNumber: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
                />
              </div>
              {quickClientError && <p className="text-xs text-red-300">{quickClientError}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={createQuickClient}
                  disabled={creatingClient}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingClient ? "Adding..." : "Add & select client"}
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm text-gray-400">
              Client
              <select
                required
                disabled={loadingClients}
                value={clientId}
                onChange={(event) => { setClientId(event.target.value); setProjectId(""); }}
                className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              >
                <option value="">{loadingClients ? "Loading clients..." : "Select a client"}</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.companyName || client.contactName || client.id}</option>
                ))}
              </select>
            </label>

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
          </div>

          {/* Line items */}
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
              placeholder="Payment terms, project reference, or anything else the client should know."
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

          {/* Totals */}
          <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{money(subtotal, currency)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-gray-400"><span>Discount ({discountPercent}%)</span><span>-{money(discountAmount, currency)}</span></div>}
            {taxAmount > 0 && <div className="flex justify-between text-gray-400"><span>Tax ({taxPercent}%)</span><span>{money(taxAmount, currency)}</span></div>}
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white"><span>Total due</span><span>{money(total, currency)}</span></div>
          </div>

          {clients.length === 0 && !loadingClients && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              No clients exist yet. Use "New client" above to add one.
            </p>
          )}
          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <Link href="/admin/invoices" className="rounded-lg px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">Cancel</Link>
            <button
              type="submit"
              disabled={submitting || loadingClients || clients.length === 0}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Save draft"}
            </button>
          </div>
        </form>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</div>
          <InvoicePreviewCard data={previewData} />
        </div>
      </div>
    </div>
  );
}
