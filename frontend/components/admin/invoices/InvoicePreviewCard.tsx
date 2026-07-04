import React from "react";
import { formatDate, SerializedDate } from "@/lib/firestore";

export interface PreviewItem {
  type: "PRODUCT" | "SERVICE";
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface PreviewBankAccount {
  name?: string;
  accountName?: string;
  accountNumber?: string;
  branch?: string;
}

export interface PreviewCompany {
  name?: string;
  address?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  bankPrimary?: PreviewBankAccount;
  bankSecondary?: PreviewBankAccount;
  terms?: string;
  warranty?: string;
}

export interface InvoicePreviewData {
  invoiceNumber?: string;
  status?: string;
  currency: string;
  items: PreviewItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  amount: number;
  notes?: string;
  issuedAt?: SerializedDate;
  dueDate?: SerializedDate;
  client?: { companyName?: string; contactName?: string; email?: string } | null;
  project?: { projectName?: string } | null;
  company?: PreviewCompany;
  includeWarranty?: boolean;
}

const DEFAULT_PRIMARY = "#22D3EE";
const DEFAULT_SECONDARY = "#1688FF";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "#9CA3AF1F", text: "#6B7280" },
  SENT: { bg: "#1688FF1F", text: "#1688FF" },
  PAID: { bg: "#10B9811F", text: "#0D9668" },
  OVERDUE: { bg: "#EF44441F", text: "#DC2626" },
  VOID: { bg: "#9CA3AF1F", text: "#6B7280" },
};

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

/**
 * Branded, A4-styled invoice document — used for the live preview while
 * creating/editing an invoice and the admin detail page. Colors are pulled
 * from Site Settings (primaryColor/secondaryColor) so changing the brand
 * theme there updates every invoice automatically.
 */
export default function InvoicePreviewCard({ data }: { data: InvoicePreviewData }) {
  const primary = data.company?.primaryColor || DEFAULT_PRIMARY;
  const secondary = data.company?.secondaryColor || DEFAULT_SECONDARY;
  const banks = [data.company?.bankPrimary, data.company?.bankSecondary].filter((b) => b?.accountNumber);
  const status = (data.status || "DRAFT").toUpperCase();
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  const showWarranty = data.includeWarranty !== false && data.company?.warranty;

  const eyebrow: React.CSSProperties = { color: primary };

  return (
    <div className="mx-auto w-full max-w-[794px] rounded-2xl bg-[#e9edf3] p-3 sm:p-6">
      <div className="overflow-hidden rounded-xl bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.35)]">
        {/* Brand gradient bar */}
        <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }} />

        <div className="flex items-start justify-between p-8 pb-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.company?.logoUrl || "/logo.png"} alt={data.company?.name || "Company logo"} className="h-20 w-auto max-w-[240px] object-contain object-left" />
            <div className="mt-3 space-y-0.5 text-xs text-slate-500">
              <div className="font-semibold text-slate-800">{data.company?.name || "Stormglide.io"}</div>
              <div>{data.company?.address || "Accra, Ghana"}</div>
              {data.company?.email && <div>{data.company.email}</div>}
              {data.company?.taxId && <div>TIN: {data.company.taxId}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold tracking-tight" style={{ color: primary }}>INVOICE</div>
            <div className="mt-1 font-mono text-sm text-slate-500">{data.invoiceNumber || "DRAFT"}</div>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})`, opacity: 0.35 }} />

        <div className="grid grid-cols-1 gap-6 px-8 py-6 sm:grid-cols-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Bill to</div>
            <div className="mt-1.5 text-sm font-semibold text-slate-900">{data.client?.companyName || "—"}</div>
            <div className="text-sm text-slate-500">{data.client?.contactName}</div>
            <div className="text-sm text-slate-500">{data.client?.email}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Details</div>
            <div className="mt-1.5 text-sm text-slate-600">Issued: {formatDate(data.issuedAt, "—")}</div>
            <div className="text-sm text-slate-600">Due: {formatDate(data.dueDate, "—")}</div>
            {data.project?.projectName && <div className="text-sm text-slate-600">Project: {data.project.projectName}</div>}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Status</div>
            <div className="mt-1.5 inline-block rounded-md px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
              {status}
            </div>
          </div>
        </div>

        <div className="px-8">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col style={{ width: "44%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "17%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}>
                <th className="rounded-l-lg py-3 pl-4 pr-3 text-left text-[11px] font-bold uppercase tracking-wide text-white">Item</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-white">Type</th>
                <th className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-white">Qty</th>
                <th className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-white">Unit price</th>
                <th className="rounded-r-lg py-3 pl-3 pr-4 text-right text-[11px] font-bold uppercase tracking-wide text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400">Add a line item to see it here</td>
                </tr>
              ) : (
                data.items.map((item, i) => (
                  <tr key={i} className={`align-top ${i % 2 === 1 ? "bg-slate-50" : ""}`}>
                    <td className="py-3 pl-4 pr-3 text-slate-800">
                      <div className="break-words font-semibold">{item.name || "—"}</div>
                      {item.description && <div className="mt-0.5 break-words text-xs italic text-slate-500">{item.description}</div>}
                    </td>
                    <td className="px-3 py-3 text-slate-500">{item.type === "PRODUCT" ? "Product" : "Service"}</td>
                    <td className="px-3 py-3 text-right text-slate-500">{item.quantity}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right text-slate-500">{money(item.unitPrice, data.currency)}</td>
                    <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right font-medium text-slate-900">{money(item.quantity * item.unitPrice, data.currency)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end px-8 py-6">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{money(data.subtotal, data.currency)}</span></div>
            {data.discountAmount > 0 && (
              <div className="flex justify-between text-slate-500"><span>Discount ({data.discountPercent}%)</span><span>-{money(data.discountAmount, data.currency)}</span></div>
            )}
            {data.taxAmount > 0 && (
              <div className="flex justify-between text-slate-500"><span>Tax ({data.taxPercent}%)</span><span>{money(data.taxAmount, data.currency)}</span></div>
            )}
            <div className="mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-bold" style={{ backgroundColor: `${primary}1A`, color: primary }}>
              <span>Total due</span><span>{money(data.amount, data.currency)}</span>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="border-t border-slate-200 px-8 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Notes</div>
            <p className="mt-1.5 text-sm text-slate-600">{data.notes}</p>
          </div>
        )}

        {banks.length > 0 && (
          <div className="border-t border-slate-200 px-8 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Payment details — bank transfer</div>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {banks.map((bank, i) => (
                <div key={i} className="text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">{bank?.name}</div>
                  <div>Account name: {bank?.accountName}</div>
                  <div>Account number: {bank?.accountNumber}</div>
                  {bank?.branch && <div>Branch: {bank.branch}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.company?.terms && (
          <div className="border-t border-slate-200 px-8 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Terms &amp; conditions</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{data.company.terms}</p>
          </div>
        )}

        {showWarranty && (
          <div className="border-t border-slate-200 px-8 py-5">
            <div className="text-[11px] font-bold uppercase tracking-wide" style={eyebrow}>Warranty</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{data.company?.warranty}</p>
          </div>
        )}

        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }} />
      </div>
    </div>
  );
}
