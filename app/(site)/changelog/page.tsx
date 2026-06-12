import type { Metadata } from "next";
import { Sparkles, Wrench, Bug, Clock, Rocket } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PLATFORM_NEWS, ROADMAP } from "@/lib/news-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Changelog — Versões do PyTrack",
  description: "Histórico de versões, melhorias e novidades da plataforma PyTrack.",
};

const TYPE: Record<string, { label: string; cls: string; icon: typeof Sparkles }> = {
  novo: { label: "Novo", cls: "border-green/30 bg-green/10 text-green", icon: Sparkles },
  melhoria: { label: "Melhoria", cls: "border-blue/30 bg-blue/10 text-blue", icon: Wrench },
  correcao: { label: "Correção", cls: "border-warning/30 bg-warning/10 text-warning", icon: Bug },
  "em-breve": { label: "Em breve", cls: "border-primary/30 bg-primary/10 text-primary-light", icon: Clock },
};

// agrupa as novidades por data como "versões"
function versionLabel(index: number, total: number) {
  const major = 1;
  const minor = total - index;
  return `v${major}.${minor}`;
}

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        badge="Changelog"
        title="Versões e novidades do"
        highlight="PyTrack"
        description="Acompanhe a evolução da plataforma: cada melhoria, recurso novo e correção que entregamos."
      />

      <section className="container max-w-3xl py-14">
        <div className="relative space-y-5 border-l border-border pl-6">
          {PLATFORM_NEWS.map((n, i) => {
            const t = TYPE[n.type] ?? TYPE.novo;
            const Icon = t.icon;
            return (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-primary-light">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-xs font-semibold text-primary-light">
                      {versionLabel(i, PLATFORM_NEWS.length)}
                    </span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", t.cls)}>{t.label}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(n.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold">{n.title}</p>
                  <p className="text-sm text-text-secondary">{n.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* roadmap */}
        <div className="mt-14">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Rocket className="h-5 w-5 text-primary-light" /> Em desenvolvimento
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ROADMAP.map((r, i) => (
              <div key={i} className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">{r.quarter}</span>
                <p className="mt-2 font-semibold">{r.title}</p>
                <p className="text-sm text-text-secondary">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
