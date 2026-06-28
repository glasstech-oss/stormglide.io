"use client";

import React, { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "VOID";
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
}

interface CostBreakdown {
  phase: string;
  estimatedCost: number;
  actualCost: number;
  percentComplete: number;
}

export function FinancesTabFull({ projectId }: { projectId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real implementation would fetch from backend
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        invoiceNumber: "INV-2026-001",
        amount: 5000,
        status: "PAID",
        issuedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        invoiceNumber: "INV-2026-002",
        amount: 8500,
        status: "PAID",
        issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now()).toISOString(),
        paidAt: new Date(Date.now()).toISOString(),
      },
      {
        id: "3",
        invoiceNumber: "INV-2026-003",
        amount: 12000,
        status: "SENT",
        issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const mockBreakdown: CostBreakdown[] = [
      { phase: "DISCOVERY", estimatedCost: 3000, actualCost: 2800, percentComplete: 100 },
      { phase: "UI/UX Design", estimatedCost: 8000, actualCost: 8500, percentComplete: 100 },
      { phase: "Backend Architecture", estimatedCost: 12000, actualCost: 11200, percentComplete: 75 },
      { phase: "Staging", estimatedCost: 5000, actualCost: 3500, percentComplete: 50 },
      { phase: "Production", estimatedCost: 4000, actualCost: 0, percentComplete: 0 },
      { phase: "Maintenance", estimatedCost: 2000, actualCost: 0, percentComplete: 0 },
    ];

    setInvoices(mockInvoices);
    setCostBreakdown(mockBreakdown);
    setLoading(false);
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "SENT":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "OVERDUE":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "DRAFT":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = invoices
    .filter((inv) => ["SENT", "OVERDUE"].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalEstimatedCost = costBreakdown.reduce((sum, c) => sum + c.estimatedCost, 0);
  const totalActualCost = costBreakdown.reduce((sum, c) => sum + c.actualCost, 0);
  const costVariance = totalEstimatedCost - totalActualCost;
  const costVariancePercent = ((costVariance / totalEstimatedCost) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Project Finances</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Total Invoiced</div>
          <div className="text-2xl font-bold text-cyan-400">${totalInvoiced.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Amount Paid</div>
          <div className="text-2xl font-bold text-green-400">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Outstanding</div>
          <div className="text-2xl font-bold text-yellow-400">${totalOutstanding.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Cost Variance</div>
          <div
            className={`text-2xl font-bold ${costVariance > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {costVariance > 0 ? "+" : ""}${costVariance.toLocaleString()} ({costVariancePercent}%)
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white">Cost Breakdown by Phase</h4>
          <div className="text-sm text-gray-400">
            Est: ${totalEstimatedCost.toLocaleString()} | Actual: ${totalActualCost.toLocaleString()}
          </div>
        </div>

        <div className="space-y-3">
          {costBreakdown.map((cost, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-medium text-white">{cost.phase}</h5>
                <div className="text-right">
                  <div className="text-sm text-cyan-400 font-mono">
                    ${cost.actualCost.toLocaleString()} / ${cost.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((cost.actualCost / cost.estimatedCost) * 100).toFixed(0)}% of budget
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Completion</span>
                    <span className="text-cyan-400">{cost.percentComplete}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${cost.percentComplete}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="space-y-4">
        <h4 className="font-bold text-white">Invoices</h4>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
            </div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No invoices yet</div>
        ) : (
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h5 className="font-bold text-white">{invoice.invoiceNumber}</h5>
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Issued:</span>{" "}
                        <span className="text-gray-300">{new Date(invoice.issuedAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Due:</span>{" "}
                        <span
                          className={
                            new Date(invoice.dueDate) < new Date() && invoice.status !== "PAID"
                              ? "text-red-400"
                              : "text-gray-300"
                          }
                        >
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {invoice.paidAt && (
                        <div>
                          <span className="text-gray-500">Paid:</span>{" "}
                          <span className="text-green-400">{new Date(invoice.paidAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">${invoice.amount.toLocaleString()}</div>
                    <button className="mt-2 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
