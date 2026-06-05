import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CareerCard } from "@/components/site/career-card";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";
import { CAREERS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Carreira",
  description:
    "Caminhos profissionais com Python: Developer, Backend, Data Analyst, Data Engineer, IoT, Automação e Software Engineer.",
};

export default function CarreiraPage() {
  return (
    <>
      <PageHero
        badge="Carreira Python"
        title="Aonde o Python pode"
        highlight="te levar"
        description="Conheça as carreiras mais buscadas do mercado e o caminho para chegar lá com habilidades, tecnologias e projetos."
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
      <CTASection title="Dê o próximo passo na sua carreira Python" />
    </>
  );
}
