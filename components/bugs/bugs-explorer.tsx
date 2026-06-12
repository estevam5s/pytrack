"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bug as BugIcon, Loader2, Check, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/shared/tech-icon";
import { getAllBugs, DIFF_LABEL, CAT_LABEL, type Bug, type BugDifficulty, type BugCategory } from "@/lib/bugs-data";
import { solveItem } from "@/lib/solved-actions";

const DIFFS: (BugDifficulty | "all")[] = ["all", "facil", "medio", "dificil", "expert"];
const CATS: (BugCategory | "all")[] = ["all", "codigo", "arquitetura", "banco"];
const DIFF_COLOR: Record<BugDifficulty, string> = {
  facil: "bg-green/15 text-green", medio: "bg-blue-400/15 text-blue-400",
  dificil: "bg-orange-400/15 text-orange-400", expert: "bg-red-400/15 text-red-400",
};
const PER_PAGE = 24;

export function BugsExplorer({ solvedIds }: { solvedIds: string[] }) {
  const router = useRouter();
  const all = useMemo(() => getAllBugs(), []);
  const [solved, setSolved] = useState(new Set(solvedIds));
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<BugDifficulty | "all">("all");
  const [cat, setCat] = useState<BugCategory | "all">("all");
  const [showSolved, setShowSolved] = useState(false);
  const [page, setPage] = useState(0);
  const [solving, setSolving] = useState<string | null>(null);

  const filtered = useMemo(() => all.filter((b) => {
    if (diff !== "all" && b.difficulty !== diff) return false;
    if (cat !== "all" && b.category !== cat) return false;
    if (showSolved && !solved.has(b.id)) return false;
    if (q && !`${b.title} ${b.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [all, diff, cat, q, showSolved, solved]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);
  const suggested = all.find((b) => !solved.has(b.id) && b.difficulty === "facil");

  async function resolve(b: Bug) {
    setSolving(b.id);
    const next = new Set(solved); next.add(b.id); setSolved(next);
    await solveItem("bug", b.id, b.xp);
    setSolving(null);
    router.refresh();
  }

  function reset() { setPage(0); }

  return (
    <div>
      {/* dica IA */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-text-secondary">
        <Sparkles className="h-4 w-4 shrink-0 text-primary-light" /> Dicas com IA ao resolver: ao revisar cada bug, identifique a causa raiz e proponha a correção.
      </div>

      {/* sugerido */}
      {suggested && !showSolved && (
        <div className="mb-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
          <p className="text-xs font-semibold text-primary-light">⚡ Próximo sugerido para você</p>
          <h3 className="mt-1 font-bold">{suggested.title}</h3>
          <p className="text-sm text-text-secondary line-clamp-2">{suggested.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", DIFF_COLOR[suggested.difficulty])}>{DIFF_LABEL[suggested.difficulty]}</span>
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-text-secondary">+{suggested.xp} XP</span>
            <button onClick={() => resolve(suggested)} className="ml-auto rounded-lg bg-secondary px-4 py-1.5 text-sm font-semibold text-white">Resolver bug</button>
          </div>
        </div>
      )}

      {/* busca */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        <input value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder="Buscar bugs por título ou descrição..." className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
      </div>

      {/* filtros */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {DIFFS.map((d) => <Chip key={d} active={diff === d} onClick={() => { setDiff(d); reset(); }}>{d === "all" ? "Todas" : DIFF_LABEL[d]}</Chip>)}
        <Chip active={showSolved} onClick={() => { setShowSolved((v) => !v); reset(); }}>Completados</Chip>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => { setCat(c); reset(); }} small>{c === "all" ? "Todos" : CAT_LABEL[c]}</Chip>)}
        <span className="ml-auto text-xs text-text-secondary">{filtered.length.toLocaleString("pt-BR")} bugs encontrados</span>
      </div>

      {/* grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {slice.map((b) => {
          const done = solved.has(b.id);
          return (
            <div key={b.id} className={cn("rounded-xl border bg-surface p-4", done ? "border-green/40" : "border-border")}>
              <div className="flex items-start gap-2">
                <BugIcon className={cn("mt-0.5 h-4 w-4 shrink-0", done ? "text-green" : "text-primary-light")} />
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">{b.title}</p>
                  <p className="mt-1 text-xs text-text-secondary line-clamp-2">{b.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", DIFF_COLOR[b.difficulty])}>{DIFF_LABEL[b.difficulty]}</span>
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">+{b.xp} XP</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary"><TechIcon name={b.tech} className="h-3 w-3" /> {CAT_LABEL[b.category]}</span>
                {done ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-green"><Check className="h-3.5 w-3.5" /> Resolvido</span>
                ) : (
                  <button onClick={() => resolve(b)} disabled={solving === b.id} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                    {solving === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Resolver bug
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* paginação */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button onClick={() => setPage(Math.max(0, cur - 1))} disabled={cur === 0} className="rounded-lg border border-border p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-sm text-text-secondary">Página {cur + 1} de {pages}</span>
        <button onClick={() => setPage(Math.min(pages - 1, cur + 1))} disabled={cur >= pages - 1} className="rounded-lg border border-border p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children, small }: { active: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} className={cn("rounded-full font-medium transition-colors", small ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs", active ? "bg-primary text-white" : "border border-border text-text-secondary hover:text-foreground")}>{children}</button>
  );
}
