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
  const [contents, progress, books, courses] = await Promise.all([
    getContents(),
    getProgressMap(),
    getBooks(),
    getUdemyCourses(),
  ]);
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
                href={c.slug ? `/conteudos/${c.slug}` : "/conteudos"}
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
            <Link href="/conteudos">Ir para os conteúdos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
