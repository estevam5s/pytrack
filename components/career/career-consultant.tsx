"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { computeXp, levelFromXp } from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";
import { analyzeCareer, type CareerAssessment } from "@/lib/ai/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConsultantData {
  modulesCompleted: number;
  modulesTotal: number;
  overallPct: number;
  hours: number;
  books: number;
  courses: number;
  byArea: { area: string; percentage: number }[];
  goal?: string;
}

const VERDICT = {
  apto: {
    label: "Apto para o mercado",
    icon: CheckCircle2,
    cls: "border-secondary/40 bg-secondary/10 text-secondary",
    bar: "from-secondary to-success",
  },
  quase: {
    label: "Quase lá",
    icon: TrendingUp,
    cls: "border-warning/40 bg-warning/10 text-warning",
    bar: "from-warning to-secondary",
  },
  em_formacao: {
    label: "Em formação",
    icon: Compass,
    cls: "border-primary/40 bg-primary/10 text-primary",
    bar: "from-primary to-primary-muted",
  },
} as const;

export function CareerConsultant({ data }: { data: ConsultantData }) {
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareerAssessment | null>(null);

  useEffect(() => setLocal(readLocalActivity()), []);

  const counts = useMemo(
    () => ({
      modules: data.modulesCompleted,
      lessons: local.lessons,
      exercises: local.exercises,
      questions: local.questions,
      books: data.books,
      courses: data.courses,
    }),
    [data, local],
  );
  const xp = computeXp(counts);
  const level = levelFromXp(xp);

  const run = async () => {
    setLoading(true);
    setResult(null);
    const res = await analyzeCareer({
      levelName: level.tier.name,
      tierIndex: level.index,
      xp,
      overallPct: data.overallPct,
      hours: data.hours,
      modulesCompleted: data.modulesCompleted,
      modulesTotal: data.modulesTotal,
      lessons: local.lessons,
      exercises: local.exercises,
      questions: local.questions,
      books: data.books,
      courses: data.courses,
      byArea: data.byArea,
      goal: data.goal,
    });
    setResult(res);
    setLoading(false);
  };

  const snapshot = [
    { label: "Nível", value: `${level.tier.emoji} ${level.tier.name}` },
    { label: "XP", value: xp.toLocaleString("pt-BR") },
    { label: "Trilhas", value: `${data.overallPct}%` },
    { label: "Exercícios", value: local.exercises },
    { label: "Perguntas", value: local.questions },
    { label: "Horas", value: `${data.hours}h` },
  ];

  return (
    <div className="space-y-6">
      {/* Apresentação + snapshot */}
      <Card className="card-gradient">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Consultor de Carreira IA</h2>
                <p className="mt-1 max-w-xl text-sm text-text-secondary">
                  A IA analisa toda a sua evolução e experiência no ecossistema
                  Python e avalia, de forma honesta, se você já está apto a atuar
                  profissionalmente — com plano de ação personalizado.
                </p>
              </div>
            </div>
            <Button size="lg" onClick={run} disabled={loading} className="shrink-0">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {loading ? "Analisando seu perfil..." : "Analisar minha prontidão"}
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {snapshot.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-surface/60 p-3 text-center"
              >
                <p className="text-sm font-bold">{s.value}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-text-secondary">
              O consultor está avaliando suas habilidades, lacunas e prontidão
              para o mercado...
            </p>
          </CardContent>
        </Card>
      )}

      {result?.error && (
        <Card>
          <CardContent className="flex items-center gap-3 p-5 text-danger">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              {result.error} — a IA gratuita pode estar sobrecarregada, tente de
              novo em instantes.
            </p>
          </CardContent>
        </Card>
      )}

      {result && !result.error && (
        <AssessmentView result={result} />
      )}
    </div>
  );
}

function AssessmentView({ result }: { result: CareerAssessment }) {
  const v = VERDICT[result.verdict];
  const Icon = v.icon;

  return (
    <div className="space-y-6">
      {/* Veredito */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl border",
                  v.cls,
                )}
              >
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <Badge className={v.cls}>{v.label}</Badge>
                <p className="mt-1.5 text-xl font-bold">{result.title}</p>
              </div>
            </div>
            <div className="w-full sm:max-w-[220px]">
              <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
                <span>Prontidão para o mercado</span>
                <span className="font-semibold text-foreground">
                  {result.readiness}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all",
                    v.bar,
                  )}
                  style={{ width: `${result.readiness}%` }}
                />
              </div>
            </div>
          </div>
          {result.summary && (
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {result.summary}
            </p>
          )}
          {result.model && (
            <p className="mt-2 text-[10px] text-text-secondary/60">
              análise por {result.model.split("/").pop()?.replace(":free", "")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Forças e lacunas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {result.strengths.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <CheckCircle2 className="h-4 w-4" /> Seus pontos fortes
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-secondary">+</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {result.gaps.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-warning">
                <XCircle className="h-4 w-4" /> Lacunas a cobrir
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                {result.gaps.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-warning">!</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recomendações */}
      {result.recommendations.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Lightbulb className="h-4 w-4" /> Recomendações
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.recommendations.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-secondary"
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {s}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roadmap */}
      {result.roadmap.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Seu plano de ação
            </p>
            <ol className="relative space-y-4 border-l border-border pl-5">
              {result.roadmap.map((s, i) => (
                <li key={i} className="relative text-sm text-text-secondary">
                  <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Cargos-alvo */}
      {result.roles.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-sm font-semibold">Cargos-alvo realistas</p>
            <div className="flex flex-wrap gap-2">
              {result.roles.map((r, i) => (
                <span
                  key={i}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {r}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
