"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  Route,
  Wallet,
  X,
} from "lucide-react";
import { SPECIALIZATIONS, type Specialization } from "@/lib/specializations";
import { cn } from "@/lib/utils";

const LEVELS = ["Todos", "Avançado", "Especialista"] as const;

export function SpecializationsView() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Todos");
  const [active, setActive] = useState<Specialization | null>(null);

  const list = SPECIALIZATIONS.filter(
    (s) => level === "Todos" || s.level === level,
  );

  return (
    <div>
      {/* filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              level === l
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-text-secondary hover:text-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className="card card-hover group flex h-full flex-col p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    s.accent,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
                  {s.level}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-text-secondary">
                {s.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.technologies.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light"
                  >
                    {t}
                  </span>
                ))}
                {s.technologies.length > 4 && (
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">
                    +{s.technologies.length - 4}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {s.duration}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary-light">
                  Ver roadmap
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* modal detalhe */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl sm:p-8"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-text-secondary hover:bg-surface hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <ModalContent s={active} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalContent({ s }: { s: Specialization }) {
  const Icon = s.icon;
  return (
    <div>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br",
            s.accent,
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold">{s.title}</h2>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary-light">
              {s.level}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{s.description}</p>
        </div>
      </div>

      {/* meta */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Meta icon={Clock} label="Duração" value={s.duration} />
        <Meta icon={Wallet} label="Faixa salarial" value={s.salary} />
        <Meta icon={Briefcase} label="Cargos" value={s.roles.join(", ")} />
      </div>

      {/* skills + tech */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Block title="Habilidades" icon={CheckCircle2}>
          <div className="flex flex-wrap gap-1.5">
            {s.skills.map((k) => (
              <span
                key={k}
                className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-text-secondary"
              >
                {k}
              </span>
            ))}
          </div>
        </Block>
        <Block title="Tecnologias" icon={Layers}>
          <div className="flex flex-wrap gap-1.5">
            {s.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light"
              >
                {t}
              </span>
            ))}
          </div>
        </Block>
      </div>

      {/* roadmap */}
      <div className="mt-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Route className="h-4 w-4 text-green" /> Roadmap da especialização
        </p>
        <ol className="relative space-y-4 border-l border-border pl-6">
          {s.phases.map((p, i) => (
            <li key={p.title} className="relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-surface text-[11px] font-bold text-primary-light">
                {i + 1}
              </span>
              <h4 className="font-semibold">{p.title}</h4>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* projetos */}
      <div className="mt-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="h-4 w-4 text-blue" /> Projetos para o portfólio
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {s.projects.map((proj) => (
            <div
              key={proj}
              className="flex items-start gap-2 rounded-lg border border-border bg-surface p-3 text-sm"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
              <span className="text-text-secondary">{proj}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-text-secondary">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Block({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary-light" /> {title}
      </p>
      {children}
    </div>
  );
}
