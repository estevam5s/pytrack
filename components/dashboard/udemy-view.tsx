"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { UdemyCourse } from "@/types";
import { deleteCourse } from "@/lib/data/udemy-actions";
import {
  analyzeUdemyCourse,
  analyzeUdemyCollection,
  type CourseAnalysis,
  type CollectionAnalysis,
} from "@/lib/ai/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { CourseForm } from "@/components/forms/course-form";
import { StatCard } from "@/components/cards/stat-card";
import {
  OverallRadial,
  StatusDonut,
  AreaProgressChart,
} from "@/components/dashboard/evolution-charts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LEVEL_LABELS,
  STATUS_LABELS,
  cn,
  levelColor,
  statusColor,
} from "@/lib/utils";

function hoursOf(d: string | null): number {
  if (!d) return 0;
  const m = d.match(/(\d+(?:[.,]\d+)?)/);
  return m ? Math.round(parseFloat(m[1].replace(",", "."))) : 0;
}

function CourseCard({
  course,
  onOpen,
  onEdit,
  onDelete,
}: {
  course: UdemyCourse;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      hover
      className="group flex cursor-pointer flex-col overflow-hidden"
      onClick={onOpen}
    >
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-primary/20 via-surface to-secondary/10">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded-md bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-primary hover:text-white"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-md bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-danger hover:text-white"
            aria-label="Remover"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <Badge className={cn("absolute bottom-2 left-2", statusColor(course.status))}>
          {STATUS_LABELS[course.status]}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold">{course.title}</h3>
        {course.instructor && (
          <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
            <User2 className="h-3 w-3" /> {course.instructor}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge className={levelColor(course.level)}>{LEVEL_LABELS[course.level]}</Badge>
          {course.category && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">
              {course.category}
            </span>
          )}
          {course.duration && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-text-secondary">
              <Clock className="h-3 w-3" /> {course.duration}
            </span>
          )}
        </div>
        <div className="mt-auto pt-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-light">
            Ver detalhes & análise IA <Sparkles className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function UdemyView({ courses }: { courses: UdemyCourse[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UdemyCourse | null>(null);
  const [deleting, setDeleting] = useState<UdemyCourse | null>(null);
  const [detail, setDetail] = useState<UdemyCourse | null>(null);
  const [pending, startTransition] = useTransition();

  const [collection, setCollection] = useState<CollectionAnalysis | null>(null);
  const [colLoading, setColLoading] = useState(false);

  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((c) => c.status === "concluido").length;
    const started = courses.filter((c) => c.status === "em_andamento").length;
    const notStarted = total - completed - started;
    const hours = courses.reduce((s, c) => s + hoursOf(c.duration), 0);
    const pct = total ? Math.round((completed / total) * 100) : 0;

    const byCat = new Map<string, number>();
    for (const c of courses) {
      const k = c.category || "Sem categoria";
      byCat.set(k, (byCat.get(k) ?? 0) + 1);
    }
    const categories = [...byCat.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([area, n]) => ({ area, percentage: Math.round((n / total) * 100) }));

    const levels = (["basico", "intermediario", "avancado"] as const).map((lv) => ({
      level: lv,
      count: courses.filter((c) => c.level === lv).length,
    }));

    return { total, completed, started, notStarted, hours, pct, categories, levels };
  }, [courses]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: UdemyCourse) => {
    setEditing(c);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      await deleteCourse(deleting.id);
      setDeleting(null);
      router.refresh();
    });
  };

  const runCollection = async () => {
    setColLoading(true);
    const res = await analyzeUdemyCollection({
      courses: courses.map((c) => ({
        title: c.title,
        category: c.category,
        level: c.level,
        status: c.status,
      })),
    });
    setCollection(res);
    setColLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">
          {stats.total} {stats.total === 1 ? "curso" : "cursos"} na sua trilha ·{" "}
          {stats.completed} concluído(s)
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runCollection} disabled={colLoading || !stats.total}>
            {colLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            Analisar trilha com IA
          </Button>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Adicionar curso
          </Button>
        </div>
      </div>

      {stats.total > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Cursos" value={stats.total} icon={GraduationCap} />
            <StatCard label="Concluídos" value={stats.completed} icon={CheckCircle2} accent="secondary" />
            <StatCard label="Em andamento" value={stats.started} icon={TrendingUp} accent="warning" />
            <StatCard label="Horas" value={`${stats.hours}h`} icon={Clock} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="min-w-0">
              <CardContent className="p-5">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <Target className="h-4 w-4 text-primary" /> Conclusão geral
                </p>
                <OverallRadial value={stats.pct} />
              </CardContent>
            </Card>
            <Card className="min-w-0">
              <CardContent className="p-5">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-primary" /> Status dos cursos
                </p>
                <StatusDonut
                  completed={stats.completed}
                  inProgress={stats.started}
                  notStarted={stats.notStarted}
                />
              </CardContent>
            </Card>
            <Card className="min-w-0">
              <CardContent className="p-5">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                  <Layers className="h-4 w-4 text-primary" /> Por nível
                </p>
                <div className="space-y-3">
                  {stats.levels.map((l) => (
                    <div key={l.level}>
                      <div className="mb-1 flex justify-between text-xs text-text-secondary">
                        <span>{LEVEL_LABELS[l.level]}</span>
                        <span>{l.count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${stats.total ? (l.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {stats.categories.length > 0 && (
            <Card className="min-w-0">
              <CardContent className="p-5">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                  <Layers className="h-4 w-4 text-primary" /> Stack dos seus cursos
                </p>
                <AreaProgressChart data={stats.categories} />
              </CardContent>
            </Card>
          )}
        </>
      )}

      <AnimatePresence>
        {collection && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-primary/30">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 font-semibold">
                    <Brain className="h-4 w-4 text-primary-light" /> Análise da sua trilha de cursos
                  </p>
                  <button onClick={() => setCollection(null)} className="text-text-secondary hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {collection.error ? (
                  <p className="text-sm text-danger">{collection.error}</p>
                ) : (
                  <div className="space-y-4 text-sm">
                    <p className="leading-relaxed text-text-secondary">{collection.summary}</p>
                    {collection.coverage.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Cobertura</p>
                        <div className="flex flex-wrap gap-1.5">
                          {collection.coverage.map((c) => (
                            <span
                              key={c.area}
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 text-xs",
                                c.level === "forte" && "border-secondary/30 bg-secondary/10 text-secondary",
                                c.level === "media" && "border-warning/30 bg-warning/10 text-warning",
                                c.level === "fraca" && "border-danger/30 bg-danger/10 text-danger",
                              )}
                            >
                              {c.area}: {c.level}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AnalysisList title="Pontos fortes" items={collection.strengths} icon={CheckCircle2} color="text-secondary" />
                      <AnalysisList title="Lacunas" items={collection.gaps} icon={Target} color="text-warning" />
                    </div>
                    <AnalysisList title="Recomendações" items={collection.recommendations} icon={Lightbulb} color="text-primary-light" />
                    {collection.suggested_order.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Ordem sugerida</p>
                        <ol className="list-inside list-decimal space-y-1 text-text-secondary">
                          {collection.suggested_order.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </div>
                    )}
                    {collection.model && (
                      <p className="text-[11px] text-text-secondary">Análise gerada por IA ({collection.model}).</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {stats.total === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Nenhum curso ainda"
          description="Adicione seus cursos da Udemy. Cole a URL e importe título, banner e descrição automaticamente."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Adicionar primeiro curso
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onOpen={() => setDetail(c)}
              onEdit={() => openEdit(c)}
              onDelete={() => setDeleting(c)}
            />
          ))}
        </div>
      )}

      {detail && (
        <CourseDetail
          course={detail}
          onClose={() => setDetail(null)}
          onEdit={() => {
            openEdit(detail);
            setDetail(null);
          }}
        />
      )}

      <CourseForm open={formOpen} onOpenChange={setFormOpen} course={editing} onSaved={() => router.refresh()} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover curso?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; será removido permanentemente da sua lista.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="danger" onClick={confirmDelete} disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnalysisList({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  color: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <Icon className={cn("h-3.5 w-3.5", color)} /> {title}
      </p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-text-secondary">
            <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", color.replace("text-", "bg-"))} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CourseDetail({
  course,
  onClose,
  onEdit,
}: {
  course: UdemyCourse;
  onClose: () => void;
  onEdit: () => void;
}) {
  const [analysis, setAnalysis] = useState<CourseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await analyzeUdemyCourse({
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      level: course.level,
      duration: course.duration,
      description: course.description,
    });
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card sm:rounded-2xl"
        >
          <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/25 via-surface to-secondary/10">
            {course.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <GraduationCap className="h-14 w-14 text-primary/50" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
            <Badge className={cn("absolute bottom-3 left-3", statusColor(course.status))}>
              {STATUS_LABELS[course.status]}
            </Badge>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              {course.instructor && (
                <span className="inline-flex items-center gap-1">
                  <User2 className="h-3.5 w-3.5" />
                  {course.instructor}
                </span>
              )}
              {course.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration}
                </span>
              )}
              <Badge className={levelColor(course.level)}>{LEVEL_LABELS[course.level]}</Badge>
              {course.category && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px]">{course.category}</span>
              )}
            </div>

            {course.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {course.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {course.url && (
                <Button asChild size="sm" variant="outline">
                  <a href={course.url} target="_blank" rel="noopener noreferrer">
                    Abrir na Udemy <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
              <Button size="sm" onClick={analyze} disabled={loading} className="ml-auto">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Analisar curso com IA
              </Button>
            </div>

            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-5 overflow-hidden"
                >
                  <div className="rounded-xl border border-primary/30 bg-surface/50 p-5">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Brain className="h-4 w-4 text-primary-light" /> Análise da IA
                    </p>
                    {analysis.error ? (
                      <p className="text-sm text-danger">{analysis.error}</p>
                    ) : (
                      <div className="space-y-4 text-sm">
                        <p className="leading-relaxed text-text-secondary">{analysis.summary}</p>

                        <div>
                          <div className="mb-1 flex justify-between text-xs text-text-secondary">
                            <span>Dificuldade estimada</span>
                            <span>{analysis.difficulty}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-secondary via-warning to-danger"
                              style={{ width: `${analysis.difficulty}%` }}
                            />
                          </div>
                        </div>

                        {analysis.stack.length > 0 && (
                          <div>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Stack abordada</p>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.stack.map((s) => (
                                <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <AnalysisList title="Você vai aprender" items={analysis.learnings} icon={CheckCircle2} color="text-secondary" />
                        <AnalysisList title="Pré-requisitos" items={analysis.prerequisites} icon={Target} color="text-warning" />
                        <AnalysisList title="Dicas" items={analysis.tips} icon={Lightbulb} color="text-primary-light" />

                        {analysis.audience && (
                          <p className="text-text-secondary">
                            <span className="font-medium text-foreground">Para quem é:</span> {analysis.audience}
                          </p>
                        )}
                        {analysis.career_fit && (
                          <p className="text-text-secondary">
                            <span className="font-medium text-foreground">Na carreira:</span> {analysis.career_fit}
                          </p>
                        )}
                        {analysis.model && (
                          <p className="text-[11px] text-text-secondary">Gerado por IA ({analysis.model}).</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
