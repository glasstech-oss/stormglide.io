"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { CrmAPI, ProjectsAPI } from "@/lib/api";

interface ClientOption {
  id: string;
  companyName?: string;
  contactName?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ clientId: "", projectName: "", description: "", estimatedEnd: "" });

  useEffect(() => {
    CrmAPI.getClients()
      .then((data) => setClients(Array.isArray(data) ? data : data?.clients || []))
      .catch(() => setError("Clients could not be loaded."))
      .finally(() => setLoadingClients(false));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const project = await ProjectsAPI.create(form);
      router.push(`/admin/projects/${project.id}`);
    } catch (requestError) {
      console.error("Failed to create project:", requestError);
      setError("The project could not be created. Check the client and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/admin/projects" className="mt-1 rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create project workspace</h1>
          <p className="mt-1 text-gray-400">Keep delivery, infrastructure, recurring services, and payments under one client project.</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <div className="font-semibold text-white">Project identity</div>
            <div className="text-xs text-gray-500">A client is required before a project can be created.</div>
          </div>
        </div>

        <label className="block space-y-2 text-sm text-gray-400">
          Client
          <select
            required
            disabled={loadingClients}
            value={form.clientId}
            onChange={(event) => setForm({ ...form, clientId: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-[#080f1d] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
          >
            <option value="">{loadingClients ? "Loading clients..." : "Select a client"}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.companyName || client.contactName || client.id}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-gray-400">
          Project name
          <input
            required
            value={form.projectName}
            onChange={(event) => setForm({ ...form, projectName: event.target.value })}
            placeholder="e.g. Acme Operations Portal"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
          />
        </label>

        <label className="block space-y-2 text-sm text-gray-400">
          Scope
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="What is being built and what business outcome should it produce?"
            rows={5}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/50"
          />
        </label>

        <label className="block space-y-2 text-sm text-gray-400">
          Target completion date
          <input
            type="date"
            value={form.estimatedEnd}
            onChange={(event) => setForm({ ...form, estimatedEnd: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-500/50"
          />
        </label>

        {clients.length === 0 && !loadingClients && (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            No clients exist yet. Create one from Entities before opening a project workspace.
          </p>
        )}
        {error && <p className="text-sm text-red-300">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <Link href="/admin/projects" className="rounded-lg px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">Cancel</Link>
          <button
            type="submit"
            disabled={submitting || loadingClients || clients.length === 0}
            className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create workspace"}
          </button>
        </div>
      </form>
    </div>
  );
}
