"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Check, ChevronLeft, ChevronRight, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/shared/tech-icon";
import { getAllChallenges, CH_DIFF_LABEL, type Challenge, type ChDifficulty } from "@/lib/challenges-data";
import { solveItem } from "@/lib/solved-actions";

const DIFFS: (ChDifficulty | "all")[] = ["all", "facil", "medio", "dificil", "expert"];
const DIFF_COLOR: Record<ChDifficulty, string> = {
  facil: "bg-green/15 text-green", medio: "bg-yellow-400/15 text-yellow-400",
  dificil: "bg-orange-400/15 text-orange-400", expert: "bg-red-400/15 text-red-400",
};
const PER_PAGE = 24;

export function ChallengesExplorer({ solvedIds, topics }: { solvedIds: string[]; topics: string[] }) {
  const router = useRouter();
  const all = useMemo(() => getAllChallenges(), []);
  const [solved, setSolved] = useState(new Set(solvedIds));
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<ChDifficulty | "all">("all");
  const [topic, setTopic] = useState("all");
  const [showSolved, setShowSolved] = useState(false);
  const [page, setPage] = useState(0);
  const [solving, setSolving] = useState<string | null>(null);

  const filtered = useMemo(() => all.filter((c) => {
    if (diff !== "all" && c.difficulty !== diff) return false;
    if (topic !== "all" && c.topic !== topic) return false;
    if (showSolved && !solved.has(c.id)) return false;
    if (q && !`${c.title} ${c.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [all, diff, topic, q, showSolved, solved]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);
  const daily = all[Math.floor(Date.now() / 86400000) % all.length];

  async function resolve(c: Challenge) {
    setSolving(c.id);
    const next = new Set(solved); next.add(c.id); setSolved(next);
    await solveItem("challenge", c.id, c.xp);
    setSolving(null);
    router.refresh();
  }
  const reset = () => setPage(0);

  return (
    <div>
      {/* desafio do dia */}
      <div className="mb-4 rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent p-5">
        <p className="text-xs font-semibold text-secondary">⭐ DESAFIO DO DIA · {CH_DIFF_LABEL[daily.difficulty]}</p>
        <h3 className="mt-1 font-bold">{daily.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2">{daily.description}</p>
        <div className="mt-3 flex items-center gap-2">
          {daily.techs.map((t) => <span key={t} className="rounded bg-surface-2 p-1"><TechIcon name={t} className="h-3.5 w-3.5 text-primary-light" /></span>)}
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-text-secondary">+{daily.xp} XP</span>
          <button onClick={() => resolve(daily)} className="ml-auto rounded-lg bg-secondary px-4 py-1.5 text-sm font-semibold text-white">Resolver</button>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        <input value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder="Buscar desafios..." className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {DIFFS.map((d) => <Chip key={d} active={diff === d} onClick={() => { setDiff(d); reset(); }}>{d === "all" ? "Todos" : CH_DIFF_LABEL[d]}</Chip>)}
        <Chip active={showSolved} onClick={() => { setShowSolved((v) => !v); reset(); }}>Completados</Chip>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Chip active={topic === "all"} onClick={() => { setTopic("all"); reset(); }} small>Todos os tópicos</Chip>
        {topics.map((t) => <Chip key={t} active={topic === t} onClick={() => { setTopic(t); reset(); }} small>{t}</Chip>)}
        <span className="ml-auto text-xs text-text-secondary">{filtered.length.toLocaleString("pt-BR")} desafios</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {slice.map((c) => {
          const done = solved.has(c.id);
          return (
            <div key={c.id} className={cn("rounded-xl border bg-surface p-4", done ? "border-green/40" : "border-border")}>
              <div className="flex items-center gap-1.5">
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", DIFF_COLOR[c.difficulty])}>{CH_DIFF_LABEL[c.difficulty]}</span>
                <span className="text-[11px] text-text-secondary">{c.topic}</span>
              </div>
              <p className="mt-1.5 font-semibold leading-tight">{c.title}</p>
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">{c.description}</p>
              <div className="mt-3 flex items-center gap-1.5">
                {c.techs.map((t) => <span key={t} className="rounded bg-surface-2 p-1"><TechIcon name={t} className="h-3.5 w-3.5 text-primary-light" /></span>)}
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">+{c.xp} XP</span>
                {done ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-green"><Check className="h-3.5 w-3.5" /> Resolvido</span>
                ) : (
                  <button onClick={() => resolve(c)} disabled={solving === c.id} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                    {solving === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Swords className="h-3.5 w-3.5" />} Resolver
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button onClick={() => setPage(Math.max(0, cur - 1))} disabled={cur === 0} className="rounded-lg border border-border p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-sm text-text-secondary">Página {cur + 1} de {pages}</span>
        <button onClick={() => setPage(Math.min(pages - 1, cur + 1))} disabled={cur >= pages - 1} className="rounded-lg border border-border p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children, small }: { active: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return <button onClick={onClick} className={cn("rounded-full font-medium transition-colors", small ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs", active ? "bg-primary text-white" : "border border-border text-text-secondary hover:text-foreground")}>{children}</button>;
}
