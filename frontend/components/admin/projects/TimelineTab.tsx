"use client";

import React from "react";
import { Clock } from "lucide-react";

export function TimelineTab({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-cyan-400" />
        <h3 className="text-lg font-bold">Project Timeline</h3>
      </div>

      <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 text-center">
        <p className="text-gray-400 mb-4">Timeline visualization and milestone tracking</p>
        <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm">
          Coming in Phase 3
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-cyan-400 mb-2">6</div>
          <div className="text-xs text-gray-500">Project Phases</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-purple-400 mb-2">0</div>
          <div className="text-xs text-gray-500">Milestones</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400 mb-2">0%</div>
          <div className="text-xs text-gray-500">Timeline Adherence</div>
        </div>
      </div>
    </div>
  );
}
