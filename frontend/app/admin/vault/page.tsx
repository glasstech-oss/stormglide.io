"use client";

import React from "react";
import ContractVaultModule from "@/components/admin/modules/ContractVaultModule";

export default function VaultPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                <p className="mt-1 text-gray-400">Contracts, NDAs, proposals, and briefs across every client.</p>
            </div>
            <ContractVaultModule />
        </div>
    );
}
