"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { ProjectsAPI } from "@/lib/api";
import { formatDate, SerializedDate } from "@/lib/firestore";

interface TimeEntry {
  id: string;
  description: string;
  minutes: number;
  billable: boolean;
  loggedBy: string;
  loggedAt: SerializedDate;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function TimeTrackingTab({ projectId }: { projectId: string }) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: "", hours: "", minutes: "", billable: true });

  useEffect(() => {
    fetchEntries();
  }, [projectId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await ProjectsAPI.getTimeEntries(projectId);
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch time entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = (parseInt(formData.hours || "0", 10) * 60) + parseInt(formData.minutes || "0", 10);
    if (!formData.description.trim() || totalMinutes <= 0) return;
    try {
      await ProjectsAPI.logTime({ projectId, description: formData.description.trim(), minutes: totalMinutes, billable: formData.billable });
      setFormData({ description: "", hours: "", minutes: "", billable: true });
      setShowForm(false);
      await fetchEntries();
    } catch (error) {
      console.error("Failed to log time:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ProjectsAPI.deleteTimeEntry(id);
      await fetchEntries();
    } catch (error) {
      console.error("Failed to delete time entry:", error);
    }
  };

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
  const billableMinutes = entries.filter((e) => e.billable).reduce((sum, e) => sum + e.minutes, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Time Logged</h3>
          <p className="text-sm text-gray-400 mt-1">
            Total: <span className="text-cyan-400 font-mono">{formatDuration(totalMinutes)}</span>
            {" · "}Billable: <span className="text-emerald-400 font-mono">{formatDuration(billableMinutes)}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} /> Log Time
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <input
            type="text"
            placeholder="What did you work on?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number" min="0" placeholder="Hours"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="number" min="0" max="59" placeholder="Minutes"
              value={formData.minutes}
              onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="billable"
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="billable" className="text-sm text-gray-400">Billable</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all">
              Log entry
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-all">
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
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
          <Clock size={20} />
          <p>No time logged yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{entry.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(entry.loggedAt)} · {entry.loggedBy}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {entry.billable && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Billable</span>}
                <span className="text-sm font-mono text-cyan-400">{formatDuration(entry.minutes)}</span>
                <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
