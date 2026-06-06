import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { TrackCard } from "@/components/site/track-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";
import { TRACKS, STEPS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Trilhas de aprendizado",
  description:
    "Trilhas guiadas de Python: fundamentos, backend, análise e engenharia de dados, IoT, automação e engenharia de software — com conteúdo, exercícios e projetos.",
};

export default function TrilhasPage() {
  return (
    <>
      <PageHero
        badge="Trilhas"
        title="Escolha o seu caminho em"
        highlight="Python"
        description="Do zero à especialização. Cada trilha combina conteúdos, exercícios e projetos para você evoluir com direção."
      />

      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 3) * 0.05}>
              <TrackCard track={t} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* como cada trilha funciona */}
      <section className="bg-surface/40 py-16">
        <div className="container">
          <SectionHeader
            badge="Como funciona"
            title={<>Cada trilha foi pensada para a <GradientText>sua evolução</GradientText></>}
            description="Um método consistente do início ao fim: você aprende, pratica e comprova o conhecimento em projetos reais."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.number} delay={i * 0.06}>
                <div className="card h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-gradient">{s.number}</span>
                    <s.icon className="h-6 w-6 text-primary-light" />
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* o que você ganha */}
      <section className="container py-16">
        <SectionHeader badge="Em cada trilha" title="O que está incluído" />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["📚", "Conteúdo guiado", "Lições objetivas com exemplos de código e boas práticas."],
            ["💻", "Exercícios práticos", "Pratique com correção por IA e feedback imediato."],
            ["🚀", "Projetos reais", "Construa um portfólio que comprova suas habilidades."],
            ["📈", "Progresso visível", "Acompanhe XP, nível e conclusão por área."],
            ["🧭", "Roadmap claro", "Sempre saiba qual é o próximo passo."],
            ["🤝", "Comunidade", "Tire dúvidas e evolua junto com outros alunos."],
          ].map(([emoji, title, text]) => (
            <Reveal key={title}>
              <div className="card h-full p-5">
                <div className="text-2xl">{emoji}</div>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection title="Pronto para começar sua trilha Python?" />
    </>
  );
}
