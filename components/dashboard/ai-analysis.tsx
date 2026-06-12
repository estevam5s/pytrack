"use client";

import { Brain, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseAnalysis, CollectionAnalysis } from "@/lib/ai/actions";

export function AnalysisList({
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
          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
            <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", color.replace("text-", "bg-"))} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CourseAnalysisPanel({ analysis }: { analysis: CourseAnalysis }) {
  if (analysis.error) return <p className="text-sm text-danger">{analysis.error}</p>;
  return (
    <div className="space-y-4 text-sm">
      <p className="leading-relaxed text-text-secondary">{analysis.summary}</p>
      <div>
        <div className="mb-1 flex justify-between text-xs text-text-secondary">
          <span>Dificuldade estimada</span>
          <span>{analysis.difficulty}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-secondary via-warning to-danger" style={{ width: `${analysis.difficulty}%` }} />
        </div>
      </div>
      {analysis.stack.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Stack abordada</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.stack.map((s) => (
              <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light">{s}</span>
            ))}
          </div>
        </div>
      )}
      <AnalysisList title="Você vai aprender" items={analysis.learnings} icon={CheckCircle2} color="text-secondary" />
      <AnalysisList title="Pré-requisitos" items={analysis.prerequisites} icon={Target} color="text-warning" />
      <AnalysisList title="Dicas" items={analysis.tips} icon={Lightbulb} color="text-primary-light" />
      {analysis.audience && <p className="text-text-secondary"><span className="font-medium text-foreground">Para quem é:</span> {analysis.audience}</p>}
      {analysis.career_fit && <p className="text-text-secondary"><span className="font-medium text-foreground">Na carreira:</span> {analysis.career_fit}</p>}
      {analysis.model && <p className="text-[11px] text-text-secondary">Gerado por IA ({analysis.model}).</p>}
    </div>
  );
}

export function CollectionAnalysisPanel({ analysis }: { analysis: CollectionAnalysis }) {
  if (analysis.error) return <p className="text-sm text-danger">{analysis.error}</p>;
  return (
    <div className="space-y-4 text-sm">
      <p className="leading-relaxed text-text-secondary">{analysis.summary}</p>
      {analysis.coverage.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Cobertura</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.coverage.map((c) => (
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
        <AnalysisList title="Pontos fortes" items={analysis.strengths} icon={CheckCircle2} color="text-secondary" />
        <AnalysisList title="Lacunas" items={analysis.gaps} icon={Target} color="text-warning" />
      </div>
      <AnalysisList title="Recomendações" items={analysis.recommendations} icon={Lightbulb} color="text-primary-light" />
      {analysis.suggested_order.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">Ordem sugerida</p>
          <ol className="list-inside list-decimal space-y-1 text-text-secondary">
            {analysis.suggested_order.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}
      {analysis.model && <p className="text-[11px] text-text-secondary">Gerado por IA ({analysis.model}).</p>}
    </div>
  );
}

export { Brain };
