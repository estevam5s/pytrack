"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  GraduationCap,
  Layers,
  Library,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import {
  computeXp,
  levelFromXp,
  LEVEL_TIERS,
  XP_WEIGHTS,
  type ActivityCounts,
} from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PythonLevelCard({
  serverCounts,
  showBreakdown = true,
}: {
  serverCounts: { modules: number; books: number; courses: number };
  showBreakdown?: boolean;
}) {
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });
  useEffect(() => setLocal(readLocalActivity()), []);

  const counts: ActivityCounts = useMemo(
    () => ({
      modules: serverCounts.modules,
      lessons: local.lessons,
      exercises: local.exercises,
      questions: local.questions,
      books: serverCounts.books,
      courses: serverCounts.courses,
    }),
    [serverCounts, local],
  );

  const xp = computeXp(counts);
  const level = levelFromXp(xp);

  const breakdown = [
    { icon: Layers, label: "Módulos", value: counts.modules, xp: counts.modules * XP_WEIGHTS.modules },
    { icon: BookOpen, label: "Lições", value: counts.lessons, xp: counts.lessons * XP_WEIGHTS.lessons },
    { icon: Code2, label: "Exercícios", value: counts.exercises, xp: counts.exercises * XP_WEIGHTS.exercises },
    { icon: MessageCircleQuestion, label: "Perguntas", value: counts.questions, xp: counts.questions * XP_WEIGHTS.questions },
    { icon: Library, label: "Livros", value: counts.books, xp: counts.books * XP_WEIGHTS.books },
    { icon: GraduationCap, label: "Cursos", value: counts.courses, xp: counts.courses * XP_WEIGHTS.courses },
  ];

  return (
    <Card className="card-gradient h-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-3xl">
              {level.tier.emoji}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Seu nível no ecossistema Python
              </p>
              <p className="text-2xl font-bold">{level.tier.name}</p>
              <p className="text-sm text-secondary">
                <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                {xp.toLocaleString("pt-BR")} XP
              </p>
            </div>
          </div>
          <div className="w-full sm:max-w-[260px]">
            {level.next ? (
              <>
                <div className="mb-1.5 flex justify-between text-xs text-text-secondary">
                  <span>{level.tier.name}</span>
                  <span>
                    {level.next.emoji} {level.next.name}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${level.progressToNext}%` }}
                  />
                </div>
                <p className="mt-1.5 text-right text-xs text-text-secondary">
                  faltam {(level.next.min - xp).toLocaleString("pt-BR")} XP
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-secondary">
                Nível máximo alcançado! 🐍
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1">
          {LEVEL_TIERS.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                i <= level.index
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-surface text-text-secondary",
              )}
            >
              <span>{t.emoji}</span> {t.name}
            </div>
          ))}
        </div>

        {showBreakdown && (
          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {breakdown.map((b) => (
              <div
                key={b.label}
                className="rounded-lg border border-border bg-surface/60 p-2.5 text-center"
              >
                <b.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-lg font-bold leading-none">{b.value}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">{b.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
