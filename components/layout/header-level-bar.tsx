"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers,
  Library,
  MessageCircleQuestion,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  computeXp,
  levelFromXp,
  LEVEL_TIERS,
  XP_WEIGHTS,
  type ActivityCounts,
} from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";
import { cn } from "@/lib/utils";

export function HeaderLevelBar({
  serverCounts,
}: {
  serverCounts: { modules: number; books: number; courses: number };
}) {
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });
  const [open, setOpen] = useState(false);

  // mantém o nível atualizado conforme o progresso muda (outras abas/ações)
  useEffect(() => {
    const sync = () => setLocal(readLocalActivity());
    sync();
    const id = setInterval(sync, 5000);
    window.addEventListener("focus", sync);
    window.addEventListener("pytrack-progress", sync as EventListener);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pytrack-progress", sync as EventListener);
    };
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

  const sources = [
    { icon: Layers, label: "Módulos", value: counts.modules, w: XP_WEIGHTS.modules },
    { icon: BookOpen, label: "Lições", value: counts.lessons, w: XP_WEIGHTS.lessons },
    { icon: Code2, label: "Exercícios", value: counts.exercises, w: XP_WEIGHTS.exercises },
    { icon: MessageCircleQuestion, label: "Perguntas", value: counts.questions, w: XP_WEIGHTS.questions },
    { icon: Library, label: "Livros", value: counts.books, w: XP_WEIGHTS.books },
    { icon: GraduationCap, label: "Cursos", value: counts.courses, w: XP_WEIGHTS.courses },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 transition-colors hover:border-primary/40"
      >
        <span className="text-base leading-none">{level.tier.emoji}</span>
        <span className="hidden text-xs font-semibold text-foreground sm:block">
          {level.tier.name}
        </span>
        <span className="relative h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:w-24">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${level.progressToNext}%` }}
          />
        </span>
        <span className="hidden text-[11px] font-medium text-text-secondary md:block">
          {xp.toLocaleString("pt-BR")} XP
        </span>
        <ChevronDown
          className={cn(
            "hidden h-3.5 w-3.5 text-text-secondary transition-transform sm:block",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            {/* topo */}
            <div className="border-b border-border bg-gradient-to-br from-primary/15 to-secondary/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-2xl">
                  {level.tier.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                    Nível no ecossistema Python
                  </p>
                  <p className="text-lg font-bold leading-tight">
                    {level.tier.name}
                  </p>
                  <p className="text-xs text-secondary">
                    <Sparkles className="mr-1 inline h-3 w-3" />
                    {xp.toLocaleString("pt-BR")} XP
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px] text-text-secondary">
                  <span>{level.tier.name}</span>
                  <span>
                    {level.next
                      ? `${level.next.emoji} ${level.next.name}`
                      : "máx."}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${level.progressToNext}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[11px] text-text-secondary">
                  {level.next
                    ? `faltam ${(level.next.min - xp).toLocaleString("pt-BR")} XP · ${level.progressToNext}%`
                    : "nível máximo 🐍"}
                </p>
              </div>
            </div>

            {/* fontes de XP */}
            <div className="p-3">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                Origem do seu XP
              </p>
              <div className="space-y-1">
                {sources.map((s) => {
                  const sxp = s.value * s.w;
                  const share = xp ? Math.round((sxp / xp) * 100) : 0;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center gap-2.5 rounded-md px-1 py-1"
                    >
                      <s.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="w-20 shrink-0 text-xs text-text-secondary">
                        {s.label}
                      </span>
                      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
                          style={{ width: `${share}%` }}
                        />
                      </span>
                      <span className="w-14 shrink-0 text-right font-mono text-[11px] text-foreground">
                        {s.value}×{s.w}
                      </span>
                      <span className="w-12 shrink-0 text-right text-[11px] font-semibold text-secondary">
                        {sxp}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
              <Link
                href="/evolucao"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-white"
              >
                <TrendingUp className="h-3.5 w-3.5" /> Ver evolução
              </Link>
              <Link
                href="/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:text-foreground"
              >
                Perfil completo
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
