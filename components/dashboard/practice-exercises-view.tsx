"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileCode2,
  FlaskConical,
  ListChecks,
  Search,
  Target,
} from "lucide-react";
import type { PracticeExercise } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { AiExerciseReview } from "./ai-exercise-review";
import { LEVEL_LABELS, levelColor, cn } from "@/lib/utils";

const DONE_KEY = "pytrack-exercises-done";
const PAGE = 24;

function loadDone(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function ExerciseCard({
  ex,
  done,
  onToggleDone,
}: {
  ex: PracticeExercise;
  done: boolean;
  onToggleDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (!open) return;
    try {
      const saved = JSON.parse(
        localStorage.getItem(`pytrack-chk-${ex.ex_id}`) ?? "null",
      );
      setChecked(
        Array.isArray(saved) && saved.length === ex.checklist.length
          ? saved
          : ex.checklist.map(() => false),
      );
    } catch {
      setChecked(ex.checklist.map(() => false));
    }
  }, [open, ex.ex_id, ex.checklist]);

  const toggleCheck = (i: number) => {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    localStorage.setItem(`pytrack-chk-${ex.ex_id}`, JSON.stringify(next));
  };

  return (
    <Card className={cn(done && "border-secondary/40 bg-secondary/[0.03]")}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          className="shrink-0"
          role="checkbox"
          aria-checked={done}
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-secondary" />
          ) : (
            <Circle className="h-5 w-5 text-text-secondary/40 hover:text-primary" />
          )}
        </span>
        <span className="font-mono text-xs text-primary">{ex.ex_id}</span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-sm font-medium",
              done && "text-text-secondary line-through",
            )}
          >
            {ex.title}
          </span>
        </span>
        <Badge className={cn("hidden sm:inline-flex", levelColor(ex.level))}>
          {LEVEL_LABELS[ex.level]}
        </Badge>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <CardContent className="space-y-4 border-t border-border pt-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className="border-primary/30 bg-primary/10 text-primary">
              {ex.type}
            </Badge>
            <Badge className="border-border bg-surface text-text-secondary">
              {ex.group_label}
            </Badge>
            <span className="text-text-secondary/70">{ex.category}</span>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <Target className="h-3.5 w-3.5" /> Objetivo
            </p>
            <p className="text-sm text-foreground">{ex.objective}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ex.requirements.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Requisitos
                </p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {ex.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ex.acceptance.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Critérios de aceite
                </p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {ex.acceptance.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary/70" />{" "}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {ex.checklist.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <ListChecks className="h-3.5 w-3.5" /> Checklist de entrega
              </p>
              <div className="space-y-1.5">
                {ex.checklist.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className="flex w-full items-center gap-2 text-left text-sm text-text-secondary hover:text-foreground"
                  >
                    {checked[i] ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-text-secondary/40" />
                    )}
                    <span className={cn(checked[i] && "line-through")}>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-xs">
            {ex.suggested_file && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-text-secondary">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                {ex.suggested_file}
              </span>
            )}
            {ex.suggested_test && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-text-secondary">
                <FlaskConical className="h-3.5 w-3.5 text-secondary" />
                {ex.suggested_test}
              </span>
            )}
          </div>

          <AiExerciseReview exercise={ex} />

          <Button
            size="sm"
            variant={done ? "secondary" : "default"}
            onClick={onToggleDone}
          >
            <CheckCircle2 className="h-4 w-4" />
            {done ? "Concluído" : "Marcar como concluído"}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function PracticeExercisesView({
  exercises,
}: {
  exercises: PracticeExercise[];
}) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("todos");
  const [level, setLevel] = useState("todos");
  const [onlyTodo, setOnlyTodo] = useState(false);
  const [visible, setVisible] = useState(PAGE);

  useEffect(() => setDone(loadDone()), []);

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event("pytrack-progress"));
      return next;
    });
  };

  const groups = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of exercises) {
      const g = e.group_label ?? "Outros";
      map.set(g, (map.get(g) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [exercises]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return exercises.filter((e) => {
      if (group !== "todos" && e.group_label !== group) return false;
      if (level !== "todos" && e.level !== level) return false;
      if (onlyTodo && done.has(e.ex_id)) return false;
      if (
        q &&
        !`${e.ex_id} ${e.title} ${e.objective} ${e.category}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [exercises, group, level, onlyTodo, query, done]);

  useEffect(() => setVisible(PAGE), [group, level, query, onlyTodo]);

  const doneCount = done.size;

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
      {/* Sidebar de grupos */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Categorias
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          <button
            onClick={() => setGroup("todos")}
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors lg:shrink",
              group === "todos"
                ? "bg-primary/10 font-medium text-primary"
                : "text-text-secondary hover:bg-card hover:text-foreground",
            )}
          >
            Todas
            <span className="text-xs text-text-secondary/60">
              {exercises.length}
            </span>
          </button>
          {groups.map(([g, n]) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors lg:shrink lg:whitespace-normal lg:text-left",
                group === g
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-text-secondary hover:bg-card hover:text-foreground",
              )}
            >
              <span className="truncate">{g}</span>
              <span className="text-xs text-text-secondary/60">{n}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Conteúdo */}
      <div>
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, ID ou objetivo..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { v: "todos", l: "Todos os níveis" },
              { v: "basico", l: "Básico" },
              { v: "intermediario", l: "Intermediário" },
              { v: "avancado", l: "Avançado" },
              { v: "desafio", l: "Especialista" },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setLevel(f.v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  level === f.v
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-text-secondary hover:text-foreground",
                )}
              >
                {f.l}
              </button>
            ))}
            <button
              onClick={() => setOnlyTodo((v) => !v)}
              className={cn(
                "ml-auto rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                onlyTodo
                  ? "border-secondary bg-secondary/15 text-secondary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {onlyTodo ? "Mostrando pendentes" : "Ocultar concluídos"}
            </button>
          </div>
          <p className="text-xs text-text-secondary">
            {filtered.length} exercícios · {doneCount} concluídos no total
          </p>
        </div>

        {filtered.length ? (
          <>
            <div className="space-y-2.5">
              {filtered.slice(0, visible).map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  done={done.has(ex.ex_id)}
                  onToggleDone={() => toggleDone(ex.ex_id)}
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
            title="Nenhum exercício encontrado"
            description="Ajuste a busca ou os filtros."
          />
        )}
      </div>
    </div>
  );
}
