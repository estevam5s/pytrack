"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  Coffee,
  GraduationCap,
  Layers,
  Library,
  MessageCircleQuestion,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  computeXp,
  levelFromXp,
  XP_WEIGHTS,
  type ActivityCounts,
} from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function cupsToday(): number {
  if (typeof window === "undefined") return 0;
  try {
    const o = JSON.parse(localStorage.getItem("pytrack-pomodoros") ?? "null");
    const today = new Date().toISOString().slice(0, 10);
    if (o && o.date === today) return o.count;
  } catch {
    /* ignore */
  }
  return 0;
}

export function EcosystemAnalysis({
  serverCounts,
}: {
  serverCounts: { modules: number; books: number; courses: number };
}) {
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });
  const [cups, setCups] = useState(0);

  useEffect(() => {
    setLocal(readLocalActivity());
    setCups(cupsToday());
  }, []);

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
  const totalActivities =
    counts.modules +
    counts.lessons +
    counts.exercises +
    counts.questions +
    counts.books +
    counts.courses;

  const sources = [
    { icon: Layers, label: "Módulos concluídos", value: counts.modules, w: XP_WEIGHTS.modules, color: "#8257E5" },
    { icon: BookOpen, label: "Lições lidas", value: counts.lessons, w: XP_WEIGHTS.lessons, color: "#a78bfa" },
    { icon: Code2, label: "Exercícios feitos", value: counts.exercises, w: XP_WEIGHTS.exercises, color: "#04D361" },
    { icon: MessageCircleQuestion, label: "Perguntas estudadas", value: counts.questions, w: XP_WEIGHTS.questions, color: "#38bdf8" },
    { icon: Library, label: "Livros lidos", value: counts.books, w: XP_WEIGHTS.books, color: "#F59E0B" },
    { icon: GraduationCap, label: "Cursos concluídos", value: counts.courses, w: XP_WEIGHTS.courses, color: "#ef4444" },
  ];
  const maxXp = Math.max(1, ...sources.map((s) => s.value * s.w));

  const tiles = [
    { icon: Layers, label: "Módulos", value: counts.modules },
    { icon: BookOpen, label: "Lições", value: counts.lessons },
    { icon: Code2, label: "Exercícios", value: counts.exercises },
    { icon: MessageCircleQuestion, label: "Perguntas", value: counts.questions },
    { icon: Library, label: "Livros", value: counts.books },
    { icon: GraduationCap, label: "Cursos", value: counts.courses },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Origem do XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Origem do seu XP</span>
            <span className="text-sm font-semibold text-secondary">
              <Sparkles className="mr-1 inline h-4 w-4" />
              {xp.toLocaleString("pt-BR")} XP
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sources.map((s) => {
            const sxp = s.value * s.w;
            const share = xp ? Math.round((sxp / xp) * 100) : 0;
            return (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-text-secondary">
                    <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-mono text-text-secondary">
                    {s.value} × {s.w} ={" "}
                    <span className="font-semibold text-foreground">{sxp} XP</span>
                    {share > 0 && (
                      <span className="ml-1 text-text-secondary/70">({share}%)</span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(sxp / maxXp) * 100}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Atividade no ecossistema */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade no ecossistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2.5">
            {tiles.map((t) => (
              <div
                key={t.label}
                className="rounded-lg border border-border bg-surface/60 p-3 text-center"
              >
                <t.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-xl font-bold leading-none">{t.value}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">{t.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
              <Trophy className="mx-auto h-4 w-4 text-warning" />
              <p className="mt-1 text-xl font-bold leading-none">
                {totalActivities}
              </p>
              <p className="mt-0.5 text-[10px] text-text-secondary">Atividades</p>
            </div>
            <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
              <Sparkles className="mx-auto h-4 w-4 text-secondary" />
              <p className="mt-1 text-xl font-bold leading-none">
                {level.index + 1}/6
              </p>
              <p className="mt-0.5 text-[10px] text-text-secondary">Tier</p>
            </div>
            <div className="rounded-lg border border-border bg-surface/60 p-3 text-center">
              <Coffee className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-xl font-bold leading-none">{cups}</p>
              <p className="mt-0.5 text-[10px] text-text-secondary">Focos hoje</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
