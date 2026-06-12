"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { saveSeoSettings, type SeoResult } from "@/app/(dashboard)/admin/seo/actions";

const inp = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar e aplicar
    </button>
  );
}

export function SeoEditor({ settings }: { settings: { title: string; description: string; keywords: string; og_image: string } }) {
  const [state, action] = useActionState<SeoResult, FormData>(saveSeoSettings, {});
  const [title, setTitle] = useState(settings.title);
  const [desc, setDesc] = useState(settings.description);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-sm font-medium">
          Título (meta title)
          <span className={`text-xs ${title.length >= 10 && title.length <= 65 ? "text-green" : "text-amber-400"}`}>{title.length}/65</span>
        </label>
        <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inp} />
      </div>
      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-sm font-medium">
          Meta description
          <span className={`text-xs ${desc.length >= 70 && desc.length <= 165 ? "text-green" : "text-amber-400"}`}>{desc.length}/165</span>
        </label>
        <textarea name="description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={inp} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Palavras-chave</label>
          <input name="keywords" defaultValue={settings.keywords} className={inp} placeholder="python, curso..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Imagem de compartilhamento (OG)</label>
          <input name="og_image" defaultValue={settings.og_image} className={inp} placeholder="/og-image.png ou URL" />
        </div>
      </div>

      {/* preview do Google */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <p className="mb-1 text-xs text-text-secondary">Prévia no Google:</p>
        <p className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Título"}</p>
        <p className="text-[12px] text-green">www.pytrack.com.br</p>
        <p className="text-[12px] text-text-secondary line-clamp-2">{desc || "Descrição"}</p>
      </div>

      {state.error && <p className="flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> {state.error}</p>}
      {state.success && <p className="flex items-center gap-1.5 text-sm text-green"><CheckCircle2 className="h-4 w-4" /> {state.success}</p>}
      <SaveBtn />
    </form>
  );
}
