"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, Save, Loader2, CheckCircle2, AlertCircle, FileArchive, Clock } from "lucide-react";
import { updateExtensionMeta, uploadVsix } from "@/app/(dashboard)/admin/extensao/actions";

interface Meta {
  version: string;
  vsix_path: string;
  marketplace_url: string;
  changelog: string;
  updated_at: string | null;
}

const inp = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

export function ExtensionManager({ meta, files }: { meta: Meta; files: { name: string; size: number }[] }) {
  const [version, setVersion] = useState(meta.version);
  const [url, setUrl] = useState(meta.marketplace_url);
  const [changelog, setChangelog] = useState(meta.changelog);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function save() {
    setMsg({});
    start(async () => {
      const res = await updateExtensionMeta({ version, marketplace_url: url, changelog });
      setMsg(res.error ? { err: res.error } : { ok: "Metadados atualizados!" });
    });
  }

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) { setMsg({ err: "Selecione um arquivo .vsix." }); return; }
    setUploading(true);
    setMsg({});
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadVsix(fd);
    setUploading(false);
    setMsg(res.error ? { err: res.error } : { ok: `Upload concluído: ${res.path}` });
    if (res.ok && fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-5">
      {msg.err && <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> {msg.err}</div>}
      {msg.ok && <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green"><CheckCircle2 className="h-4 w-4" /> {msg.ok}</div>}

      {/* upload .vsix */}
      <div className="card p-5">
        <p className="flex items-center gap-2 font-semibold"><Upload className="h-4 w-4 text-primary-light" /> Upload de nova versão (.vsix)</p>
        <p className="mt-1 text-sm text-text-secondary">Gere o pacote com <code className="rounded bg-surface-2 px-1">vsce package</code> e envie aqui. Vira a versão disponível para download dos assinantes Suprema.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept=".vsix" className="text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary-light" />
          <button onClick={upload} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Enviar
          </button>
        </div>
        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="flex items-center gap-2"><FileArchive className="h-4 w-4 text-primary-light" /> {f.name}</span>
                <span className="text-xs text-text-secondary">{(f.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* metadados */}
      <div className="card space-y-3 p-5">
        <p className="font-semibold">Metadados da extensão</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Versão</label>
            <input value={version} onChange={(e) => setVersion(e.target.value)} className={inp} placeholder="1.0.0" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">URL na Marketplace</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className={inp} placeholder="https://marketplace.visualstudio.com/items?itemName=..." />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Changelog / notas da versão</label>
          <textarea value={changelog} onChange={(e) => setChangelog(e.target.value)} rows={4} className={inp} placeholder="O que mudou nesta versão..." />
        </div>
        <div className="flex items-center justify-between">
          <button onClick={save} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
          </button>
          {meta.updated_at && <span className="flex items-center gap-1 text-xs text-text-secondary"><Clock className="h-3 w-3" /> atualizado {new Date(meta.updated_at).toLocaleString("pt-BR")}</span>}
        </div>
      </div>
    </div>
  );
}
