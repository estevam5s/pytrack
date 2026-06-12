"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  FolderGit2,
  Github,
  ListChecks,
  Search,
  Wrench,
} from "lucide-react";
import type { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { ProjectSubmit } from "@/components/dashboard/project-submit";
import { LEVEL_LABELS, levelColor, cn } from "@/lib/utils";

const PAGE = 24;

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <Card className={cn("flex h-full flex-col", done && "border-secondary/40")}>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold leading-snug">{project.title}</h3>
              <p className="mt-0.5 text-xs text-text-secondary">{project.area}</p>
            </div>
          </div>
          <Badge className={levelColor(project.difficulty)}>
            {LEVEL_LABELS[project.difficulty]}
          </Badge>
        </div>

        <p className="mt-3 flex-1 text-sm text-text-secondary">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-primary"
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 flex w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
        >
          {open ? "Ocultar detalhes" : "Requisitos e passo a passo"}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
                <Wrench className="h-3.5 w-3.5" /> Requisitos
              </p>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                {project.requirements.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-primary">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-text-secondary">
                <ListChecks className="h-3.5 w-3.5" /> Passo a passo
              </p>
              <ol className="space-y-1.5 text-sm text-text-secondary">
                {project.steps.map((s, i) => (
                  <li key={s} className="flex gap-2">
                    <span className="font-semibold text-secondary">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
            </div>
            <ProjectSubmit
              title={project.title}
              description={project.description ?? ""}
              requirements={project.requirements ?? []}
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={done ? "secondary" : "outline"}
            onClick={() => setDone((d) => !d)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {done ? "Concluído" : "Marcar concluído"}
          </Button>
          {project.github_url && (
            <Button asChild size="sm" variant="ghost">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5" /> Repositório
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjetosView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("todos");
  const [area, setArea] = useState("todas");
  const [visible, setVisible] = useState(PAGE);

  const areas = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((p) => p.area)
            .filter((a): a is string => Boolean(a)),
        ),
      ).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => {
      if (difficulty !== "todos" && p.difficulty !== difficulty) return false;
      if (area !== "todas" && p.area !== area) return false;
      if (
        q &&
        !`${p.title} ${p.description} ${p.technologies.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [projects, query, difficulty, area]);

  const diffs = [
    { v: "todos", l: "Todos" },
    { v: "basico", l: "Básico" },
    { v: "intermediario", l: "Intermediário" },
    { v: "avancado", l: "Avançado" },
    { v: "desafio", l: "Desafio real" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="relative sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE);
            }}
            placeholder="Buscar projetos, tecnologias..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {diffs.map((d) => (
            <button
              key={d.v}
              onClick={() => {
                setDifficulty(d.v);
                setVisible(PAGE);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                difficulty === d.v
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {d.l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setArea("todas");
              setVisible(PAGE);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
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
              onClick={() => {
                setArea(a);
                setVisible(PAGE);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                area === a
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary">{filtered.length} projetos</p>
      </div>

      {filtered.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: (i % PAGE) * 0.02 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Carregar mais ({filtered.length - visible} restantes)
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="Nenhum projeto encontrado"
          description="Ajuste a busca, a dificuldade ou a área."
        />
      )}
    </div>
  );
}
