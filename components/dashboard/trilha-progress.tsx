"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, BookOpen } from "lucide-react";
import { setModuleProgressBySlug } from "@/lib/data/actions";
import { cn } from "@/lib/utils";

interface Mod { slug: string; total: number; serverPct: number }

function readDone(slug: string): number {
  try {
    const arr = JSON.parse(localStorage.getItem(`pytrack-lessons-${slug}`) ?? "[]");
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

// progresso efetivo = max(localStorage, servidor); e SINCRONIZA o servidor
// quando o localStorage está mais avançado (catch-up p/ outros dispositivos).
function useEffectiveProgress(mods: Mod[]) {
  const [map, setMap] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    const compute = () => {
      const m: Record<string, number> = {};
      for (const x of mods) {
        const localPct = x.total ? Math.round((Math.min(x.total, readDone(x.slug)) / x.total) * 100) : 0;
        const pct = Math.max(localPct, x.serverPct);
        m[x.slug] = pct;
        // grava no servidor se o local estiver à frente (best-effort, 1x)
        if (localPct > x.serverPct) {
          setModuleProgressBySlug(x.slug, localPct).catch(() => {});
        }
      }
      setMap(m);
    };
    compute();
    const onProg = () => compute();
    window.addEventListener("pytrack-progress", onProg as EventListener);
    window.addEventListener("focus", onProg);
    const id = setInterval(onProg, 4000);
    return () => { window.removeEventListener("pytrack-progress", onProg as EventListener); window.removeEventListener("focus", onProg); clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mods)]);
  return map;
}

export function TrilhaOverall({ modules, serverFallback }: { modules: Mod[]; serverFallback: number }) {
  const map = useEffectiveProgress(modules);
  const overall = map
    ? (modules.length ? Math.round(modules.reduce((s, m) => s + (map[m.slug] ?? 0), 0) / modules.length) : 0)
    : serverFallback;
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs text-text-secondary">
        <span>Seu progresso</span>
        <span>{overall}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${overall}%` }} />
      </div>
    </div>
  );
}

export function ModuleStatusIcon({ slug, total, serverPct }: { slug: string; total: number; serverPct: number }) {
  const map = useEffectiveProgress([{ slug, total, serverPct }]);
  const pct = map ? (map[slug] ?? 0) : serverPct;
  const done = pct >= 100;
  return (
    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", done ? "bg-secondary/15 text-secondary" : "bg-surface-2 text-text-secondary")}>
      {done ? <CheckCircle2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
    </span>
  );
}

export function ModulePctLabel({ slug, total, serverPct, accessible }: { slug: string; total: number; serverPct: number; accessible: boolean }) {
  const map = useEffectiveProgress([{ slug, total, serverPct }]);
  const pct = map ? (map[slug] ?? 0) : serverPct;
  return <>{accessible && pct > 0 && pct < 100 ? ` · ${pct}%` : ""}</>;
}

// Barra compacta para a LISTA de trilhas (card).
export function TrilhaListProgress({ modules, serverFallback }: { modules: Mod[]; serverFallback: number }) {
  const map = useEffectiveProgress(modules);
  const pct = map
    ? (modules.length ? Math.round(modules.reduce((s, m) => s + (map[m.slug] ?? 0), 0) / modules.length) : 0)
    : serverFallback;
  if (pct <= 0) return null;
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-text-secondary">Progresso</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
