"use client";

import React from "react";
import { FileText, Users, Server, Lock, HardDrive, History } from "lucide-react";

interface TabPlaceholderProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  phase: string;
}

function TabPlaceholder({ title, icon, description, phase }: TabPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 text-center">
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
          {phase}
        </div>
      </div>
    </div>
  );
}

export function FinancesTab() {
  return (
    <TabPlaceholder
      title="Project Finances"
      icon={<FileText size={20} className="text-blue-400" />}
      description="Invoices, costs breakdown, and budget tracking by phase"
      phase="Coming in Phase 3"
    />
  );
}

export function TeamTab() {
  return (
    <TabPlaceholder
      title="Team Resources"
      icon={<Users size={20} className="text-purple-400" />}
      description="Team members, roles, assignments, and capacity utilization"
      phase="Coming in Phase 3"
    />
  );
}

export function HostingTab() {
  return (
    <TabPlaceholder
      title="Hosting & Infrastructure"
      icon={<Server size={20} className="text-orange-400" />}
      description="Uptime monitoring, performance metrics, and Lighthouse scores"
      phase="Coming in Phase 3"
    />
  );
}

export function CredentialsTab() {
  return (
    <TabPlaceholder
      title="Credentials & Access"
      icon={<Lock size={20} className="text-red-400" />}
      description="Secure encrypted storage for hosting, database, and FTP credentials"
      phase="Coming in Phase 3"
    />
  );
}

export function BackupsTab() {
  return (
    <TabPlaceholder
      title="Backups & Security"
      icon={<HardDrive size={20} className="text-cyan-400" />}
      description="Backup schedule, security scanning, and malware protection"
      phase="Coming in Phase 3"
    />
  );
}

export function HistoryTab() {
  return (
    <TabPlaceholder
      title="Change History"
      icon={<History size={20} className="text-gray-400" />}
      description="Audit trail of all changes, phase transitions, and team updates"
      phase="Coming in Phase 3"
    />
  );
}
