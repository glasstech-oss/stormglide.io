"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Pencil, Plus, Trash2, Upload, UserSquare2, X } from "lucide-react";
import { TeamAPI, TeamMember } from "@/lib/api";

const MAX_PHOTO_FILE_BYTES = 500 * 1024;

const emptyForm = (): Partial<TeamMember> => ({
  name: "",
  title: "",
  bio: "",
  linkedinUrl: "",
  photoDataUri: "",
  order: 0,
});

function PhotoUpload({ value, onChange, onClear }: { value?: string; onChange: (dataUri: string) => void; onClear: () => void }) {
  const [error, setError] = useState("");
  const inputId = "team-photo-upload-input";

  const handleFile = (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) {
      setError("Please choose a PNG or JPEG image.");
      return;
    }
    if (file.size > MAX_PHOTO_FILE_BYTES) {
      setError(`That file is too large (${Math.round(file.size / 1024)}KB). Keep it under ${MAX_PHOTO_FILE_BYTES / 1024}KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.onerror = () => setError("Could not read that file. Try again.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Photo</label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Team member preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-gray-500" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <label
              htmlFor={inputId}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition hover:border-cyan-500/50"
            >
              <Upload size={15} /> Choose file
            </label>
            <input id={inputId} type="file" accept="image/png,image/jpeg" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
            {value && (
              <button
                type="button"
                onClick={() => { onClear(); setError(""); }}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
              >
                <X size={14} /> Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setMembers(await TeamAPI.list());
    } catch (err) {
      console.error("Failed to load team members:", err);
      setError("Could not load team members.");
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm(), order: members.length });
    setShowForm(true);
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm(member);
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name?.trim()) {
      setError("A name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await TeamAPI.update(editingId, form);
      } else {
        await TeamAPI.create(form);
      }
      await load();
      cancel();
    } catch (err) {
      console.error("Failed to save team member:", err);
      setError("Could not save this team member.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this team member from the About page?")) return;
    try {
      await TeamAPI.remove(id);
      await load();
    } catch (err) {
      console.error("Failed to remove team member:", err);
      setError("Could not remove this team member.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About page team</h1>
          <p className="mt-1 text-gray-400">Who shows up on the public About page — name, title, photo, and a short bio.</p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Plus size={16} /> Add team member
          </button>
        )}
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      {showForm && (
        <form onSubmit={save} className="space-y-5 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold">{editingId ? "Edit team member" : "New team member"}</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Name</label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="e.g. John Sedofia Dakey"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Title</label>
              <input
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="e.g. Founder & Lead Engineer"
              />
            </div>
          </div>

          <PhotoUpload
            value={form.photoDataUri}
            onChange={(dataUri) => setForm({ ...form, photoDataUri: dataUri })}
            onClear={() => setForm({ ...form, photoDataUri: "" })}
          />

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">Short bio</label>
            <textarea
              value={form.bio || ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="A sentence or two — background, focus, what they own on the team."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase">LinkedIn URL (optional)</label>
            <input
              value={form.linkedinUrl || ""}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : null}
              {editingId ? "Save changes" : "Add member"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin text-cyan-400" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-16 text-center text-gray-500">
          <UserSquare2 size={28} />
          <p>No team members yet. The public About page will show a generic placeholder until you add one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                {member.photoDataUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photoDataUri} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <UserSquare2 size={20} className="text-gray-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">{member.name}</div>
                <div className="text-sm text-gray-400">{member.title || "—"}</div>
              </div>
              <button
                onClick={() => startEdit(member)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => remove(member.id)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
