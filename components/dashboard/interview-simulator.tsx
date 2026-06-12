"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Shuffle, ThumbsDown, ThumbsUp, Trophy } from "lucide-react";
import type { InterviewQuestion } from "@/types";
import { CodeBlock } from "@/components/content/code-block";
import { cn } from "@/lib/utils";

const SENIORITY: Record<string, { label: string; cls: string }> = {
  junior: { label: "Júnior", cls: "border-green/30 bg-green/10 text-green" },
  pleno: { label: "Pleno", cls: "border-blue/30 bg-blue/10 text-blue" },
  senior: { label: "Sênior", cls: "border-magenta/30 bg-magenta/10 text-magenta" },
};

export function InterviewSimulator({ questions }: { questions: InterviewQuestion[] }) {
  const cats = useMemo(
    () => Array.from(new Set(questions.map((q) => q.category).filter(Boolean) as string[])).sort(),
    [questions],
  );
  const [cat, setCat] = useState("todas");
  const [sen, setSen] = useState("todos");
  const [idx, setIdx] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [stats, setStats] = useState({ acertos: 0, total: 0 });

  const pool = useMemo(
    () =>
      questions.filter(
        (q) =>
          (cat === "todas" || q.category === cat) &&
          (sen === "todos" || q.seniority === sen),
      ),
    [questions, cat, sen],
  );

  function sortear() {
    if (pool.length === 0) return;
    setIdx(Math.floor(Math.random() * pool.length));
    setShow(false);
  }

  function avaliar(acertou: boolean) {
    setStats((s) => ({ acertos: s.acertos + (acertou ? 1 : 0), total: s.total + 1 }));
    sortear();
  }

  const q = idx !== null ? pool[idx] : null;

  return (
    <div className="max-w-3xl">
      {/* controles */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="todas">Todas as tecnologias</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sen} onChange={(e) => setSen(e.target.value)} className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="todos">Todos os níveis</option>
          <option value="junior">Júnior</option>
          <option value="pleno">Pleno</option>
          <option value="senior">Sênior</option>
        </select>
        <button onClick={sortear} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white">
          <Shuffle className="h-4 w-4" /> {q ? "Próxima" : "Começar"}
        </button>
        <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-text-secondary">
          <Trophy className="h-4 w-4 text-warning" /> {stats.acertos}/{stats.total} acertos
        </span>
      </div>

      {!q ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-text-secondary">
          <Shuffle className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p>Selecione os filtros e clique em <strong>Começar</strong> para simular uma entrevista. ({pool.length} perguntas disponíveis)</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/30 bg-surface p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-primary-light">{q.category}</span>
            {q.seniority && SENIORITY[q.seniority] && (
              <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", SENIORITY[q.seniority].cls)}>
                {SENIORITY[q.seniority].label}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold">{q.question}</h3>

          {!show ? (
            <button onClick={() => setShow(true)} className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold hover:text-foreground">
              <Eye className="h-4 w-4" /> Ver resposta
            </button>
          ) : (
            <div className="mt-5 space-y-3 text-sm">
              {q.intro && <p className="text-text-secondary">{q.intro}</p>}
              {q.concept && <p><strong className="text-foreground">Conceito:</strong> <span className="text-text-secondary">{q.concept}</span></p>}
              {q.application && <p><strong className="text-foreground">Aplicação:</strong> <span className="text-text-secondary">{q.application}</span></p>}
              {q.mistakes && <p><strong className="text-warning">Erros comuns:</strong> <span className="text-text-secondary">{q.mistakes}</span></p>}
              {q.fix_fast && <p><strong className="text-green">Como fixar:</strong> <span className="text-text-secondary">{q.fix_fast}</span></p>}
              {q.code && <CodeBlock code={q.code} />}

              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => avaliar(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-green/30 bg-green/10 px-3 py-1.5 text-sm font-semibold text-green">
                  <ThumbsUp className="h-4 w-4" /> Acertei
                </button>
                <button onClick={() => avaliar(false)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-semibold text-text-secondary hover:text-foreground">
                  <ThumbsDown className="h-4 w-4" /> Preciso revisar
                </button>
                <button onClick={() => setShow(false)} className="ml-auto inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-foreground">
                  <EyeOff className="h-3.5 w-3.5" /> Ocultar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
