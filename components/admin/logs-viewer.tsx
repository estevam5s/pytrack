"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronRight, AlertTriangle, AlertCircle, Skull, Trash2, Loader2 } from "lucide-react";
import { clearOldLogs } from "@/lib/admin-logs-actions";
import { cn } from "@/lib/utils";

interface LogRow { id: string; level: string; source: string; message: string; stack: string | null; path: string | null; user_id: string | null; created_at: string }

const LEVEL = {
  error: { icon: AlertCircle, cls: "text-red-400 bg-red-400/10 border-red-400/30" },
  warn: { icon: AlertTriangle, cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  fatal: { icon: Skull, cls: "text-red-500 bg-red-500/15 border-red-500/40" },
} as const;

export function LogsViewer({ logs, sources }: { logs: LogRow[]; sources: { source: string; count: number }[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return logs.filter((l) =>
      (level === "all" || l.level === level) &&
      (source === "all" || l.source === source) &&
      (!term || l.message.toLowerCase().includes(term) || l.source.toLowerCase().includes(term) || (l.path ?? "").toLowerCase().includes(term)),
    );
  }, [logs, q, level, source]);

  async function clear(days: number) {
    if (!confirm(`Apagar logs com mais de ${days} dias?`)) return;
    setClearing(true);
    const res = await clearOldLogs(days);
    setClearing(false);
    if (res.ok) { alert(`${res.removed} logs removidos.`); router.refresh(); }
    else alert(res.error);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar mensagem, origem, rota…" className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none">
          <option value="all">Todos os níveis</option>
          <option value="error">Error</option>
          <option value="warn">Warn</option>
          <option value="fatal">Fatal</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="max-w-[200px] rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none">
          <option value="all">Todas as origens</option>
          {sources.map((s) => <option key={s.source} value={s.source}>{s.source} ({s.count})</option>)}
        </select>
        <button onClick={() => clear(30)} disabled={clearing} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:text-red-400">
          {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Limpar +30d
        </button>
      </div>

      <p className="mb-2 text-xs text-text-secondary">{filtered.length} de {logs.length} logs</p>

      <div className="space-y-1.5">
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-text-secondary">Nenhum log encontrado. 🎉</p>}
        {filtered.map((l) => {
          const cfg = LEVEL[l.level as keyof typeof LEVEL] ?? LEVEL.error;
          const Icon = cfg.icon;
          const expanded = open === l.id;
          return (
            <div key={l.id} className={cn("rounded-lg border", cfg.cls)}>
              <button onClick={() => setOpen(expanded ? null : l.id)} className="flex w-full items-start gap-2.5 p-2.5 text-left">
                {expanded ? <ChevronDown className="mt-0.5 h-4 w-4 shrink-0" /> : <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />}
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 text-xs">
                    <span className="font-mono font-semibold uppercase">{l.level}</span>
                    <span className="font-mono text-foreground">{l.source}</span>
                    {l.path && <span className="font-mono text-text-secondary">{l.path}</span>}
                    <span className="ml-auto text-text-secondary">{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-foreground">{l.message}</span>
                </span>
              </button>
              {expanded && (
                <div className="border-t border-current/20 p-3 text-xs">
                  <p className="whitespace-pre-wrap break-words text-foreground">{l.message}</p>
                  {l.stack && <pre className="mt-2 max-h-60 overflow-auto rounded bg-black/30 p-2 font-mono text-[11px] text-text-secondary">{l.stack}</pre>}
                  <p className="mt-2 text-text-secondary">Usuário: {l.user_id ?? "—"} · ID: {l.id}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
