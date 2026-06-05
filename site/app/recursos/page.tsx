import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FeatureCard } from "@/components/site/feature-card";
import { Reveal } from "@/components/site/reveal";
import { GradientText } from "@/components/site/gradient-text";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { CTASection } from "@/components/site/cta-section";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/lib/constants";
import { DASHBOARD_FEATURES, FEATURES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Conteúdos, evolução visual, stack, aulas, materiais, livros, exercícios com IA, projetos e carreira em uma só plataforma.",
};

export default function RecursosPage() {
  return (
    <>
      <PageHero
        badge="Recursos"
        title="Tudo o que você precisa em"
        highlight="um só lugar"
        description="Recursos completos para aprender, praticar e se preparar para o mercado de trabalho com Python."
      />

      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 5) * 0.05}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Um dashboard que mostra sua <GradientText>evolução real</GradientText>
            </h2>
            <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {DASHBOARD_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-text-secondary">{f}</span>
                </li>
              ))}
            </ul>
            <Button href={SIGNUP_URL} external className="mt-8">
              Criar minha conta
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glow-primary">
              <DashboardMockup />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
