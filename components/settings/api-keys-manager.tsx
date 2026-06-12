"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, KeyRound, Loader2, Plus, Trash2, AlertCircle, BookOpen } from "lucide-react";
import { createApiKey, revokeApiKey } from "@/lib/api-keys";
import { useRouter } from "next/navigation";

interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
  revoked: boolean;
}

export function ApiKeysManager({ keys, canUse }: { keys: ApiKeyRow[]; canUse: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    const res = await createApiKey(name);
    setBusy(false);
    if (res.error) setError(res.error);
    else {
      setCreated(res.key ?? null);
      setName("");
      router.refresh();
    }
  }

  if (!canUse) {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
        <p className="font-medium text-warning">API disponível no plano Suprema (R$46) ou superior.</p>
        <p className="mt-1 text-text-secondary">
          Faça upgrade para gerar chaves e integrar a PyTrack a outros serviços.
        </p>
        <Link href="/assinar" className="mt-2 inline-block font-semibold text-primary-light hover:underline">
          Fazer upgrade →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/docs/api" target="_blank" className="inline-flex items-center gap-1.5 text-sm text-primary-light hover:underline">
        <BookOpen className="h-4 w-4" /> Ver documentação da API
      </Link>

      {created && (
        <div className="rounded-lg border border-green/30 bg-green/10 p-4">
          <p className="text-sm font-semibold text-green">Chave criada! Copie agora — ela não será mostrada de novo.</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-surface px-3 py-2 font-mono text-xs">{created}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(created); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="rounded-lg border border-border bg-surface-2 p-2 hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="h-4 w-4" /> {error}</p>
      )}

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da chave (ex.: Meu portfólio)"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button onClick={create} disabled={busy} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Gerar chave
        </button>
      </div>

      {keys.filter((k) => !k.revoked).length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {keys.filter((k) => !k.revoked).map((k) => (
            <li key={k.id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <span className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary-light" />
                <span>
                  <span className="font-medium">{k.name}</span>
                  <span className="block font-mono text-xs text-text-secondary">{k.key_prefix}…••••</span>
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-text-secondary">
                  {k.last_used_at ? `usada ${new Date(k.last_used_at).toLocaleDateString("pt-BR")}` : "nunca usada"}
                </span>
                <button onClick={async () => { await revokeApiKey(k.id); router.refresh(); }} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
