import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { TrackCard } from "@/components/site/track-card";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";
import { TRACKS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Trilhas de aprendizado",
  description:
    "Trilhas guiadas de Python: fundamentos, backend, análise e engenharia de dados, IoT, automação e engenharia de software.",
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
      <CTASection title="Pronto para começar sua trilha Python?" />
    </>
  );
}
