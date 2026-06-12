"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Circle,
  Lightbulb,
  Rocket,
  Search,
  Zap,
} from "lucide-react";
import type { InterviewQuestion } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { CodeBlock } from "@/components/content/code-block";
import { cn } from "@/lib/utils";

const DONE_KEY = "pytrack-questions-studied";
const PAGE = 20;

const SENIORITY: Record<
  string,
  { label: string; cls: string; order: number }
> = {
  junior: { label: "Júnior", cls: "border-success/30 bg-success/15 text-success", order: 1 },
  pleno: { label: "Pleno", cls: "border-warning/30 bg-warning/15 text-warning", order: 2 },
  senior: { label: "Sênior", cls: "border-primary/40 bg-primary/15 text-primary", order: 3 },
  especialista: { label: "Especialista", cls: "border-danger/30 bg-danger/15 text-danger", order: 4 },
};

const SENIORITY_FILTERS = [
  { v: "todos", l: "Todos os níveis" },
  { v: "junior", l: "Júnior" },
  { v: "pleno", l: "Pleno" },
  { v: "senior", l: "Sênior" },
  { v: "especialista", l: "Especialista" },
];

function loadStudied(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function Field({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Lightbulb;
  label: string;
  value: string | null;
  tone: string;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          tone,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  studied,
  onToggle,
  open,
  onOpenChange,
}: {
  q: InterviewQuestion;
  studied: boolean;
  onToggle: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Card className={cn("overflow-hidden", studied && "border-secondary/40 bg-secondary/[0.03]", open && "border-primary/40")}>
      <button
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mt-0.5 shrink-0"
          role="checkbox"
          aria-checked={studied}
        >
          {studied ? (
            <CheckCircle2 className="h-5 w-5 text-secondary" />
          ) : (
            <Circle className="h-5 w-5 text-text-secondary/40 hover:text-primary" />
          )}
        </span>
        <span className="font-mono text-xs text-primary">
          {String(q.num).padStart(3, "0")}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 text-sm font-medium",
            studied && "text-text-secondary",
          )}
        >
          {q.question}
        </span>
        {q.seniority && SENIORITY[q.seniority] && (
          <span
            className={cn(
              "hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium sm:inline",
              SENIORITY[q.seniority].cls,
            )}
          >
            {SENIORITY[q.seniority].label}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* conteúdo com abertura/fechamento suave (grid-rows) */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="space-y-4 border-t border-border pt-4">
            {q.intro && <p className="text-sm text-text-secondary">{q.intro}</p>}
            <div className="space-y-3.5">
              <Field icon={Lightbulb} label="Conceito-chave" value={q.concept} tone="bg-primary/15 text-primary" />
              <Field icon={Rocket} label="Aplicação prática" value={q.application} tone="bg-secondary/15 text-secondary" />
              <Field icon={AlertTriangle} label="Erros comuns" value={q.mistakes} tone="bg-warning/15 text-warning" />
              <Field icon={Zap} label="Como fixar rápido" value={q.fix_fast} tone="bg-primary/15 text-primary" />
            </div>
            {q.code && <CodeBlock code={q.code} />}
            <Button size="sm" variant={studied ? "secondary" : "outline"} onClick={onToggle}>
              <CheckCircle2 className="h-4 w-4" />
              {studied ? "Estudada" : "Marcar como estudada"}
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export function QuestionsView({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  const [studied, setStudied] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [seniority, setSeniority] = useState("todos");
  const [visible, setVisible] = useState(PAGE);
  const [openId, setOpenId] = useState<number | null>(null); // só uma pergunta aberta

  useEffect(() => setStudied(loadStudied()), []);

  const toggle = (num: number) => {
    setStudied((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event("pytrack-progress"));
      return next;
    });
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questions) {
      const c = q.category ?? "Geral";
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [questions]);

  const filtered = useMemo(() => {
    const ql = query.toLowerCase();
    return questions
      .filter((q) => {
        if (category !== "todas" && q.category !== category) return false;
        if (seniority !== "todos" && q.seniority !== seniority) return false;
        if (
          ql &&
          !`${q.num} ${q.question} ${q.concept ?? ""}`.toLowerCase().includes(ql)
        )
          return false;
        return true;
      })
      .sort(
        (a, b) =>
          (SENIORITY[a.seniority ?? "junior"]?.order ?? 1) -
            (SENIORITY[b.seniority ?? "junior"]?.order ?? 1) || a.num - b.num,
      );
  }, [questions, category, seniority, query]);

  useEffect(() => setVisible(PAGE), [category, seniority, query]);

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Tecnologias
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          <button
            onClick={() => setCategory("todas")}
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors lg:shrink",
              category === "todas"
                ? "bg-primary/10 font-medium text-primary"
                : "text-text-secondary hover:bg-card hover:text-foreground",
            )}
          >
            Todas
            <span className="text-xs text-text-secondary/60">
              {questions.length}
            </span>
          </button>
          {categories.map(([c, n]) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors lg:shrink lg:whitespace-normal lg:text-left",
                category === c
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-text-secondary hover:bg-card hover:text-foreground",
              )}
            >
              <span className="truncate">{c}</span>
              <span className="text-xs text-text-secondary/60">{n}</span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar pergunta por palavra-chave ou número..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-text-secondary">
              Senioridade:
            </span>
            {SENIORITY_FILTERS.map((f) => {
              const count =
                f.v === "todos"
                  ? questions.length
                  : questions.filter((q) => q.seniority === f.v).length;
              return (
                <button
                  key={f.v}
                  onClick={() => setSeniority(f.v)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    seniority === f.v
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-card text-text-secondary hover:text-foreground",
                  )}
                >
                  {f.l}{" "}
                  <span className="text-text-secondary/60">({count})</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-secondary">
            {filtered.length} perguntas · {studied.size} estudadas no total ·
            ordenadas do mais simples ao sênior
          </p>
        </div>

        {filtered.length ? (
          <>
            <div className="space-y-2.5">
              {filtered.slice(0, visible).map((q) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  studied={studied.has(q.num)}
                  onToggle={() => toggle(q.num)}
                  open={openId === q.num}
                  onOpenChange={(o) => setOpenId(o ? q.num : null)}
                />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-5 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisible((v) => v + PAGE)}
                >
                  Carregar mais ({filtered.length - visible} restantes)
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Nenhuma pergunta encontrada"
            description="Ajuste a busca ou a tecnologia selecionada."
          />
        )}
      </div>
    </div>
  );
}
