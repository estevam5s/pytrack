import type { Metadata } from "next";
import { Compass, GraduationCap, Rocket, Target } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A PyTrack é uma escola digital focada 100% no ecossistema Python: do básico à carreira profissional.",
};

const STATS = [
  ["74", "módulos de conteúdo"],
  ["2.4k+", "exercícios práticos"],
  ["1.3k+", "projetos para portfólio"],
  ["8", "trilhas de carreira"],
];

const VALUES = [
  { icon: Compass, title: "Direção", text: "Trilhas guiadas para você nunca se perder no que estudar a seguir." },
  { icon: Target, title: "Prática", text: "Exercícios com IA e projetos reais — aprender de verdade é aplicando." },
  { icon: Rocket, title: "Evolução", text: "Um dashboard que transforma seu esforço em progresso visível." },
  { icon: GraduationCap, title: "Carreira", text: "Do primeiro print() ao roadmap profissional, com foco no mercado." },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        badge="Sobre a plataforma"
        title="Uma escola digital focada em"
        highlight="Python"
        description="Criamos a PyTrack para resolver um problema real: aprender Python com direção, prática e evolução visível, sem precisar juntar mil ferramentas."
      />

      <section className="container py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <Reveal key={l}>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-gradient">{n}</p>
                <p className="mt-1 text-sm text-text-secondary">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nossa <GradientText>missão</GradientText>
            </h2>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Tornar o aprendizado de todo o ecossistema Python acessível,
              organizado e orientado a resultados. Acreditamos que dominar Python
              não é decorar sintaxe, mas combinar fundamentos sólidos, prática
              constante e clareza sobre o próximo passo da sua carreira.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Por isso reunimos conteúdos, exercícios, projetos, materiais,
              livros e carreira em um único dashboard — com inteligência
              artificial para acelerar a sua evolução.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-5">
                  <v.icon className="h-6 w-6 text-primary-light" />
                  <h3 className="mt-3 font-semibold">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-text-secondary">{v.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeader
          badge="Metodologia"
          title={<>Aprender, praticar e <GradientText>evoluir</GradientText></>}
          description="Cada módulo combina teoria objetiva, exemplos de código, exercícios com feedback de IA e projetos aplicados — sempre com seu progresso registrado."
        />
      </section>

      <CTASection />
    </>
  );
}
