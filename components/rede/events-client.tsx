"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, CalendarPlus, Check, Users, Trash2 } from "lucide-react";
import { createEvent, toggleAttend, deleteEvent } from "@/lib/community/events-actions";

export function CreateEventButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createEvent({
      title: fd.get("title")?.toString() ?? "",
      description: fd.get("description")?.toString(),
      cover_url: fd.get("cover_url")?.toString(),
      location: fd.get("location")?.toString(),
      online_url: fd.get("online_url")?.toString(),
      is_online: fd.get("is_online") === "on",
      starts_at: fd.get("starts_at")?.toString() ?? "",
      ends_at: fd.get("ends_at")?.toString() || undefined,
    });
    setSaving(false);
    if (res.error) setError(res.error);
    else { setOpen(false); router.refresh(); }
  }

  if (!open) return <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Criar evento</button>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold"><CalendarPlus className="h-5 w-5 text-primary-light" /> Criar evento</h2>
        <In name="title" label="Título *" required />
        <div><label className="mb-1 block text-xs font-medium text-text-secondary">Descrição</label><textarea name="description" rows={3} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" /></div>
        <In name="cover_url" label="Imagem de capa (URL)" />
        <div className="grid grid-cols-2 gap-3">
          <In name="starts_at" label="Início *" type="datetime-local" required />
          <In name="ends_at" label="Término" type="datetime-local" />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_online" defaultChecked className="h-4 w-4 accent-[rgb(var(--primary))]" /> Evento online</label>
        <In name="online_url" label="Link (online)" />
        <In name="location" label="Local (presencial)" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Publicar</button>
        </div>
      </form>
    </div>
  );
}

function In({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      <input name={name} type={type} required={required} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" /></div>
  );
}

export function AttendButton({ eventId, attending, count }: { eventId: string; attending: boolean; count: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function toggle() { setLoading(true); await toggleAttend(eventId); setLoading(false); router.refresh(); }
  return (
    <button onClick={toggle} disabled={loading} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${attending ? "bg-primary/15 text-primary-light" : "border border-border hover:border-primary/40"}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : attending ? <Check className="h-4 w-4" /> : <Users className="h-4 w-4" />}
      {attending ? "Participando" : "Participar"} · {count}
    </button>
  );
}

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  async function del() { if (confirm("Excluir evento?")) { await deleteEvent(eventId); router.refresh(); } }
  return <button onClick={del} className="rounded p-1 text-text-secondary hover:text-red-400"><Trash2 className="h-4 w-4" /></button>;
}
