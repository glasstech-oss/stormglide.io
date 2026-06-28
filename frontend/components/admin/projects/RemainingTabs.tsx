"use client";

import React, { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, RefreshCw, Clock, User } from "lucide-react";

// ==================== TEAM TAB ====================
export function TeamTabFull({ projectId }: { projectId: string }) {
  const [team, setTeam] = useState([
    { id: "1", name: "John Doe", role: "Lead Developer", capacity: 80 },
    { id: "2", name: "Jane Smith", role: "UI/UX Designer", capacity: 60 },
    { id: "3", name: "Mike Johnson", role: "DevOps Engineer", capacity: 40 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", capacity: 50 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setTeam([...team, { id: Date.now().toString(), ...formData }]);
    setFormData({ name: "", role: "", capacity: 50 });
    setShowForm(false);
  };

  const totalCapacity = team.reduce((sum, m) => sum + m.capacity, 0);
  const avgCapacity = (totalCapacity / team.length).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Project Team</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            required
          />
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Capacity Allocation (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-right text-sm text-cyan-400 mt-1">{formData.capacity}%</div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-all">
              Add Member
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Team Size</div>
          <div className="text-2xl font-bold text-cyan-400">{team.length}</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Total Allocated</div>
          <div className="text-2xl font-bold text-purple-400">{totalCapacity}%</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Avg Capacity</div>
          <div className="text-2xl font-bold text-green-400">{avgCapacity}%</div>
        </div>
      </div>

      <div className="space-y-3">
        {team.map((member) => (
          <div key={member.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <User size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{member.name}</h4>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Capacity</span>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${member.capacity}%` }} />
              </div>
              <span className="text-cyan-400 font-mono">{member.capacity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== HOSTING TAB ====================
export function HostingTabFull({ projectId }: { projectId: string }) {
  const [hosting] = useState({
    provider: "Vercel",
    uptime: 99.95,
    latency: 145,
    lighthouse: 92,
    renewalDate: "2026-12-31",
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Hosting & Infrastructure</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Hosting Provider</div>
          <div className="text-2xl font-bold text-cyan-400">{hosting.provider}</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Current Uptime</div>
          <div className="text-2xl font-bold text-green-400">{hosting.uptime}%</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Avg Response Time</div>
          <div className="text-2xl font-bold text-purple-400">{hosting.latency}ms</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Lighthouse Score</div>
          <div className="text-2xl font-bold text-yellow-400">{hosting.lighthouse}/100</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 space-y-4">
        <h4 className="font-bold text-white">Performance Metrics (Last 30 Days)</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Uptime</span>
              <span className="text-green-400">99.95%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "99.95%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Performance Score</span>
              <span className="text-cyan-400">92%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: "92%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CREDENTIALS TAB ====================
export function CredentialsTabFull({ projectId }: { projectId: string }) {
  const [credentials] = useState([
    { id: "1", name: "Hosting Panel", type: "Web Panel", lastAccessed: "2026-06-27" },
    { id: "2", name: "Database", type: "Database Login", lastAccessed: "2026-06-25" },
    { id: "3", name: "FTP Access", type: "FTP Credentials", lastAccessed: "2026-06-20" },
  ]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Credentials & Access</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm transition-all">
          <Plus size={16} />
          Add Credential
        </button>
      </div>

      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <p className="text-sm text-red-400">⚠️ All credentials are encrypted and audit-logged. Access is recorded for security.</p>
      </div>

      <div className="space-y-3">
        {credentials.map((cred) => (
          <div key={cred.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-white">{cred.name}</h4>
                <p className="text-xs text-gray-500">{cred.type}</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Last accessed: {cred.lastAccessed}</div>
              <button
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    [cred.id]: !showPassword[cred.id],
                  })
                }
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                {showPassword[cred.id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== BACKUPS TAB ====================
export function BackupsTabFull({ projectId }: { projectId: string }) {
  const [backups] = useState([
    { id: "1", date: "2026-06-28", size: "2.4 GB", status: "completed" },
    { id: "2", date: "2026-06-27", size: "2.3 GB", status: "completed" },
    { id: "3", date: "2026-06-26", size: "2.2 GB", status: "completed" },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Backups & Security</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Last Backup</div>
          <div className="text-lg font-bold text-cyan-400">Today, 14:23</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Backup Schedule</div>
          <div className="text-lg font-bold text-purple-400">Daily</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Retention Days</div>
          <div className="text-lg font-bold text-green-400">30</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white">Recent Backups</h4>
          <button className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-xs transition-all">
            <RefreshCw size={14} />
            Backup Now
          </button>
        </div>

        <div className="space-y-2">
          {backups.map((backup) => (
            <div key={backup.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="font-medium text-white">{backup.date}</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">Completed</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{backup.size}</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                <RefreshCw size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <p className="text-sm text-cyan-400">
          ℹ️ Security Scan Status: <span className="font-bold">Safe (Last scan: 2026-06-28)</span>
        </p>
      </div>
    </div>
  );
}

// ==================== HISTORY TAB ====================
export function HistoryTabFull({ projectId }: { projectId: string }) {
  const [history] = useState([
    { id: "1", action: "Phase advanced", entity: "STAGING → PRODUCTION", timestamp: "2026-06-28 14:30", by: "john.doe" },
    { id: "2", action: "Completion updated", entity: "85% → 90%", timestamp: "2026-06-28 10:15", by: "jane.smith" },
    { id: "3", action: "Team member added", entity: "Mike Johnson", timestamp: "2026-06-27 09:45", by: "john.doe" },
    { id: "4", action: "Domain renewed", entity: "example.com", timestamp: "2026-06-25 11:20", by: "system" },
    { id: "5", action: "Invoice generated", entity: "INV-2026-003", timestamp: "2026-06-20 14:00", by: "jane.smith" },
  ]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Change History</h3>

      <div className="space-y-2">
        {history.map((entry) => (
          <div key={entry.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-white">{entry.action}</h4>
                <p className="text-sm text-cyan-400 font-mono mt-1">{entry.entity}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{entry.timestamp}</div>
                <div className="text-xs text-gray-400 mt-1">by {entry.by}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
