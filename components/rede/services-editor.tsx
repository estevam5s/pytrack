"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Settings2 } from "lucide-react";
import { saveServices } from "@/lib/community/profile-actions";

export function ServicesEditor({ initial }: { initial: Record<string, unknown> | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await saveServices({
      is_open: fd.get("is_open") === "on",
      overview: fd.get("overview")?.toString() ?? "",
      services: fd.get("services")?.toString() ?? "",
      affiliated_company: fd.get("affiliated_company")?.toString() ?? "",
      affiliated_company_logo: fd.get("affiliated_company_logo")?.toString() ?? "",
      media_urls: fd.get("media_urls")?.toString() ?? "",
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary/40">
        <Settings2 className="h-4 w-4 text-primary-light" /> Configurar página de serviços
      </button>
    );
  }

  const s = initial ?? {};
  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-primary/30 bg-card p-6">
      <h2 className="font-bold">Configurar serviços</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_open" defaultChecked={Boolean(s.is_open)} className="h-4 w-4 accent-[rgb(var(--primary))]" /> Aberto a propostas
      </label>
      <Field name="overview" label="Visão geral" textarea def={s.overview as string} />
      <Field name="services" label="Serviços prestados (separados por vírgula)" def={(s.services as string[])?.join(", ")} ph="Desenvolvimento Python, APIs, Web scraping…" />
      <Field name="affiliated_company" label="Empresa afiliada" def={s.affiliated_company as string} />
      <Field name="affiliated_company_logo" label="Logo da empresa (URL)" def={s.affiliated_company_logo as string} />
      <Field name="media_urls" label="Mídia (URLs, uma por linha)" textarea def={(s.media_urls as string[])?.join("\n")} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar</button>
      </div>
    </form>
  );
}

function Field({ name, label, def, ph, textarea }: { name: string; label: string; def?: string; ph?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={def} rows={3} placeholder={ph} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      ) : (
        <input name={name} defaultValue={def} placeholder={ph} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      )}
    </div>
  );
}
