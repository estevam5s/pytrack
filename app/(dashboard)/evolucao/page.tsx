import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  TrendingDown,
  Trophy,
} from "lucide-react";
import {
  computeStats,
  getBooks,
  getContents,
  getProgressMap,
  getUdemyCourses,
} from "@/lib/data/queries";
import { Compass } from "lucide-react";
import { TRILHAS } from "@/lib/trilhas";
import { getCareerPlan } from "@/lib/career-plan-actions";
import { Markdown } from "@/components/content/markdown";
import { FileDown, ArrowUp, ArrowDown, Minus, Sparkles } from "lucide-react";
import { getEvolutionReport } from "@/lib/evolution-report";
import { ReportExport } from "@/components/dashboard/report-export";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PythonLevelCard } from "@/components/home/python-level-card";
import { EcosystemAnalysis } from "@/components/dashboard/ecosystem-analysis";
import {
  OverallRadial,
  SkillRadar,
  StatusDonut,
} from "@/components/dashboard/evolution-charts";

export const metadata = { title: "Evolução · PyTrack" };

export default async function EvolucaoPage() {
  const [contents, progress, books, courses, careerPlan] = await Promise.all([
    getContents(),
    getProgressMap(),
    getBooks(),
    getUdemyCourses(),
    getCareerPlan(),
  ]);
  const report = await getEvolutionReport();
  const stats = computeStats(contents, progress);
  const notStarted = stats.total - stats.completed - stats.started;
  const booksRead = books.filter((b) => b.status === "concluido").length;
  const coursesCompleted = courses.filter((c) => c.status === "concluido").length;
  const serverCounts = {
    modules: stats.completed,
    books: booksRead,
    courses: coursesCompleted,
  };

  // dados analíticos por área
  const radarData = [...stats.byArea]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((a) => ({ area: a.area, percentage: a.percentage }));

  const strengths = [...stats.byArea]
    .filter((a) => a.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
  const gaps = [...stats.byArea]
    .filter((a) => a.percentage < 100)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  const nextSteps = contents
    .filter((c) => (progress[c.id]?.status ?? "nao_iniciado") !== "concluido")
    .sort((a, b) => a.order_index - b.order_index)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evolução"
        description="Painel analítico completo: nível, XP, mapa de proficiência no ecossistema Python, forças, lacunas e próximos passos."
      />

      {/* Resumo executivo gerado por IA */}
      {report?.aiSummary && (
        <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-light"><Sparkles className="h-3.5 w-3.5" /> Resumo da sua evolução (IA)</p>
          <p className="mt-2 text-sm leading-relaxed">{report.aiSummary}</p>
        </section>
      )}

      {/* Comparativo: este mês vs mês anterior */}
      {report && report.monthly.length >= 2 && (() => {
        const cur = report.monthly[report.monthly.length - 1];
        const prev = report.monthly[report.monthly.length - 2];
        const items = [
          { label: "Horas de estudo", cur: cur.studyHours, prev: prev.studyHours, suffix: "h" },
          { label: "Exercícios", cur: cur.exercises, prev: prev.exercises, suffix: "" },
          { label: "Dias ativos", cur: cur.activeDays, prev: prev.activeDays, suffix: "" },
        ];
        return (
          <section className="grid gap-3 sm:grid-cols-3">
            {items.map((it) => {
              const diff = it.cur - it.prev;
              const up = diff > 0, down = diff < 0;
              const pct = it.prev > 0 ? Math.round((diff / it.prev) * 100) : it.cur > 0 ? 100 : 0;
              return (
                <div key={it.label} className="card p-4">
                  <p className="text-xs text-text-secondary">{it.label} · este mês ({cur.label})</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-2xl font-bold">{it.cur}{it.suffix}</span>
                    <span className={`mb-1 inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green" : down ? "text-red-400" : "text-text-secondary"}`}>
                      {up ? <ArrowUp className="h-3.5 w-3.5" /> : down ? <ArrowDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                      {diff === 0 ? "estável" : `${diff > 0 ? "+" : ""}${diff}${it.suffix} (${pct > 0 ? "+" : ""}${pct}%)`}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary/70">mês anterior ({prev.label}): {it.prev}{it.suffix}</p>
                </div>
              );
            })}
          </section>
        );
      })()}

      {/* Relatório completo exportável */}
      {report && (
        <section className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-bold"><FileDown className="h-5 w-5 text-primary-light" /> Relatório completo</h2>
            <p className="text-sm text-text-secondary">Baixe um relatório com toda a sua experiência (atividade, estudo, exercícios, conquistas) em vários formatos.</p>
          </div>
          <ReportExport report={report} areas={radarData.map((a) => ({ area: a.area, pct: a.percentage }))} />
        </section>
      )}

      {/* Resumo mês a mês */}
      {report && report.monthly.some((m) => m.studyHours > 0 || m.exercises > 0 || m.activeDays > 0) && (
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-bold">Evolução mês a mês <span className="text-sm font-normal text-text-secondary">(12 meses)</span></h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {report.monthly.map((m) => {
              const maxH = Math.max(1, ...report.monthly.map((x) => x.studyHours));
              return (
                <div key={m.month} className="flex w-[88px] shrink-0 flex-col items-center gap-1 rounded-xl border border-border bg-surface-2 p-3 text-center">
                  <div className="flex h-20 items-end">
                    <div className="w-6 rounded-t bg-gradient-to-t from-primary to-primary-light" style={{ height: `${Math.max(4, (m.studyHours / maxH) * 100)}%` }} title={`${m.studyHours}h de estudo`} />
                  </div>
                  <span className="text-xs font-semibold">{m.label}</span>
                  <span className="text-[11px] text-text-secondary">{m.studyHours}h · {m.exercises} ex.</span>
                  <span className="text-[10px] text-text-secondary/60">{m.activeDays} dias</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Plano de carreira personalizado (Suprema) */}
      {careerPlan?.plan && (
        <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold"><Compass className="h-5 w-5 text-primary-light" /> Seu plano de carreira personalizado</h2>
            <Link href="/minhas-trilhas" className="text-xs text-primary-light hover:underline">Editar →</Link>
          </div>
          {Array.isArray(careerPlan.recommended_tracks) && careerPlan.recommended_tracks.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {(careerPlan.recommended_tracks as string[]).map((id, i) => {
                const t = TRILHAS.find((x) => x.id === id);
                return <Link key={id} href={`/minhas-trilhas/${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-light hover:bg-primary/20"><span className="font-bold">{i + 1}.</span> {t?.title ?? id}</Link>;
              })}
            </div>
          )}
          <details>
            <summary className="cursor-pointer text-sm text-primary-light">Ver plano completo</summary>
            <div className="mt-2 rounded-xl border border-border bg-surface-2 p-4 text-sm leading-relaxed">
              <Markdown>{careerPlan.plan as string}</Markdown>
            </div>
          </details>
        </section>
      )}

      {/* Visão geral: nível + radial */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PythonLevelCard serverCounts={serverCounts} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Conclusão geral</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallRadial value={stats.overallPercentage} />
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conclusão geral" value={`${stats.overallPercentage}%`} icon={Trophy} />
        <StatCard label="Concluídos" value={stats.completed} icon={CheckCircle2} accent="secondary" />
        <StatCard label="Em andamento" value={stats.started} icon={Flame} accent="warning" />
        <StatCard label="Horas estudadas" value={`${stats.hoursStudied}h`} icon={Clock} />
      </section>

      {/* Mapa de proficiência + status */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mapa de proficiência no ecossistema Python</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadar data={radarData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status dos conteúdos</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDonut
              completed={stats.completed}
              inProgress={stats.started}
              notStarted={notStarted}
            />
          </CardContent>
        </Card>
      </section>

      {/* Análise de XP e atividade */}
      <EcosystemAnalysis serverCounts={serverCounts} />

      {/* Forças e lacunas */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-secondary" /> Seus pontos fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengths.length ? (
              strengths.map((a) => (
                <div key={a.area}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{a.area}</span>
                    <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                      {a.percentage}%
                    </Badge>
                  </div>
                  <Progress value={a.percentage} />
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">
                Conclua conteúdos para revelar seus pontos fortes.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-warning" /> Foque para evoluir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gaps.map((a) => (
              <div key={a.area}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{a.area}</span>
                  <span className="text-text-secondary">
                    {a.completed}/{a.total} · {a.percentage}%
                  </span>
                </div>
                <Progress value={a.percentage} indicatorClassName="from-warning to-danger" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Ranking completo */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de habilidades por área</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {stats.byArea.map((a) => (
              <div key={a.area}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{a.area}</span>
                  <span className="text-text-secondary">
                    {a.completed}/{a.total} · {a.percentage}%
                  </span>
                </div>
                <Progress value={a.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximos passos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Próximos passos recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {nextSteps.map((c, i) => (
              <Link
                key={c.id}
                href={c.slug ? `/conteudos/${c.slug}` : "/minhas-trilhas"}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-text-secondary">{c.category}</p>
                </div>
                <BookOpen className="h-4 w-4 shrink-0 text-text-secondary" />
              </Link>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
            <Link href="/minhas-trilhas">Ir para os conteúdos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
