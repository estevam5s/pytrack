"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Code2, Eye, EyeOff, Play, Tag } from "lucide-react";
import type { Exercise } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { LEVEL_LABELS, levelColor } from "@/lib/utils";

function ExerciseCard({ ex }: { ex: Exercise }) {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [done, setDone] = useState(false);
  const [code, setCode] = useState(ex.starter_code ?? "");

  return (
    <Card className={done ? "border-secondary/40" : undefined}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{ex.title}</h3>
              <p className="mt-0.5 text-xs text-text-secondary">{ex.category}</p>
            </div>
          </div>
          <Badge className={levelColor(ex.difficulty)}>
            {LEVEL_LABELS[ex.difficulty]}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-text-secondary">{ex.description}</p>

        {ex.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ex.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] text-text-secondary"
              >
                <Tag className="h-2.5 w-2.5" /> {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
            <Play className="h-3.5 w-3.5" /> {open ? "Fechar editor" : "Resolver"}
          </Button>
          <Button
            size="sm"
            variant={done ? "secondary" : "ghost"}
            onClick={() => setDone((d) => !d)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {done ? "Concluído" : "Marcar feito"}
          </Button>
        </div>

        {open && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-text-secondary">
                Seu código
              </p>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={Math.min(14, Math.max(6, code.split("\n").length + 1))}
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSolution((s) => !s)}
            >
              {showSolution ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" /> Ocultar solução
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> Revelar solução
                </>
              )}
            </Button>

            {showSolution && (
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-secondary">
                <code>{ex.solution}</code>
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ExercisesView({ exercises }: { exercises: Exercise[] }) {
  const [difficulty, setDifficulty] = useState("todos");

  const filtered = useMemo(
    () =>
      difficulty === "todos"
        ? exercises
        : exercises.filter((e) => e.difficulty === difficulty),
    [exercises, difficulty],
  );

  const filters = [
    { value: "todos", label: "Todos" },
    { value: "basico", label: "Básico" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
    { value: "desafio", label: "Desafio real" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setDifficulty(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              difficulty === f.value
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-text-secondary hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} ex={ex} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum exercício nesta dificuldade" />
      )}
    </div>
  );
}
