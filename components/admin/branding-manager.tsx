"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link2, Loader2, Check, ImageIcon } from "lucide-react";
import { saveLogoUrl, uploadLogo } from "@/lib/admin-branding-actions";

export function BrandingManager({ current }: { current: string }) {
  const router = useRouter();
  const [url, setUrl] = useState(current.startsWith("http") ? current : "");
  const [preview, setPreview] = useState(current);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  async function saveUrl() {
    setBusy(true); setMsg({});
    const res = await saveLogoUrl(url);
    setBusy(false);
    if (res.error) setMsg({ err: res.error });
    else { setMsg({ ok: "Logo atualizado em todo o site!" }); setPreview(url || "/new-logo.png"); router.refresh(); }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg({});
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadLogo(fd);
    setBusy(false);
    if (res.error) setMsg({ err: res.error });
    else { setMsg({ ok: "Enviado e aplicado!" }); setPreview(res.url!); setUrl(res.url!); router.refresh(); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold"><Upload className="h-4 w-4 text-primary-light" /> Enviar imagem do logo</label>
          <input type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" onChange={onUpload} disabled={busy} className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-light hover:file:bg-primary/20" />
          <p className="mt-1 text-xs text-text-secondary">PNG, SVG, WebP ou JPG (máx. 3MB). Recomendado: quadrado, fundo transparente.</p>
        </div>

        <div className="h-px bg-border" />

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold"><Link2 className="h-4 w-4 text-primary-light" /> Ou cole uma URL</label>
          <div className="flex gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… ou /new-logo.png" className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={saveUrl} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Salvar
            </button>
          </div>
          <button onClick={() => { setUrl(""); saveLogoUrl("").then(() => { setPreview("/new-logo.png"); router.refresh(); }); }} className="mt-2 text-xs text-text-secondary hover:underline">Restaurar logo padrão</button>
        </div>

        {msg.err && <p className="text-sm text-red-400">{msg.err}</p>}
        {msg.ok && <p className="text-sm text-green">{msg.ok}</p>}

        <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-text-secondary">
          💡 O logo se aplica ao <strong>site, plataforma, e-mails e SEO/compartilhamento</strong> automaticamente. As <strong>extensões do VS Code, apps mobile/desktop</strong> usam o logo embutido no build — para trocá-los, é preciso recompilar (já que rodam fora do site).
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-semibold"><ImageIcon className="h-4 w-4 text-primary-light" /> Prévia</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="logo" className="mx-auto h-32 w-32 rounded-2xl border border-border object-contain bg-surface-2 p-2" />
        <p className="mt-2 break-all text-[11px] text-text-secondary">{preview}</p>
      </div>
    </div>
  );
}
