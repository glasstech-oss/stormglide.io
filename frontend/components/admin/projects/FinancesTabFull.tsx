"use client";

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, Trash2, X } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate } from "@/lib/firestore";

interface Invoice {
  id: string;
  invoiceNumber?: string;
  amount: number;
  currency?: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "VOID";
  issuedAt?: SerializedDate;
  dueDate?: SerializedDate;
  paidAt?: SerializedDate;
}

interface Expense {
  id: string;
  vendor: string;
  category: string;
  description?: string;
  amount: number;
  currency: string;
  paidAt?: SerializedDate;
  paymentMethod?: string;
  reference?: string;
  recurring?: boolean;
}

const emptyForm = {
  vendor: "",
  category: "SOFTWARE",
  description: "",
  amount: "",
  currency: "GHS",
  paidAt: new Date().toISOString().slice(0, 10),
  paymentMethod: "",
  reference: "",
  recurring: false,
};

const money = (amount: number, currency = "GHS") => {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
};

const moneyByCurrency = (records: Array<{ amount: number; currency?: string }>) => {
  const totals = records.reduce<Record<string, number>>((result, record) => {
    const currency = record.currency || "GHS";
    result[currency] = (result[currency] || 0) + Number(record.amount || 0);
    return result;
  }, {});
  const values = Object.entries(totals).map(([currency, amount]) => money(amount, currency));
  return values.length ? values.join(" · ") : money(0);
};

export function FinancesTabFull({ projectId }: { projectId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const project = await ProjectsAPI.get(projectId);
      setInvoices(Array.isArray(project.invoices) ? project.invoices : []);
      setExpenses(Array.isArray(project.expenses) ? project.expenses : []);
    } catch (requestError) {
      console.error("Failed to load project payments:", requestError);
      setError("Payments and costs could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void load(); }, [load]);

  const totals = useMemo(() => ({
    invoiced: moneyByCurrency(invoices),
    paid: moneyByCurrency(invoices.filter((invoice) => invoice.status === "PAID")),
    outstanding: moneyByCurrency(invoices.filter((invoice) => ["SENT", "OVERDUE"].includes(invoice.status))),
    spent: moneyByCurrency(expenses),
  }), [expenses, invoices]);

  const addExpense = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await ProjectsAPI.addExpense({ projectId, ...form, amount: Number(form.amount) });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (requestError) {
      console.error("Failed to record project payment:", requestError);
      setError("The payment could not be recorded.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!window.confirm("Delete this project payment record?")) return;
    try {
      await ProjectsAPI.deleteExpense(expenseId);
      await load();
    } catch (requestError) {
      console.error("Failed to delete project payment:", requestError);
      setError("The payment could not be deleted.");
    }
  };

  const statusColor = (status: Invoice["status"]) => ({
    PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    SENT: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    OVERDUE: "border-red-500/30 bg-red-500/10 text-red-400",
    DRAFT: "border-white/10 bg-white/5 text-gray-400",
    VOID: "border-white/10 bg-white/5 text-gray-500",
  }[status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Payments & project costs</h3>
          <p className="mt-1 text-sm text-gray-500">Client invoices are income. Vendor, domain, cloud, and software payments are costs.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500/20">
          <Plus size={16} /> Record payment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total invoiced", totals.invoiced, "text-cyan-400"],
          ["Client payments received", totals.paid, "text-emerald-400"],
          ["Outstanding invoices", totals.outstanding, "text-amber-400"],
          ["Project payments made", totals.spent, "text-rose-400"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`mt-2 text-xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={addExpense} className="space-y-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Record a project payment</h4>
              <p className="text-xs text-gray-500">Use this for domains, hosting, databases, APIs, contractors, and other project costs.</p>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"><X size={17} /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input required placeholder="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-white/10 bg-[#080f1d] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50">
              <option value="SOFTWARE">Software</option><option value="DOMAIN">Domain</option><option value="HOSTING">Hosting</option><option value="DATABASE">Database</option><option value="API">API service</option><option value="CONTRACTOR">Contractor</option><option value="OTHER">Other</option>
            </select>
            <div className="flex">
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="rounded-l-lg border border-r-0 border-white/10 bg-[#080f1d] px-2 text-sm text-white"><option>GHS</option><option>USD</option><option>GBP</option><option>EUR</option></select>
              <input required min="0.01" step="0.01" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="min-w-0 flex-1 rounded-r-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
            </div>
            <input required type="date" value={form.paidAt} onChange={(e) => setForm({ ...form, paidAt: e.target.value })} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
            <input placeholder="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
            <input placeholder="Reference / receipt ID" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 xl:col-span-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> Recurring payment</label>
          <button disabled={submitting} type="submit" className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">{submitting ? "Recording..." : "Record payment"}</button>
        </form>
      )}

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="space-y-3">
            <div className="flex items-center gap-2"><ArrowDownLeft size={18} className="text-emerald-400" /><h4 className="font-semibold text-white">Client invoices</h4></div>
            {invoices.length === 0 ? <Empty label="No invoices are attached to this project." /> : invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><div className="font-semibold text-white">{invoice.invoiceNumber || "Invoice"}</div><div className="mt-1 text-xs text-gray-500">Issued {formatDate(invoice.issuedAt)} · Due {formatDate(invoice.dueDate)}</div></div>
                  <div className="text-right"><div className="font-bold text-emerald-400">{money(Number(invoice.amount), invoice.currency)}</div><span className={`mt-2 inline-block rounded border px-2 py-0.5 text-[10px] ${statusColor(invoice.status)}`}>{invoice.status}</span></div>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2"><ArrowUpRight size={18} className="text-rose-400" /><h4 className="font-semibold text-white">Project payments made</h4></div>
            {expenses.length === 0 ? <Empty label="No project costs have been recorded." /> : expenses.map((expense) => (
              <div key={expense.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><div className="flex items-center gap-2 font-semibold text-white"><ReceiptText size={15} className="text-gray-500" />{expense.vendor}</div><div className="mt-1 text-xs text-gray-500">{expense.category} · {formatDate(expense.paidAt)}{expense.reference ? ` · ${expense.reference}` : ""}</div>{expense.description && <p className="mt-2 text-sm text-gray-400">{expense.description}</p>}</div>
                  <div className="flex items-start gap-2"><div className="whitespace-nowrap font-bold text-rose-400">{money(Number(expense.amount), expense.currency)}</div><button onClick={() => deleteExpense(expense.id)} className="rounded p-1.5 text-gray-600 hover:bg-red-500/10 hover:text-red-400" title="Delete payment"><Trash2 size={14} /></button></div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-lg border border-dashed border-white/10 px-5 py-10 text-center text-sm text-gray-600">{label}</div>;
}
