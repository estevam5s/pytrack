"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown, Search, Clock, GraduationCap, Wrench, Boxes, ListChecks,
  Briefcase, BookOpen, ExternalLink, TrendingUp, Layers,
  Code, Database, Zap, Radio, Container, Workflow, CheckCheck, Flame,
  BarChart3, LineChart, Sigma, GitBranch, Table, Notebook, Feather,
  Cloud, Layout, Github, Cpu, Box, type LucideIcon,
} from "lucide-react";

// mapeia o nome do ícone (lucide kebab-case, salvo no banco) → componente
const ICONS: Record<string, LucideIcon> = {
  code: Code, database: Database, zap: Zap, radio: Radio, container: Container,
  workflow: Workflow, "check-check": CheckCheck, flame: Flame, "bar-chart-3": BarChart3,
  "line-chart": LineChart, sigma: Sigma, "git-branch": GitBranch, table: Table,
  notebook: Notebook, feather: Feather, cloud: Cloud, layout: Layout, github: Github, cpu: Cpu,
};
const iconFor = (name: string | null) => (name && ICONS[name]) || Box;
import { cn, LEVEL_LABELS, levelColor } from "@/lib/utils";
import { STACK_META, DEFAULT_META } from "@/lib/stack-meta";
import type { StackItem } from "@/types";

interface Props {
  items: StackItem[];
  userXp: number;
  userLevel: string;
  areaProgress: Record<string, { done: number; total: number }>;
  loggedIn: boolean;
}

// mapeia categoria da stack → área de conteúdo (para puxar progresso)
const CAT_TO_AREA: Record<string, string[]> = {
  "Web/APIs": ["Backend", "Web/APIs", "APIs & Web"],
  "Banco de Dados": ["Banco de Dados", "Bancos de Dados"],
  "Data Science": ["Data Science", "Ciência de Dados"],
  "Machine Learning": ["Machine Learning", "Machine Learning e IA"],
  "Engenharia de Dados": ["Engenharia de Dados", "Big Data"],
  DevOps: ["DevOps", "DevOps & Cloud"],
  Async: ["Async & Concorrência", "Async"],
  Automação: ["Automação", "Automação e Scripts"],
  Qualidade: ["Testes & Qualidade", "Qualidade"],
  IoT: ["IoT", "IoT & Embarcados"],
  Linguagem: ["Fundamentos", "Fundamentos da Linguagem"],
};

const LEVEL_HINT: Record<string, string> = {
  basico: "Comece aqui — fundamentos.",
  intermediario: "Você já programa em Python.",
  avancado: "Requer base sólida e projetos.",
};

export function StackExplorer({ items, userXp, userLevel, areaProgress, loggedIn }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  // agrupa por categoria
  const groups = useMemo(() => {
    const map = new Map<string, StackItem[]>();
    for (const it of items) {
      if (query && !`${it.name} ${it.category} ${it.description ?? ""}`.toLowerCase().includes(query.toLowerCase())) continue;
      if (!map.has(it.category)) map.set(it.category, []);
      map.get(it.category)!.push(it);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [items, query]);

  function areaPct(category: string): number {
    const areas = CAT_TO_AREA[category] ?? [];
    let done = 0, total = 0;
    for (const a of areas) {
      if (areaProgress[a]) { done += areaProgress[a].done; total += areaProgress[a].total; }
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  return (
    <div>
      {/* resumo do usuário */}
      {loggedIn && (
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="card flex items-center gap-3 p-4">
            <TrendingUp className="h-6 w-6 text-primary-light" />
            <div><p className="text-xl font-bold">{userXp}</p><p className="text-xs text-text-secondary">XP acumulado</p></div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <GraduationCap className="h-6 w-6 text-secondary" />
            <div><p className="text-xl font-bold capitalize">{userLevel}</p><p className="text-xs text-text-secondary">Seu nível atual</p></div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <Layers className="h-6 w-6 text-blue-400" />
            <div><p className="text-xl font-bold">{items.length}</p><p className="text-xs text-text-secondary">Tecnologias mapeadas</p></div>
          </div>
        </div>
      )}

      {/* busca */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar tecnologia ou categoria..."
          className="w-full rounded-xl border border-border bg-surface px-9 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* categorias */}
      <div className="space-y-3">
        {groups.map(([category, techs]) => {
          const meta = STACK_META[category] ?? DEFAULT_META;
          const pct = areaPct(category);
          const isOpen = open === category;
          return (
            <div key={category} className={cn("card overflow-hidden p-0", isOpen && "border-primary/40")}>
              <button onClick={() => setOpen(isOpen ? null : category)} className="flex w-full items-center gap-4 p-5 text-left">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Boxes className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{category}</h3>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-secondary">{techs.length} techs</span>
                  </div>
                  <p className="truncate text-sm text-text-secondary">{meta.tagline}</p>
                </div>
                {/* progresso do usuário nessa área */}
                {loggedIn && (
                  <div className="hidden w-28 sm:block">
                    <div className="flex items-center justify-between text-[10px] text-text-secondary"><span>seu domínio</span><span>{pct}%</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${pct}%` }} /></div>
                  </div>
                )}
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-text-secondary transition-transform", isOpen && "rotate-180")} />
              </button>

              {/* conteúdo expandido com animação */}
              <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                  <div className="space-y-5 border-t border-border p-5">
                    {/* métricas */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Metric icon={Clock} label="Para dominar" value={`~${meta.hoursToMaster}h`} />
                      <Metric icon={GraduationCap} label="Cargos" value={`${meta.careers.length}`} />
                      <Metric icon={Boxes} label="Tecnologias" value={`${techs.length}`} />
                      <Metric icon={ListChecks} label="Seu domínio" value={`${pct}%`} />
                    </div>

                    {/* tecnologias da stack (com logos) */}
                    <Section icon={Boxes} title="Tecnologias desta stack">
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t) => {
                          const TIcon = iconFor(t.icon);
                          return (
                            <span key={t.id} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs">
                              <TIcon className="h-3.5 w-3.5 text-primary-light" />
                              {t.name}
                              <span className={cn("rounded px-1 text-[9px]", levelColor(t.level))}>{LEVEL_LABELS[t.level]?.[0] ?? "•"}</span>
                            </span>
                          );
                        })}
                      </div>
                    </Section>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Section icon={Briefcase} title="Onde é usada (tipos de projeto)">
                        <ul className="space-y-1 text-sm text-text-secondary">{meta.projectTypes.map((p) => <li key={p}>• {p}</li>)}</ul>
                      </Section>
                      <Section icon={GraduationCap} title="Pré-requisitos para começar">
                        <ul className="space-y-1 text-sm text-text-secondary">{meta.prerequisites.map((p) => <li key={p}>• {p}</li>)}</ul>
                      </Section>
                      <Section icon={Boxes} title="Tecnologias relacionadas">
                        <div className="flex flex-wrap gap-1.5">{meta.technologies.map((p) => <span key={p} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-text-secondary">{p}</span>)}</div>
                      </Section>
                      <Section icon={Wrench} title="Ferramentas do dia a dia">
                        <div className="flex flex-wrap gap-1.5">{meta.tools.map((p) => <span key={p} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">{p}</span>)}</div>
                      </Section>
                    </div>

                    <Section icon={Briefcase} title="Cargos que dominam esta stack">
                      <div className="flex flex-wrap gap-1.5">{meta.careers.map((c) => <span key={c} className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs text-secondary">{c}</span>)}</div>
                    </Section>

                    {/* ações */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {meta.relatedTrack && (
                        <Link href={`/trilhas/${meta.relatedTrack}`} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white">
                          <BookOpen className="h-4 w-4" /> Trilha relacionada
                        </Link>
                      )}
                      {techs[0]?.documentation_url && (
                        <a href={techs[0].documentation_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-foreground">
                          Documentação <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{LEVEL_HINT[meta.prerequisites.length > 2 ? "avancado" : "intermediario"]}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary-light" />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Clock; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary"><Icon className="h-3.5 w-3.5" /> {title}</p>
      {children}
    </div>
  );
}
