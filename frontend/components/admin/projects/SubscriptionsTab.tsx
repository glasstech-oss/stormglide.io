"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate, toDate } from "@/lib/firestore";

interface Subscription {
  id: string;
  serviceName: string;
  monthlyCost: number;
  billingFrequency: "MONTHLY" | "ANNUAL" | "ONE_TIME";
  renewalDate?: SerializedDate;
  autoRenew: boolean;
  notes?: string;
}

export function SubscriptionsTab({ projectId }: { projectId: string }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(0);
  const [formData, setFormData] = useState({
    serviceName: "",
    monthlyCost: "",
    billingFrequency: "MONTHLY",
    renewalDate: "",
    autoRenew: true,
    notes: "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [projectId]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await ProjectsAPI.getSubscriptions(projectId);
      setSubscriptions(Array.isArray(data) ? data : []);

      // Calculate total monthly cost
      const total = (Array.isArray(data) ? data : [])
        .filter((sub: Subscription) => sub.billingFrequency === "MONTHLY")
        .reduce((sum: number, sub: Subscription) => sum + parseFloat(sub.monthlyCost as any), 0);
      setTotalMonthlyCost(total);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProjectsAPI.addSubscription({
        projectId,
        ...formData,
        monthlyCost: parseFloat(formData.monthlyCost),
        renewalDate: formData.renewalDate || undefined,
      });
      setFormData({ serviceName: "", monthlyCost: "", billingFrequency: "MONTHLY", renewalDate: "", autoRenew: true, notes: "" });
      setShowForm(false);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Failed to add subscription:", error);
    }
  };

  const handleDelete = async (subscriptionId: string) => {
    try {
      await ProjectsAPI.deleteSubscription(subscriptionId);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    }
  };

  const getDaysUntilRenewal = (value: SerializedDate) => {
    const date = toDate(value);
    if (!date) return null;
    const days = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getRenewalColor = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days < 7) return "text-red-400";
    if (days < 30) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">External Service Subscriptions</h3>
          <p className="text-sm text-gray-400 mt-1">
            Total Monthly: <span className="text-cyan-400 font-mono">${totalMonthlyCost.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubscription} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Service Name (e.g., AWS, DataDog)"
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 col-span-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Monthly Cost"
              value={formData.monthlyCost}
              onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
              required
            />
            <select
              value={formData.billingFrequency}
              onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUAL">Annual</option>
              <option value="ONE_TIME">One-Time</option>
            </select>
            <input
              type="date"
              placeholder="Renewal Date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 col-span-2"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 col-span-2"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="autoRenew" className="text-sm text-gray-400">
              Enable Auto-Renewal
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all"
            >
              Add Service
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full" />
          </div>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No subscriptions configured yet</div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const renewalDays = getDaysUntilRenewal(sub.renewalDate);

            return (
              <div key={sub.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{sub.serviceName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">
                        {sub.billingFrequency}
                      </span>
                      {!sub.autoRenew && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
                          Manual Renewal
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cost</div>
                    <div className="text-sm font-mono text-cyan-400">
                      ${parseFloat(sub.monthlyCost as any).toFixed(2)}/{sub.billingFrequency.toLowerCase()}
                    </div>
                  </div>

                  {sub.renewalDate && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Renewal</div>
                      <div className="flex items-center gap-2">
                        <span className={getRenewalColor(renewalDays)}>
                          {renewalDays !== null && renewalDays < 7 ? (
                            <AlertCircle size={14} className="inline" />
                          ) : (
                            <CheckCircle2 size={14} className="inline" />
                          )}
                        </span>
                        <span className="text-sm text-gray-300">
                          {formatDate(sub.renewalDate)}
                          {renewalDays !== null && ` (${renewalDays} days)`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {sub.notes && <p className="text-xs text-gray-500 italic">{sub.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
