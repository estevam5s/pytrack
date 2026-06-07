"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createUploadUrl,
  recordRelease,
} from "@/app/(dashboard)/aplicativo/actions";
import { Input } from "@/components/ui/input";

const PLATFORMS = [
  { value: "android", label: "Android (APK)" },
  { value: "windows", label: "Windows (.exe)" },
  { value: "macos", label: "macOS (.dmg)" },
  { value: "linux", label: "Linux (.AppImage/.deb)" },
];

export function AppUploader() {
  const router = useRouter();
  const [platform, setPlatform] = useState("android");
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  async function handleUpload() {
    if (!file) return setMsg({ err: "Selecione um arquivo." });
    setBusy(true);
    setMsg({});
    try {
      // 1) URL assinada
      const signed = await createUploadUrl(platform, file.name);
      if (signed.error || !signed.path || !signed.token) {
        throw new Error(signed.error ?? "Falha ao preparar upload.");
      }
      // 2) upload direto p/ o Supabase (sem passar pelo servidor)
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("app-releases")
        .uploadToSignedUrl(signed.path, signed.token, file);
      if (upErr) throw new Error(upErr.message);

      // 3) registra o release
      const fd = new FormData();
      fd.set("platform", platform);
      fd.set("version", version);
      fd.set("notes", notes);
      fd.set("path", signed.path);
      fd.set("size", String(file.size));
      const res = await recordRelease({}, fd);
      if (res.error) throw new Error(res.error);

      setMsg({ ok: res.success ?? "Publicado!" });
      setFile(null);
      setVersion("");
      setNotes("");
      router.refresh();
    } catch (e) {
      setMsg({ err: e instanceof Error ? e.message : "Erro no upload." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {msg.err && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {msg.err}
        </div>
      )}
      {msg.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {msg.ok}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Plataforma</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Versão</label>
          <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="Ex.: 1.0.0" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Notas (changelog)</label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="O que há de novo nesta versão" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Arquivo</label>
        <input
          type="file"
          accept=".apk,.exe,.dmg,.AppImage,.deb,.zip"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/15 file:px-3 file:py-1 file:text-primary-light"
        />
        {file && (
          <p className="text-xs text-text-secondary">
            {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        )}
      </div>
      <button
        onClick={handleUpload}
        disabled={busy || !file}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <UploadCloud className="h-4 w-4" /> {busy ? "Enviando..." : "Publicar aplicativo"}
      </button>
    </div>
  );
}
