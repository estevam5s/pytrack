import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  FolderGit2,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Terminal,
} from "lucide-react";
import {
  computeStats,
  getBooks,
  getCareerPaths,
  getContents,
  getProfile,
  getProgressMap,
  getProjects,
  getStackItems,
  getUdemyCourses,
} from "@/lib/data/queries";
import { StatCard } from "@/components/cards/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PythonLevelCard } from "@/components/home/python-level-card";
import { PomodoroCoffee } from "@/components/home/pomodoro-coffee";
import { CodeShowcase } from "@/components/home/code-showcase";
import {
  AreaProgressChart,
  SkillRadar,
  StatusDonut,
} from "@/components/dashboard/evolution-charts";
import { MotionSection } from "@/components/home/motion-section";
import { Greeting } from "@/components/home/greeting";
import { AnimatedPython } from "@/components/home/animated-python";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { LEVEL_LABELS, levelColor } from "@/lib/utils";

export default async function HomePage() {
  const [profile, contents, progress, projects, stack, careers, books, courses] =
    await Promise.all([
      getProfile(),
      getContents(),
      getProgressMap(),
      getProjects(),
      getStackItems(),
      getCareerPaths(),
      getBooks(),
      getUdemyCourses(),
    ]);

  const stats = computeStats(contents, progress);
  const notStarted = stats.total - stats.completed - stats.started;
  const booksRead = books.filter((b) => b.status === "concluido").length;
  const coursesCompleted = courses.filter((c) => c.status === "concluido").length;

  const inProgress = contents
    .filter((c) => progress[c.id]?.status === "em_andamento")
    .slice(0, 3);
  const recommended = contents
    .filter((c) => !progress[c.id] || progress[c.id]?.status === "nao_iniciado")
    .slice(0, 4);
  const featuredProjects = projects.slice(0, 3);
  const recommendedStack = stack.slice(0, 6);
  const suggestedCareer =
    careers.find((c) => c.level === (profile?.current_level ?? "basico")) ??
    careers[0];

  const firstName = (profile?.name ?? "estudante").split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card-gradient relative overflow-hidden rounded-xl border border-border p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-30" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="hidden shrink-0 sm:block">
              <AnimatedPython />
            </div>
            <div className="max-w-xl">
            <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> Plataforma 100% Python
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <Greeting name={firstName} />
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {profile?.goal
                ? `Objetivo: ${profile.goal}.`
                : "Acompanhe sua evolução em todo o ecossistema Python — do básico a Data, IoT, DevOps e Engenharia."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/minhas-trilhas">
                  Continuar estudando <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/evolucao">Ver evolução</Link>
              </Button>
            </div>
            </div>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-lg border border-border bg-surface/60 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Progresso geral</span>
              <span className="font-semibold text-foreground">
                {stats.overallPercentage}%
              </span>
            </div>
            <Progress value={stats.overallPercentage} className="mt-3" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md bg-card p-2.5">
                <p className="text-lg font-bold text-secondary">
                  {stats.completed}
                </p>
                <p className="text-[11px] text-text-secondary">Concluídos</p>
              </div>
              <div className="rounded-md bg-card p-2.5">
                <p className="text-lg font-bold text-warning">{stats.started}</p>
                <p className="text-[11px] text-text-secondary">Em andamento</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nível Python + Pomodoro */}
      <MotionSection className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <PythonLevelCard
            serverCounts={{
              modules: stats.completed,
              books: booksRead,
              courses: coursesCompleted,
            }}
          />
        </div>
        <div className="min-w-0">
          <PomodoroCoffee />
        </div>
      </MotionSection>

      {/* Stats */}
      <MotionSection className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Conteúdos"
          value={<AnimatedNumber value={stats.total} />}
          icon={BookOpen}
          hint={`${stats.completed} concluídos`}
        />
        <StatCard
          label="Em andamento"
          value={<AnimatedNumber value={stats.started} />}
          icon={Flame}
          accent="warning"
        />
        <StatCard
          label="Horas estudadas"
          value={<AnimatedNumber value={stats.hoursStudied} suffix="h" />}
          icon={Clock}
          accent="secondary"
          hint={`de ${stats.totalHours}h estimadas`}
        />
        <StatCard
          label="Conclusão"
          value={<AnimatedNumber value={stats.overallPercentage} suffix="%" />}
          icon={TrendingUp}
          hint="meta: 100%"
        />
      </MotionSection>

      {/* Gráficos */}
      <MotionSection className="grid gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Progresso por área</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaProgressChart
              data={stats.byArea
                .slice(0, 8)
                .map((a) => ({ area: a.area, percentage: a.percentage }))}
            />
          </CardContent>
        </Card>
        <Card className="min-w-0">
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
      </MotionSection>

      {/* Mapa de proficiência */}
      <MotionSection className="grid gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Mapa de proficiência no ecossistema</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadar
              data={(() => {
                // mostra primeiro as áreas onde o usuário tem proficiência (para o
                // radar refletir o progresso real), completando com as áreas de maior
                // volume até no máximo 8 eixos.
                const withProgress = stats.byArea
                  .filter((a) => a.percentage > 0)
                  .sort((a, b) => b.percentage - a.percentage);
                const rest = stats.byArea
                  .filter((a) => a.percentage === 0)
                  .sort((a, b) => b.total - a.total);
                return [...withProgress, ...rest]
                  .slice(0, 8)
                  .map((a) => ({ area: a.area, percentage: a.percentage }));
              })()}
            />
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Foco da semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byArea
              .filter((a) => a.percentage < 100)
              .sort((a, b) => a.percentage - b.percentage)
              .slice(0, 4)
              .map((a) => (
                <div key={a.area}>
                  <div className="mb-1 flex justify-between text-xs text-text-secondary">
                    <span>{a.area}</span>
                    <span>{a.percentage}%</span>
                  </div>
                  <Progress value={a.percentage} className="h-1.5" />
                </div>
              ))}
            <p className="pt-1 text-xs text-text-secondary">
              Áreas com mais espaço para evoluir — comece por elas. 🎯
            </p>
          </CardContent>
        </Card>
      </MotionSection>

      {/* Showcase de código Python */}
      <MotionSection>
        <div className="mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Construído no ecossistema Python
          </h2>
        </div>
        <CodeShowcase />
      </MotionSection>

      {/* Continue + recomendados */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Continue de onde parou</h2>
            <Link href="/minhas-trilhas" className="text-sm text-primary hover:underline">
              Ver tudo
            </Link>
          </div>
          {inProgress.length ? (
            <div className="space-y-3">
              {inProgress.map((c) => (
                <Link key={c.id} href={c.slug ? `/conteudos/${c.slug}` : "/minhas-trilhas"}>
                  <Card hover>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-text-secondary">{c.category}</p>
                        <Progress
                          value={progress[c.id]?.progress_percentage ?? 0}
                          className="mt-2 h-1.5"
                        />
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {progress[c.id]?.progress_percentage ?? 0}%
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="Nada em andamento ainda"
              description="Comece um conteúdo para acompanhar seu progresso aqui."
              action={
                <Button asChild size="sm">
                  <Link href="/minhas-trilhas">Explorar trilhas</Link>
                </Button>
              }
            />
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Próximos recomendados</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommended.map((c) => (
              <Link key={c.id} href={c.slug ? `/conteudos/${c.slug}` : "/minhas-trilhas"}>
                <Card hover className="h-full">
                  <CardContent className="p-4">
                    <Badge className={levelColor(c.level)}>
                      {LEVEL_LABELS[c.level]}
                    </Badge>
                    <p className="mt-2 line-clamp-1 text-sm font-medium">
                      {c.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                      {c.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Carreira + Stack + Atalhos */}
      <section className="grid gap-6 lg:grid-cols-3">
        {suggestedCareer && (
          <Card className="card-gradient">
            <CardContent className="p-5">
              <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                {suggestedCareer.area}
              </Badge>
              <p className="mt-3 font-semibold">{suggestedCareer.title}</p>
              <p className="mt-1 line-clamp-3 text-xs text-text-secondary">
                {suggestedCareer.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {suggestedCareer.skills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-text-secondary"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/minha-carreira">Ver roadmap de carreira</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stack recomendada</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {recommendedStack.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5"
              >
                <Layers className="h-4 w-4 text-primary" />
                <span className="truncate text-sm font-medium">{s.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Projetos em destaque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {featuredProjects.map((p) => (
              <Link
                key={p.id}
                href="/meus-projetos"
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/40"
              >
                <FolderGit2 className="h-4 w-4 text-secondary" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {p.title}
                </span>
                <Badge className={levelColor(p.difficulty)}>
                  {LEVEL_LABELS[p.difficulty]}
                </Badge>
              </Link>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/meus-projetos">
                Ver todos os projetos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Como construir uma carreira em Python */}
      <MotionSection>
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Como construir uma carreira em Python</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["1", "Fundamentos", "Domine sintaxe, lógica, estruturas de dados e POO.", "/minhas-trilhas", "from-green/20 to-green/5"],
            ["2", "Especialização", "Escolha uma área: Backend, Dados, IoT, Automação...", "/especializacoes", "from-blue/20 to-blue/5"],
            ["3", "Prática", "Resolva exercícios e use a IDE para fixar o conteúdo.", "/exercicios", "from-primary/20 to-primary/5"],
            ["4", "Portfólio", "Construa projetos reais que comprovam suas skills.", "/meus-projetos", "from-magenta/20 to-magenta/5"],
            ["5", "Mercado", "Prepare entrevistas, monte o currículo e busque vagas.", "/minha-carreira", "from-warning/20 to-warning/5"],
          ].map(([n, title, desc, href, grad]) => (
            <Link key={n} href={href}>
              <Card hover className="h-full">
                <CardContent className={`flex h-full flex-col bg-gradient-to-br ${grad} p-5`}>
                  <span className="text-3xl font-bold text-gradient">{n}</span>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-1 flex-1 text-xs text-text-secondary">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-light">
                    Começar <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </MotionSection>

      {/* Como usar cada rota da plataforma */}
      <MotionSection>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Como usar a plataforma</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["📚", "Conteúdos", "Trilhas e lições guiadas de todo o ecossistema Python.", "/minhas-trilhas"],
            ["💬", "Comunidade", "Tire dúvidas, compartilhe projetos e conecte-se.", "/comunidade"],
            ["💻", "Exercícios", "Pratique com correção automática por IA.", "/exercicios"],
            ["⌨️", "IDE Python", "Escreva e rode Python no navegador, sem instalar nada.", "/ide"],
            ["🚀", "Projetos", "Projetos reais para construir seu portfólio.", "/meus-projetos"],
            ["📈", "Evolução", "Acompanhe seu progresso, XP e proficiência.", "/evolucao"],
            ["🏆", "Especializações", "Roadmaps avançados para áreas de ponta.", "/especializacoes"],
            ["🤖", "Consultor IA", "Receba orientação de carreira personalizada.", "/consultor-ia"],
            ["💼", "Vagas & Carreira", "Encontre vagas e prepare-se para entrevistas.", "/minha-carreira"],
            ["🎓", "Aulas (Udemy/YT)", "Organize e analise seus cursos com IA.", "/aulas-udemy"],
            ["📄", "Material & Livros", "Salve PDFs, cheatsheets e sua biblioteca.", "/material"],
            ["⚙️", "Configurações", "Ajuste conta, perfil, tema e seus dados.", "/configuracoes"],
          ].map(([emoji, title, desc, href]) => (
            <Link key={href} href={href}>
              <Card hover className="h-full">
                <CardContent className="flex items-start gap-3 p-4">
                  <span className="text-2xl">{emoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-0.5 text-xs text-text-secondary">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </MotionSection>
    </div>
  );
}
