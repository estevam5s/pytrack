"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers, Lock, Target } from "lucide-react";
import { TRILHAS, canAccess } from "@/lib/trilhas";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";
import { cn } from "@/lib/utils";

export interface TrilhaStat {
  modules: number;
  lessons: number;
  hours: number;
  progress: number;
}

const TIER_BADGE: Record<Tier, string> = {
  free: "border-green/30 bg-green/10 text-green",
  essencial: "border-secondary/30 bg-secondary/10 text-secondary",
  completo: "border-primary/30 bg-primary/10 text-primary-light",
  suprema: "border-primary/40 bg-gradient-to-r from-primary/20 to-magenta/10 text-primary-light",
};

const FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "free", label: "Grátis" },
  { key: "essencial", label: "Essencial" },
  { key: "completo", label: "Completo" },
  { key: "suprema", label: "Suprema" },
] as const;

export function TrilhasView({
  stats,
  userTier,
}: {
  stats: Record<string, TrilhaStat>;
  userTier: Tier;
}) {
  const [filter, setFilter] = useState<string>("todas");
  const list = TRILHAS.filter((t) => filter === "todas" || t.tier === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
          <Target className="h-4 w-4 text-primary" /> Plano:
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-text-secondary hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => {
          const s = stats[t.id] ?? { modules: 0, lessons: 0, hours: 0, progress: 0 };
          const Icon = t.icon;
          const unlocked = canAccess(userTier, t.tier);
          const isSuprema = t.tier === "suprema";
          return (
            <div
              key={t.id}
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-5",
                isSuprema ? "border-primary/40 bg-surface" : "card",
                unlocked && "card-hover",
              )}
            >
              {isSuprema && (
                <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-25 blur" />
              )}
              <div className="flex items-start justify-between">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", t.accent)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", TIER_BADGE[t.tier])}>
                  {t.tier === "free" ? "Grátis" : TIER_LABEL[t.tier]}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">{t.title}</h3>
              <p className="text-xs text-text-secondary">{t.subtitle}</p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-text-secondary">
                <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-light" />
                {t.goal}
              </p>

              {/* chips de tópicos */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.topics.slice(0, 6).map((tp) => (
                  <span key={tp} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">
                    {tp}
                  </span>
                ))}
                {t.topics.length > 6 && (
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light">
                    +{t.topics.length - 6}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.adModules} módulos</span>
                <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {t.adLessons} aulas</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{t.adHours}h</span>
              </div>

              {unlocked && s.progress > 0 && (
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-text-secondary">
                    <span>Progresso</span>
                    <span>{s.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                {unlocked ? (
                  <Link
                    href={`/minhas-trilhas/${t.id}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light transition-colors hover:bg-primary hover:text-white"
                  >
                    {s.progress > 0 ? "Continuar trilha" : "Começar trilha"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/assinar?upgrade=${t.tier}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
                  >
                    <Lock className="h-3.5 w-3.5" /> Disponível no {TIER_LABEL[t.tier]}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
