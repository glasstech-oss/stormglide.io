"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, TrendingDown } from "lucide-react";

interface Alert {
  id: string;
  type: "DOMAIN_RENEWAL" | "SUBSCRIPTION_RENEWAL" | "INVOICE_OVERDUE" | "PROJECT_BEHIND";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  projectId: string;
  projectName?: string;
  daysUntilExpiry?: number;
  resolved: boolean;
}

export function AlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with real API when ready
      const mockAlerts: Alert[] = [
        {
          id: "1",
          type: "DOMAIN_RENEWAL",
          severity: "CRITICAL",
          title: "Domain expires in 3 days",
          description: "example.com expires 2026-07-01",
          projectId: "proj1",
          projectName: "Apex Logistics",
          daysUntilExpiry: 3,
          resolved: false,
        },
        {
          id: "2",
          type: "SUBSCRIPTION_RENEWAL",
          severity: "WARNING",
          title: "AWS subscription renews in 8 days",
          description: "$450/month",
          projectId: "proj2",
          projectName: "Nexus-HRM",
          daysUntilExpiry: 8,
          resolved: false,
        },
        {
          id: "3",
          type: "PROJECT_BEHIND",
          severity: "WARNING",
          title: "Project at risk",
          description: "Apex Logistics - Behind schedule",
          projectId: "proj1",
          projectName: "Apex Logistics",
          resolved: false,
        },
        {
          id: "4",
          type: "INVOICE_OVERDUE",
          severity: "CRITICAL",
          title: "Invoice overdue",
          description: "INV-2026-002 due 3 days ago",
          projectId: "proj3",
          projectName: "Cargoscan",
          resolved: false,
        },
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL" && !a.resolved);
  const warningAlerts = alerts.filter((a) => a.severity === "WARNING" && !a.resolved);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "WARNING":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertCircle size={18} className="text-red-400" />;
      case "WARNING":
        return <Clock size={18} className="text-yellow-400" />;
      default:
        return <CheckCircle2 size={18} className="text-blue-400" />;
    }
  };

  const displayAlerts = [...criticalAlerts, ...warningAlerts].slice(0, 6);

  return (
    <div className="p-8 rounded-3xl bg-[#111827] border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <TrendingDown size={20} className="text-red-400" />
          <h3 className="text-lg font-bold">Critical Alerts</h3>
        </div>
        <Link
          href="/admin/dashboard?tab=alerts"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
          </div>
        </div>
      ) : displayAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-green-400" />
          <p>All systems healthy</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <Link
              key={alert.id}
              href={`/admin/projects/${alert.projectId}`}
              className={`p-4 rounded-lg border flex justify-between items-start hover:border-opacity-100 transition-all cursor-pointer ${getSeverityColor(
                alert.severity
              )}`}
            >
              <div className="flex items-start gap-3 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  <p className="text-xs opacity-75 mt-1">{alert.description}</p>
                  <p className="text-xs opacity-50 mt-2">{alert.projectName}</p>
                </div>
              </div>
              {alert.daysUntilExpiry !== undefined && (
                <div className="text-right ml-4">
                  <div className="text-sm font-bold">{alert.daysUntilExpiry}d</div>
                  <div className="text-xs opacity-75">left</div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {criticalAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={16} />
            <span className="font-medium">{criticalAlerts.length} critical issue{criticalAlerts.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}
