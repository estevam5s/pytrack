import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CareerCard } from "@/components/site/career-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";
import { CAREERS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Carreira",
  description:
    "Caminhos profissionais com Python: Developer, Backend, Data Analyst, Data Engineer, IoT, Automação e Software Engineer — com habilidades, tecnologias e roadmap.",
};

export default function CarreiraPage() {
  return (
    <>
      <PageHero
        badge="Carreira Python"
        title="Aonde o Python pode"
        highlight="te levar"
        description="Conheça as carreiras mais buscadas do mercado e o caminho para chegar lá — com habilidades, tecnologias e a evolução de cada trilha."
      />

      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.05}>
              <CareerCard career={c} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface/40 py-16">
        <div className="container">
          <SectionHeader
            badge="Preparação completa"
            title={<>Da primeira linha de código à <GradientText>contratação</GradientText></>}
            description="Além das trilhas, você tem consultor de carreira com IA, mais de 1.700 perguntas de entrevista e vagas da comunidade."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              ["🤖", "Consultor de carreira (IA)", "Receba orientação personalizada para a sua jornada."],
              ["❓", "1.700+ perguntas", "Prepare-se para entrevistas técnicas, de júnior a sênior."],
              ["💼", "Vagas do ecossistema", "Encontre oportunidades reais de Python na comunidade."],
            ].map(([emoji, t, d]) => (
              <Reveal key={t}>
                <div className="card h-full p-5">
                  <div className="text-2xl">{emoji}</div>
                  <h3 className="mt-2 font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Dê o próximo passo na sua carreira Python" />
    </>
  );
}
