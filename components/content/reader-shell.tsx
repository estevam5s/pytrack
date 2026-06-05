"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  List,
  PanelLeftClose,
} from "lucide-react";
import { setModuleProgressBySlug } from "@/lib/data/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonRef {
  slug: string;
  title: string;
  order: number;
}

const storageKey = (m: string) => `pytrack-lessons-${m}`;

function loadCompleted(moduleSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(moduleSlug)) ?? "[]");
  } catch {
    return [];
  }
}

export function ReaderShell({
  moduleSlug,
  moduleTitle,
  lessons,
  currentIndex,
  toc,
  children,
}: {
  moduleSlug: string;
  moduleTitle: string;
  lessons: LessonRef[];
  currentIndex: number;
  toc: { id: string; text: string; level: number }[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [navOpen, setNavOpen] = useState(false);

  const current = lessons[currentIndex];
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  useEffect(() => {
    setCompleted(loadCompleted(moduleSlug));
  }, [moduleSlug]);

  const pct = useMemo(
    () =>
      lessons.length
        ? Math.round((completed.length / lessons.length) * 100)
        : 0,
    [completed, lessons.length],
  );

  // Sincroniza o progresso do módulo com o Supabase (mínimo "em andamento").
  useEffect(() => {
    const synced = Math.max(pct, 5);
    void setModuleProgressBySlug(moduleSlug, synced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug]);

  const persist = (list: string[]) => {
    setCompleted(list);
    localStorage.setItem(storageKey(moduleSlug), JSON.stringify(list));
    window.dispatchEvent(new Event("pytrack-progress"));
    const newPct = lessons.length
      ? Math.round((list.length / lessons.length) * 100)
      : 0;
    void setModuleProgressBySlug(moduleSlug, Math.max(newPct, 5));
  };

  const isDone = completed.includes(current.slug);

  const toggleDone = () => {
    const list = isDone
      ? completed.filter((s) => s !== current.slug)
      : [...completed, current.slug];
    persist(list);
  };

  const completeAndNext = () => {
    if (!isDone) persist([...completed, current.slug]);
    if (next) router.push(`/conteudos/${moduleSlug}/${next.slug}`);
  };

  return (
    <div className="flex gap-8">
      {/* Lista de lições */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-y-auto border-r border-border bg-surface p-4 transition-transform lg:static lg:z-0 lg:block lg:w-72 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:p-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="lg:sticky lg:top-20">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href={`/conteudos/${moduleSlug}`}
              className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
            >
              {moduleTitle}
            </Link>
            <button
              onClick={() => setNavOpen(false)}
              className="text-text-secondary lg:hidden"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <nav className="space-y-0.5">
            {lessons.map((l, i) => {
              const done = completed.includes(l.slug);
              const active = i === currentIndex;
              return (
                <Link
                  key={l.slug}
                  href={`/conteudos/${moduleSlug}/${l.slug}`}
                  onClick={() => setNavOpen(false)}
                  className={cn(
                    "flex items-start gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-foreground"
                      : "text-text-secondary hover:bg-card hover:text-foreground",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  ) : (
                    <Circle
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        active ? "text-primary" : "text-text-secondary/50",
                      )}
                    />
                  )}
                  <span className="leading-snug">
                    <span className="mr-1 text-xs text-text-secondary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Conteúdo */}
      <div className="min-w-0 flex-1">
        <button
          onClick={() => setNavOpen(true)}
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-text-secondary lg:hidden"
        >
          <List className="h-4 w-4" /> Lições ({completed.length}/{lessons.length})
        </button>

        <article className="rounded-xl border border-border bg-card p-6 sm:p-9">
          {children}
        </article>

        {/* Navegação inferior */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {prev && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/conteudos/${moduleSlug}/${prev.slug}`}>
                  <ArrowLeft className="h-4 w-4" /> Anterior
                </Link>
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={isDone ? "secondary" : "outline"}
              size="sm"
              onClick={toggleDone}
            >
              <Check className="h-4 w-4" />
              {isDone ? "Concluída" : "Marcar lida"}
            </Button>
            {next ? (
              <Button size="sm" onClick={completeAndNext}>
                Próxima <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={toggleDone} variant="secondary">
                <CheckCircle2 className="h-4 w-4" /> Finalizar módulo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sumário (TOC) */}
      {toc.length > 1 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-20">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Nesta lição
            </p>
            <nav className="space-y-1 border-l border-border">
              {toc.map((h, i) => (
                <a
                  key={`${h.id}-${i}`}
                  href={`#${h.id}`}
                  className={cn(
                    "block border-l-2 border-transparent py-1 text-sm text-text-secondary transition-colors hover:border-primary hover:text-foreground",
                    h.level === 2 ? "-ml-px pl-3" : "-ml-px pl-6 text-xs",
                  )}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
