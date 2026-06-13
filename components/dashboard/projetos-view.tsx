"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  FolderGit2,
  Github,
  ListChecks,
  Search,
  Shuffle,
  Sparkles,
  Star,
  Wrench,
  X,
} from "lucide-react";
import type { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/states";
import { ProjectSubmit } from "@/components/dashboard/project-submit";
import { LEVEL_LABELS, levelColor, cn } from "@/lib/utils";

const PAGE = 24;
const DONE_KEY = "pytrack-projects-done";
const FAV_KEY = "pytrack-projects-fav";

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return new Set();
  }
}

function projKey(p: Project): string {
  return (p.id as string) ?? p.title;
}

function ProjectCard({
  project,
  done,
  fav,
  onToggleDone,
  onToggleFav,
  onPickTech,
}: {
  project: Project;
  done: boolean;
  fav: boolean;
  onToggleDone: () => void;
  onToggleFav: () => void;
  onPickTech: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      hover
      className={cn(
        "flex h-full flex-col",
        done && "border-secondary/40 bg-secondary/[0.03]",
      )}
    >
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                done
                  ? "bg-secondary/15 text-secondary"
                  : "bg-primary/10 text-primary-light",
              )}
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <FolderGit2 className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-semibold leading-snug",
                  done && "text-text-secondary line-through",
                )}
              >
                {project.title}
              </h3>
              <p className="mt-0.5 text-xs text-text-secondary">{project.area}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onToggleFav}
              aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
              className={cn(
                "rounded-md p-1 transition-colors",
                fav
                  ? "text-warning"
                  : "text-text-secondary/40 hover:text-warning",
              )}
            >
              <Star className={cn("h-4 w-4", fav && "fill-warning")} />
            </button>
            <Badge className={levelColor(project.difficulty)}>
              {LEVEL_LABELS[project.difficulty]}
            </Badge>
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm text-text-secondary">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <button
              key={t}
              onClick={() => onPickTech(t)}
              className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/15"
              title={`Filtrar por ${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-4 flex w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {open ? "Ocultar detalhes" : "Requisitos e passo a passo"}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
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
                        <span className="font-semibold text-secondary">
                          {i + 1}.
                        </span>{" "}
                        {s}
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={done ? "secondary" : "default"}
            onClick={onToggleDone}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {done ? "Concluído" : "Marcar concluído"}
          </Button>
          {project.github_url && (
            <Button asChild size="sm" variant="ghost">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3.5 w-3.5" /> Repositório
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type Sort = "relevancia" | "dificuldade" | "az";
const DIFF_RANK: Record<string, number> = {
  basico: 0,
  intermediario: 1,
  avancado: 2,
  desafio: 3,
};

export function ProjetosView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("todos");
  const [area, setArea] = useState("todas");
  const [tech, setTech] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [fav, setFav] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>("relevancia");
  const [show, setShow] = useState<"todos" | "pendentes" | "favoritos">("todos");
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    setDone(loadSet(DONE_KEY));
    setFav(loadSet(FAV_KEY));
  }, []);

  const persist = (key: string, set: Set<string>) =>
    localStorage.setItem(key, JSON.stringify([...set]));

  const toggleDone = (k: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      persist(DONE_KEY, next);
      window.dispatchEvent(new Event("pytrack-progress"));
      return next;
    });
  const toggleFav = (k: string) =>
    setFav((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      persist(FAV_KEY, next);
      return next;
    });

  const areas = useMemo(
    () =>
      Array.from(
        new Set(projects.map((p) => p.area).filter((a): a is string => Boolean(a))),
      ).sort(),
    [projects],
  );

  const resetPage = () => setVisible(PAGE);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = projects.filter((p) => {
      const k = projKey(p);
      if (difficulty !== "todos" && p.difficulty !== difficulty) return false;
      if (area !== "todas" && p.area !== area) return false;
      if (tech && !p.technologies.includes(tech)) return false;
      if (show === "pendentes" && done.has(k)) return false;
      if (show === "favoritos" && !fav.has(k)) return false;
      if (
        q &&
        !`${p.title} ${p.description} ${p.technologies.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
    if (sort === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "pt"));
    } else if (sort === "dificuldade") {
      list = [...list].sort(
        (a, b) => (DIFF_RANK[a.difficulty] ?? 0) - (DIFF_RANK[b.difficulty] ?? 0),
      );
    }
    return list;
  }, [projects, query, difficulty, area, tech, show, done, fav, sort]);

  const surprise = () => {
    const pool = filtered.length ? filtered : projects;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) return;
    const k = projKey(pick);
    setHighlight(k);
    // garante que o sorteado esteja visível
    const idx = filtered.findIndex((p) => projKey(p) === k);
    if (idx >= visible) setVisible(idx + 1);
    setTimeout(() => {
      document
        .getElementById(`proj-${k}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    setTimeout(() => setHighlight(null), 2200);
  };

  const diffs = [
    { v: "todos", l: "Todos" },
    { v: "basico", l: "Básico" },
    { v: "intermediario", l: "Intermediário" },
    { v: "avancado", l: "Avançado" },
    { v: "desafio", l: "Desafio real" },
  ];

  const doneCount = projects.filter((p) => done.has(projKey(p))).length;
  const pct = projects.length
    ? Math.round((doneCount / projects.length) * 100)
    : 0;

  return (
    <div>
      {/* barra de progresso/estatística */}
      <div className="mb-5 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-primary-light" /> Seu progresso
          </span>
          <span className="text-text-secondary">
            <strong className="text-foreground">{doneCount}</strong> de{" "}
            {projects.length} concluídos · {pct}%
          </span>
        </div>
        <Progress value={pct} className="mt-3" />
      </div>

      {/* controles */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Buscar projetos, tecnologias..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setSort((s) =>
                  s === "relevancia"
                    ? "dificuldade"
                    : s === "dificuldade"
                      ? "az"
                      : "relevancia",
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:text-foreground"
              title="Ordenar"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sort === "relevancia"
                ? "Relevância"
                : sort === "dificuldade"
                  ? "Dificuldade"
                  : "A-Z"}
            </button>
            <Button size="sm" variant="outline" onClick={surprise}>
              <Shuffle className="h-3.5 w-3.5" /> Surpreenda-me
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {diffs.map((d) => (
            <button
              key={d.v}
              onClick={() => {
                setDifficulty(d.v);
                resetPage();
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
          <span className="mx-1 w-px self-stretch bg-border" />
          {(
            [
              { v: "todos", l: "Todos" },
              { v: "pendentes", l: "Pendentes" },
              { v: "favoritos", l: "★ Favoritos" },
            ] as const
          ).map((s) => (
            <button
              key={s.v}
              onClick={() => {
                setShow(s.v);
                resetPage();
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                show === s.v
                  ? "border-secondary bg-secondary/15 text-secondary"
                  : "border-border bg-card text-text-secondary hover:text-foreground",
              )}
            >
              {s.l}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setArea("todas");
              resetPage();
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
                resetPage();
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

        <div className="flex items-center gap-3">
          <p className="text-xs text-text-secondary">{filtered.length} projetos</p>
          {tech && (
            <button
              onClick={() => {
                setTech(null);
                resetPage();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {tech} <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {filtered.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map((p, i) => {
              const k = projKey(p);
              return (
                <motion.div
                  key={k}
                  id={`proj-${k}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: (i % PAGE) * 0.015 }}
                  className={cn(
                    "scroll-mt-24 rounded-lg transition-shadow",
                    highlight === k && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  )}
                >
                  <ProjectCard
                    project={p}
                    done={done.has(k)}
                    fav={fav.has(k)}
                    onToggleDone={() => toggleDone(k)}
                    onToggleFav={() => toggleFav(k)}
                    onPickTech={(t) => {
                      setTech(t);
                      resetPage();
                    }}
                  />
                </motion.div>
              );
            })}
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
          description="Ajuste a busca, a dificuldade, a área ou os filtros."
        />
      )}
    </div>
  );
}
