"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { createGithubRepo } from "@/lib/github";

export function GithubPushButton({
  defaultName,
  description,
  files,
  label = "Salvar no GitHub",
}: {
  defaultName: string;
  description: string;
  files: { path: string; content: string }[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url?: string; error?: string } | null>(null);

  async function push() {
    setBusy(true);
    setResult(null);
    const res = await createGithubRepo({ name, description, files });
    setBusy(false);
    setResult(res);
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
      >
        <Github className="h-4 w-4" /> {label}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-2xl">
          {result?.url ? (
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-green">Repositório criado! 🎉</p>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-light hover:underline">
                Abrir no GitHub <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-medium">Nome do repositório</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {result?.error && (
                <p className="flex items-start gap-1.5 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {result.error}
                  {result.error.includes("Configurações") && (
                    <Link href="/configuracoes/github" className="underline">conectar</Link>
                  )}
                </p>
              )}
              <button
                onClick={push}
                disabled={busy || !name.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#24292e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                Criar repositório
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
