"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Flame,
  Layers,
  Map,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { CareerPath } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEVEL_LABELS, levelColor, cn } from "@/lib/utils";

interface Extra {
  demand: string;
  demandCls: string;
  daily: string;
  ladder: [string, string][];
}

const EXTRAS: Record<string, Extra> = {
  Backend: {
    demand: "Muito alta",
    demandCls: "bg-secondary/15 text-secondary border-secondary/30",
    daily: "Projetar APIs, modelar dados, otimizar queries e garantir confiabilidade.",
    ladder: [["Júnior", "R$ 4-7k"], ["Pleno", "R$ 8-15k"], ["Sênior", "R$ 15-25k"]],
  },
  "Data Science": {
    demand: "Alta",
    demandCls: "bg-warning/15 text-warning border-warning/30",
    daily: "Limpar dados, gerar análises, criar dashboards e comunicar insights.",
    ladder: [["Júnior", "R$ 4-7k"], ["Pleno", "R$ 7-13k"], ["Sênior", "R$ 13-22k"]],
  },
  "Engenharia de Dados": {
    demand: "Muito alta",
    demandCls: "bg-secondary/15 text-secondary border-secondary/30",
    daily: "Construir pipelines, orquestrar ETLs e manter plataformas de dados.",
    ladder: [["Júnior", "R$ 6-9k"], ["Pleno", "R$ 10-18k"], ["Sênior", "R$ 18-30k"]],
  },
  IoT: {
    demand: "Média",
    demandCls: "bg-primary/15 text-primary border-primary/30",
    daily: "Programar dispositivos, integrar sensores e tratar dados em tempo real.",
    ladder: [["Júnior", "R$ 4-7k"], ["Pleno", "R$ 7-12k"], ["Sênior", "R$ 12-20k"]],
  },
  "Engenharia de Software": {
    demand: "Muito alta",
    demandCls: "bg-secondary/15 text-secondary border-secondary/30",
    daily: "Arquitetar sistemas, garantir qualidade, mentorar e operar em produção.",
    ladder: [["Júnior", "R$ 5-8k"], ["Pleno", "R$ 9-18k"], ["Sênior", "R$ 18-32k"]],
  },
  Automação: {
    demand: "Alta",
    demandCls: "bg-warning/15 text-warning border-warning/30",
    daily: "Criar scripts, bots e integrações que eliminam trabalho repetitivo.",
    ladder: [["Júnior", "R$ 3-6k"], ["Pleno", "R$ 6-11k"], ["Sênior", "R$ 11-18k"]],
  },
  DevOps: {
    demand: "Muito alta",
    demandCls: "bg-secondary/15 text-secondary border-secondary/30",
    daily: "Automatizar deploys, operar infraestrutura e garantir observabilidade.",
    ladder: [["Júnior", "R$ 6-9k"], ["Pleno", "R$ 10-18k"], ["Sênior", "R$ 18-32k"]],
  },
  "Machine Learning": {
    demand: "Alta",
    demandCls: "bg-warning/15 text-warning border-warning/30",
    daily: "Treinar modelos, levá-los à produção e monitorar performance e drift.",
    ladder: [["Júnior", "R$ 6-10k"], ["Pleno", "R$ 11-20k"], ["Sênior", "R$ 20-35k"]],
  },
  Segurança: {
    demand: "Muito alta",
    demandCls: "bg-secondary/15 text-secondary border-secondary/30",
    daily: "Proteger aplicações, auditar código e responder a incidentes.",
    ladder: [["Júnior", "R$ 5-9k"], ["Pleno", "R$ 10-18k"], ["Sênior", "R$ 18-32k"]],
  },
  Finanças: {
    demand: "Média",
    demandCls: "bg-primary/15 text-primary border-primary/30",
    daily: "Modelar estratégias, analisar risco e automatizar decisões com dados.",
    ladder: [["Júnior", "R$ 6-10k"], ["Pleno", "R$ 12-22k"], ["Sênior", "R$ 22-40k"]],
  },
};

const DEFAULT_EXTRA: Extra = {
  demand: "Alta",
  demandCls: "bg-warning/15 text-warning border-warning/30",
  daily: "Resolver problemas reais com Python aplicando boas práticas de engenharia.",
  ladder: [["Júnior", "R$ 4-7k"], ["Pleno", "R$ 8-14k"], ["Sênior", "R$ 14-26k"]],
};

function CareerCard({ c }: { c: CareerPath }) {
  const extra = EXTRAS[c.area] ?? DEFAULT_EXTRA;
  return (
    <Card hover className="card-gradient flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <Badge className="mt-1 border-secondary/30 bg-secondary/10 text-secondary">
                {c.area}
              </Badge>
            </div>
          </div>
          <Badge className={levelColor(c.level)}>{LEVEL_LABELS[c.level]}</Badge>
        </div>

        <p className="mt-3 text-sm text-text-secondary">{c.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium",
              extra.demandCls,
            )}
          >
            <Flame className="h-3 w-3" /> Demanda: {extra.demand}
          </span>
          <span className="text-text-secondary">{extra.daily}</span>
        </div>

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
            <Sparkles className="h-3.5 w-3.5" /> Habilidades
          </p>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-surface px-2.5 py-0.5 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
            <Map className="h-3.5 w-3.5" /> Roadmap
          </p>
          <ol className="relative space-y-2 border-l border-border pl-4">
            {c.roadmap.map((step, i) => (
              <li key={step} className="relative text-sm text-text-secondary">
                <span className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                <span className="font-medium text-foreground">{i + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
            <Layers className="h-3.5 w-3.5" /> Tecnologias essenciais
          </p>
          <div className="flex flex-wrap gap-1.5">
            {c.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Progressão de senioridade */}
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
            <TrendingUp className="h-3.5 w-3.5" /> Senioridade & salário
          </p>
          <div className="grid grid-cols-3 gap-2">
            {extra.ladder.map(([lvl, sal], i) => (
              <div
                key={lvl}
                className={cn(
                  "rounded-lg border p-2 text-center",
                  i === 2
                    ? "border-secondary/30 bg-secondary/5"
                    : "border-border bg-surface",
                )}
              >
                <p className="text-[11px] text-text-secondary">{lvl}</p>
                <p className="text-xs font-semibold text-foreground">{sal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-secondary">
          <Banknote className="h-4 w-4" /> Faixa atual: {c.salary_range}
        </div>
      </CardContent>
    </Card>
  );
}

export function CarreiraView({ careers }: { careers: CareerPath[] }) {
  const [area, setArea] = useState("todas");
  const areas = useMemo(
    () => Array.from(new Set(careers.map((c) => c.area))).sort(),
    [careers],
  );
  const filtered =
    area === "todas" ? careers : careers.filter((c) => c.area === area);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setArea("todas")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            area === "todas"
              ? "border-primary bg-primary/15 text-primary"
              : "border-border bg-card text-text-secondary hover:text-foreground",
          )}
        >
          Todas as áreas
        </button>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setArea(a)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              area === a
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-text-secondary hover:text-foreground",
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
          >
            <CareerCard c={c} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
