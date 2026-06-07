import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";
import { TRILHAS } from "@/lib/trilhas";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trilhas de aprendizado",
  description:
    "16 trilhas guiadas de Python: do zero ao avançado — Backend, Dados, IA, DevOps & Cloud, Arquitetura, IoT, Segurança e a Trilha Suprema Python Mastery.",
};

const TIER_BADGE: Record<Tier, string> = {
  free: "border-green/30 bg-green/10 text-green",
  essencial: "border-secondary/30 bg-secondary/10 text-secondary",
  completo: "border-primary/30 bg-primary/10 text-primary-light",
  suprema: "border-primary/40 bg-gradient-to-r from-primary/20 to-magenta/10 text-primary-light",
};

const GROUPS: { tier: Tier; label: string; price: string }[] = [
  { tier: "free", label: "Grátis", price: "Comece sem pagar" },
  { tier: "essencial", label: "Plano Essencial", price: "R$ 10/mês" },
  { tier: "completo", label: "Plano Completo", price: "R$ 19/mês" },
  { tier: "suprema", label: "Plano Suprema", price: "R$ 46/mês" },
];

export default function TrilhasPage() {
  return (
    <>
      <PageHero
        badge="Trilhas"
        title="Escolha o seu caminho em"
        highlight="Python"
        description="16 trilhas guiadas — do primeiro print() à Trilha Suprema Python Mastery. Cada trilha combina conteúdos, exercícios e projetos para você evoluir com direção."
      />

      {GROUPS.map((g) => {
        const trilhas = TRILHAS.filter((t) => t.tier === g.tier);
        if (!trilhas.length) return null;
        return (
          <section key={g.tier} className="container py-10">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-bold">{g.label}</h2>
              <span className={cn("rounded-full border px-3 py-0.5 text-xs font-semibold", TIER_BADGE[g.tier])}>
                {g.price}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trilhas.map((t, i) => {
                const Icon = t.icon;
                return (
                  <Reveal key={t.id} delay={(i % 3) * 0.05}>
                    <Link href="/precos">
                      <div className={cn("card card-hover flex h-full flex-col p-5", t.tier === "suprema" && "border-primary/40")}>
                        <div className="flex items-start justify-between">
                          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", t.accent)}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", TIER_BADGE[t.tier])}>
                            {t.tier === "free" ? "Grátis" : TIER_LABEL[t.tier]}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold">{t.title}</h3>
                        <p className="text-xs text-text-secondary">{t.subtitle}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {t.topics.slice(0, 5).map((tp) => (
                            <span key={tp} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-text-secondary">
                              {tp}
                            </span>
                          ))}
                          {t.topics.length > 5 && (
                            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light">
                              +{t.topics.length - 5}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-text-secondary">
                          <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.adModules} módulos</span>
                          <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {t.adLessons} aulas</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{t.adHours}h</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="container">
        <Link
          href="/precos"
          className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary-light hover:underline"
        >
          Ver planos e preços <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CTASection />
    </>
  );
}
