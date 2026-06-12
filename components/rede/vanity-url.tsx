"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Pencil, Check, Loader2 } from "lucide-react";
import { saveVanityUrl } from "@/lib/community/profile-actions";

export function VanityUrl({ current }: { current: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(current);

  async function save() {
    setSaving(true); setError(null);
    const res = await saveVanityUrl(value);
    setSaving(false);
    if (res.error) setError(res.error);
    else { setSlug(res.slug ?? value); setEditing(false); router.refresh(); }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold"><Link2 className="h-4 w-4 text-primary-light" /> Perfil público e URL</h2>
        {!editing && <button onClick={() => setEditing(true)} className="rounded p-1 text-text-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>}
      </div>
      {editing ? (
        <div className="mt-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
            <span className="text-text-secondary">www.pytrack.com.br/in/</span>
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="seu-nome" className="flex-1 bg-transparent outline-none" />
          </div>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <p className="mt-1 text-[10px] text-text-secondary">Use 3–40 caracteres: letras, números e hífens.</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setEditing(false)} className="rounded-lg border border-border px-3 py-1.5 text-xs">Cancelar</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar</button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-text-secondary">{slug ? `www.pytrack.com.br/in/${slug}` : "Defina uma URL pública profissional para o seu perfil."}</p>
      )}
    </div>
  );
}
