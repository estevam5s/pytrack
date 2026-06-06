import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";
import { PROJECTS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Mais de 1.300 projetos práticos de Python para o seu portfólio — de CLIs e APIs a dashboards, ETL, IoT e full-stack.",
};

export default function ProjetosPage() {
  return (
    <>
      <PageHero
        badge="Projetos reais"
        title="Construa um portfólio que"
        highlight="impressiona"
        description="Aprenda construindo de verdade. São mais de 1.300 projetos na plataforma — dos primeiros scripts a sistemas completos com deploy."
      />

      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface/40 py-16">
        <div className="container">
          <SectionHeader
            badge="Por que projetos"
            title={<>Teoria sem prática <GradientText>não fixa</GradientText></>}
            description="Cada projeto tem requisitos, tecnologias e passo a passo — você sai com algo pronto para mostrar a recrutadores."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["🎯", "Aplicação real", "Resolva problemas do mundo real com código."],
              ["🧩", "Dificuldade gradual", "Do básico ao desafio, no seu ritmo."],
              ["🛠️", "Stack de mercado", "FastAPI, Pandas, Docker, e muito mais."],
              ["💼", "Portfólio forte", "Projetos que comprovam suas habilidades."],
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

      <CTASection title="Comece a construir seu portfólio Python" />
    </>
  );
}
