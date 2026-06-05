import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";
import { PROJECTS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos práticos de Python para o seu portfólio: CLI, APIs, scraping, dashboards, IoT, ETL e full-stack.",
};

export default function ProjetosPage() {
  return (
    <>
      <PageHero
        badge="Projetos reais"
        title="Construa um portfólio que"
        highlight="impressiona"
        description="Mais de 1300 projetos na plataforma, dos primeiros scripts a sistemas completos com deploy."
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
      <CTASection title="Comece a construir seu portfólio Python" />
    </>
  );
}
