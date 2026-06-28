"use client";

import React from "react";
import { CheckSquare } from "lucide-react";

export function DeliverablesTab({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare size={20} className="text-green-400" />
        <h3 className="text-lg font-bold">Deliverables Checklist</h3>
      </div>

      <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 text-center">
        <p className="text-gray-400 mb-4">Track deliverables across project phases</p>
        <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Coming in Phase 3
        </div>
      </div>
    </div>
  );
}
