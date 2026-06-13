import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";
import { PROJECTS } from "@/lib/site-data";
import { getPlatformStats, fmtStat } from "@/lib/data/platform-stats";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Milhares de projetos práticos de Python para o seu portfólio — de CLIs e APIs a dashboards, ETL, IoT e full-stack.",
};

export default async function ProjetosPage() {
  const s = await getPlatformStats();
  return (
    <>
      <PageHero
        badge="Projetos de alto nível"
        title="Projetos que provam que você"
        highlight="está pronto"
        description={`Nada de tutoriais de brinquedo. Aqui você constrói SaaS, IA com RAG, pipelines de dados, microsserviços e sistemas em produção — no nível de empresas de tecnologia. São ${fmtStat(s.projetos)} projetos na plataforma.`}
      />

      <section className="container py-16">
        <SectionHeader
          badge="Em destaque"
          title={<>Os <GradientText>melhores projetos</GradientText> da plataforma</>}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
