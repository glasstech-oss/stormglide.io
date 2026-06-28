"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface Domain {
  id: string;
  domainName: string;
  registrar?: string;
  expirationDate?: string;
  sslExpirationDate?: string;
  autoRenew: boolean;
  cost?: number;
  status: string;
}

export function DomainsTab({ projectId }: { projectId: string }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    domainName: "",
    registrar: "",
    expirationDate: "",
    sslCertProvider: "",
    sslExpirationDate: "",
    autoRenew: true,
    cost: "",
  });

  useEffect(() => {
    fetchDomains();
  }, [projectId]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/domains?projectId=${projectId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setDomains(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          ...formData,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
          sslExpirationDate: formData.sslExpirationDate ? new Date(formData.sslExpirationDate) : undefined,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setFormData({
          domainName: "",
          registrar: "",
          expirationDate: "",
          sslCertProvider: "",
          sslExpirationDate: "",
          autoRenew: true,
          cost: "",
        });
        setShowForm(false);
        fetchDomains();
      }
    } catch (error) {
      console.error("Failed to add domain:", error);
    }
  };

  const handleRenew = async (domainId: string) => {
    try {
      await fetch(`/api/v1/domains/${domainId}/renew`, {
        method: "PUT",
        credentials: "include",
      });
      fetchDomains();
    } catch (error) {
      console.error("Failed to renew domain:", error);
    }
  };

  const handleDelete = async (domainId: string) => {
    try {
      await fetch(`/api/v1/domains/${domainId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchDomains();
    } catch (error) {
      console.error("Failed to delete domain:", error);
    }
  };

  const getDaysUntilExpiry = (date: string | undefined) => {
    if (!date) return null;
    const days = Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getExpiryColor = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days < 7) return "text-red-400";
    if (days < 30) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Domains & SSL Certificates</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} />
          Add Domain
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddDomain} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Domain Name"
              value={formData.domainName}
              onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
              required
            />
            <input
              type="text"
              placeholder="Registrar (e.g., GoDaddy)"
              value={formData.registrar}
              onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="date"
              placeholder="Domain Expiration"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="text"
              placeholder="SSL Provider (e.g., Let's Encrypt)"
              value={formData.sslCertProvider}
              onChange={(e) => setFormData({ ...formData, sslCertProvider: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="date"
              placeholder="SSL Expiration"
              value={formData.sslExpirationDate}
              onChange={(e) => setFormData({ ...formData, sslExpirationDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Annual Cost"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
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
              Add Domain
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
      ) : domains.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No domains configured yet</div>
      ) : (
        <div className="space-y-3">
          {domains.map((domain) => {
            const expiryDays = getDaysUntilExpiry(domain.expirationDate);
            const sslExpiryDays = getDaysUntilExpiry(domain.sslExpirationDate);

            return (
              <div key={domain.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{domain.domainName}</h4>
                    {domain.registrar && <p className="text-xs text-gray-500">{domain.registrar}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRenew(domain.id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-all"
                      title="Renew domain"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(domain.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Domain Expiration</div>
                    {domain.expirationDate ? (
                      <div className="flex items-center gap-2">
                        <span className={getExpiryColor(expiryDays)}>
                          {expiryDays !== null && expiryDays < 30 ? (
                            expiryDays < 7 ? (
                              <AlertCircle size={14} className="inline" />
                            ) : (
                              <AlertCircle size={14} className="inline" />
                            )
                          ) : (
                            <CheckCircle2 size={14} className="inline" />
                          )}
                        </span>
                        <span className="text-gray-300">
                          {new Date(domain.expirationDate).toLocaleDateString()}
                          {expiryDays !== null && ` (${expiryDays} days)`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-600">Not configured</span>
                    )}
                  </div>

                  <div>
                    <div className="text-gray-500 mb-1">SSL Certificate</div>
                    {domain.sslExpirationDate ? (
                      <div className="flex items-center gap-2">
                        <span className={getExpiryColor(sslExpiryDays)}>
                          {sslExpiryDays !== null && sslExpiryDays < 30 ? (
                            <AlertCircle size={14} className="inline" />
                          ) : (
                            <CheckCircle2 size={14} className="inline" />
                          )}
                        </span>
                        <span className="text-gray-300">
                          {new Date(domain.sslExpirationDate).toLocaleDateString()}
                          {sslExpiryDays !== null && ` (${sslExpiryDays} days)`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-600">Not configured</span>
                    )}
                  </div>
                </div>

                {domain.cost && (
                  <div className="text-xs text-gray-500">
                    Annual Cost: <span className="text-cyan-400">${domain.cost}/year</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
