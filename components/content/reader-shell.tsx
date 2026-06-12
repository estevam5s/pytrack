"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Clock,
  NotebookPen,
  Lock,
  Loader2,
  X,
} from "lucide-react";
import { setModuleProgressBySlug } from "@/lib/data/actions";
import { recordStudyTime, saveNote, getNote } from "@/lib/study-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// tempo mínimo de estudo (segundos) por lição antes de poder concluir (anti-trapaça)
const MIN_STUDY_SECONDS = 45;

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

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

  // ——— timer de estudo (anti-trapaça) ———
  const [studied, setStudied] = useState(0); // segundos na lição atual
  const pendingRef = useRef(0); // segundos ainda não enviados ao servidor
  const current = lessons[currentIndex];

  useEffect(() => {
    setStudied(0); pendingRef.current = 0;
    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    // conta 1s por segundo enquanto a aba está visível
    const tick = setInterval(() => { if (visible) { setStudied((s) => s + 1); pendingRef.current += 1; } }, 1000);
    // envia o acumulado ao servidor a cada 30s
    const flush = setInterval(() => {
      if (pendingRef.current > 0) {
        const sec = pendingRef.current; pendingRef.current = 0;
        void recordStudyTime({ slug: moduleSlug, title: moduleTitle, seconds: sec });
      }
    }, 30000);
    const onUnload = () => { if (pendingRef.current > 0) void recordStudyTime({ slug: moduleSlug, title: moduleTitle, seconds: pendingRef.current }); };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      clearInterval(tick); clearInterval(flush);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", onUnload);
      if (pendingRef.current > 0) void recordStudyTime({ slug: moduleSlug, title: moduleTitle, seconds: pendingRef.current });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug, current.slug]);

  // ——— anotações ———
  const [notesOpen, setNotesOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteStatus, setNoteStatus] = useState<"idle" | "saving" | "saved">("idle");
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { void getNote(moduleSlug).then(setNote); }, [moduleSlug]);
  function onNoteChange(v: string) {
    setNote(v); setNoteStatus("saving");
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(async () => {
      await saveNote({ slug: moduleSlug, title: moduleTitle, body: v });
      setNoteStatus("saved");
    }, 900);
  }
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
  // anti-trapaça: só pode concluir após o tempo mínimo de estudo (ou se já concluiu antes)
  const canComplete = isDone || studied >= MIN_STUDY_SECONDS;
  const remaining = Math.max(0, MIN_STUDY_SECONDS - studied);

  const toggleDone = () => {
    if (!isDone && !canComplete) return;
    const list = isDone
      ? completed.filter((s) => s !== current.slug)
      : [...completed, current.slug];
    if (!isDone) void recordStudyTime({ slug: moduleSlug, title: moduleTitle, seconds: 0, lesson: true });
    persist(list);
  };

  const completeAndNext = () => {
    if (!isDone && !canComplete) return;
    if (!isDone) { persist([...completed, current.slug]); void recordStudyTime({ slug: moduleSlug, title: moduleTitle, seconds: 0, lesson: true }); }
    if (next) router.push(`/conteudos/${moduleSlug}/${next.slug}`);
  };

  return (
    <div className="flex gap-8 lg:h-[calc(100dvh-8.5rem)] lg:overflow-hidden">
      {/* Lista de lições */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-y-auto border-r border-border bg-surface p-4 transition-transform lg:static lg:z-0 lg:block lg:h-full lg:w-72 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:p-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="lg:pr-2">
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
      <div className="min-w-0 flex-1 lg:h-full lg:overflow-y-auto lg:pr-2">
        <button
          onClick={() => setNavOpen(true)}
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-text-secondary lg:hidden"
        >
          <List className="h-4 w-4" /> Lições ({completed.length}/{lessons.length})
        </button>

        {/* barra de estudo: tempo + anotações */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2/40 px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="h-4 w-4 text-primary-light" /> Tempo nesta lição: <span className="font-semibold text-foreground">{fmtTime(studied)}</span>
            {!isDone && remaining > 0 && <span className="text-xs">· faltam {remaining}s para liberar a conclusão</span>}
          </span>
          <button onClick={() => setNotesOpen((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary/40">
            <NotebookPen className="h-3.5 w-3.5" /> Anotações
          </button>
        </div>

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
              disabled={!canComplete}
              title={!canComplete ? `Estude por mais ${remaining}s para concluir` : undefined}
            >
              {canComplete ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {isDone ? "Concluída" : canComplete ? "Marcar lida" : `Aguarde ${remaining}s`}
            </Button>
            {next ? (
              <Button size="sm" onClick={completeAndNext} disabled={!canComplete}>
                Próxima <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={toggleDone} variant="secondary" disabled={!canComplete}>
                <CheckCircle2 className="h-4 w-4" /> Finalizar módulo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* painel de anotações (lateral) */}
      {notesOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="flex items-center gap-2 font-bold"><NotebookPen className="h-4 w-4 text-primary-light" /> Suas anotações</h3>
            <button onClick={() => setNotesOpen(false)} className="rounded p-1 text-text-secondary hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <p className="px-4 pt-3 text-xs text-text-secondary">{moduleTitle} · salvo automaticamente. Veja todas em <Link href="/anotacoes" className="text-primary-light hover:underline">Anotações</Link>.</p>
          <textarea value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder="Escreva suas anotações deste módulo…" className="m-4 flex-1 resize-none rounded-lg border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary" />
          <div className="px-4 pb-4 text-right text-xs text-text-secondary">
            {noteStatus === "saving" ? <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> salvando…</span> : noteStatus === "saved" ? <span className="text-green">✓ salvo</span> : null}
          </div>
        </div>
      )}

      {/* Sumário (TOC) */}
      {toc.length > 1 && (
        <aside className="hidden w-56 shrink-0 xl:block xl:h-full xl:overflow-y-auto">
          <div className="py-1">
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
