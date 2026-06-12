import Link from "next/link";
import { ArrowRight, Layers, Clock, ListChecks, Sparkles, Map, BadgeCheck } from "lucide-react";
import { TRILHAS } from "@/lib/trilhas";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

export const metadata = { title: "Roadmaps de Carreira · PyTrack" };

const LEVEL_LABEL: Record<string, string> = { basico: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };

export default function RoadmapsPage() {
  // as trilhas da PyTrack são os roadmaps de carreira
  const roadmaps = TRILHAS.filter((t) => t.id !== "suprema");

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-green/15 px-2.5 py-0.5 text-xs font-medium text-green"><BadgeCheck className="h-3.5 w-3.5" /> 100% Gratuito</span>
      </div>
      <PageHeader
        title="Roadmaps de Carreira"
        description="Guias completos e detalhados para cada área de desenvolvimento Python. Saiba exatamente o que estudar, em que ordem e com quais recursos."
      />

      {/* CTA plano personalizado */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-light"><Sparkles className="h-5 w-5" /></span>
          <div>
            <p className="font-semibold">Quer um Plano de Estudos personalizado?</p>
            <p className="text-sm text-text-secondary">A IA monta um plano sob medida, com tarefas, prazos e feedback (plano Completo).</p>
          </div>
        </div>
        <Link href="/planejamento" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white">
          Criar plano <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* lista de roadmaps */}
      <div className="space-y-3">
        {roadmaps.map((r) => {
          const Icon = r.icon;
          return (
            <Link key={r.id} href={`/minhas-trilhas/${r.id}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40">
              <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br", r.accent)}>
                <Icon className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{r.title}</h3>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-secondary">{LEVEL_LABEL[r.level]}</span>
                </div>
                <p className="text-sm text-text-secondary">{r.subtitle}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                  <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {r.adModules} etapas</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{r.adHours}h</span>
                  <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {r.topics.length} tópicos</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-primary-light" />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-center">
        <Map className="mx-auto h-7 w-7 text-primary-light" />
        <p className="mt-2 font-semibold">Cada roadmap vira uma trilha guiada</p>
        <p className="text-sm text-text-secondary">Clique em um roadmap para abrir a trilha com aulas, exercícios e projetos passo a passo.</p>
      </div>
    </div>
  );
}
