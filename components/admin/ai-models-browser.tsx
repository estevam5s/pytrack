"use client";

import { useMemo, useState } from "react";
import { Search, Copy, Check, Zap } from "lucide-react";
import { ModelIcon } from "./model-icon";
import { providerLabel, providerOf } from "@/lib/ai-providers";

interface OrModel { id: string; name: string; contextLength: number; promptPrice: number; completionPrice: number; free: boolean }

function fmtPrice(perToken: number): string {
  if (perToken === 0) return "Grátis";
  const perM = perToken * 1_000_000; // US$ por 1M tokens
  return `$${perM.toFixed(perM < 1 ? 3 : 2)}/M`;
}

export function AiModelsBrowser({ models }: { models: OrModel[] }) {
  const [q, setQ] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [provider, setProvider] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [limit, setLimit] = useState(40);

  const providers = useMemo(() => {
    const set = new Set(models.map((m) => providerOf(m.id)));
    return ["all", ...[...set].sort()];
  }, [models]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return models.filter((m) =>
      (!onlyFree || m.free) &&
      (provider === "all" || providerOf(m.id) === provider) &&
      (m.name.toLowerCase().includes(term) || m.id.toLowerCase().includes(term)),
    );
  }, [models, q, onlyFree, provider]);

  return (
    <div>
      {/* controles */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar entre ${models.length} modelos…`} className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none">
          {providers.map((p) => <option key={p} value={p}>{p === "all" ? "Todos os provedores" : (providerLabel(p + "/x"))}</option>)}
        </select>
        <button onClick={() => setOnlyFree((v) => !v)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${onlyFree ? "border-green/40 bg-green/10 text-green" : "border-border text-text-secondary"}`}>
          <Zap className="h-4 w-4" /> Só grátis
        </button>
      </div>
      <p className="mb-3 text-xs text-text-secondary">{filtered.length} modelo(s) encontrado(s)</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.slice(0, limit).map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <ModelIcon modelId={m.id} size={32} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{m.name}</p>
              <p className="truncate font-mono text-[11px] text-text-secondary">{m.id}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-text-secondary">
                {m.free ? <span className="font-semibold text-green">Grátis</span> : <span>in {fmtPrice(m.promptPrice)} · out {fmtPrice(m.completionPrice)}</span>}
                {m.contextLength > 0 && <span>· {(m.contextLength / 1000).toFixed(0)}k ctx</span>}
              </div>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(m.id); setCopied(m.id); setTimeout(() => setCopied(null), 1500); }} title="Copiar ID do modelo" className="shrink-0 rounded-lg p-2 text-text-secondary hover:bg-surface-2 hover:text-foreground">
              {copied === m.id ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>

      {filtered.length > limit && (
        <button onClick={() => setLimit((l) => l + 40)} className="mt-4 w-full rounded-lg border border-border py-2 text-sm text-text-secondary hover:text-foreground">
          Carregar mais ({filtered.length - limit} restantes)
        </button>
      )}
    </div>
  );
}
