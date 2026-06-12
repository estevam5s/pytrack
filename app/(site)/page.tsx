import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { HeroSection } from "@/components/site/hero-section";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { GradientText } from "@/components/site/gradient-text";
import { FeatureCard } from "@/components/site/feature-card";
import { TrackCard } from "@/components/site/track-card";
import { ProjectCard } from "@/components/site/project-card";
import { CareerCard } from "@/components/site/career-card";
import { FaqItem } from "@/components/site/faq-item";
import { CTASection } from "@/components/site/cta-section";
import { FounderSection } from "@/components/site/founder-section";
import { TestimonialsMarquee } from "@/components/site/testimonials-marquee";
import { PricingPlans } from "@/components/site/pricing-plans";
import { TechStackSection } from "@/components/site/tech-stack-section";
import { DashboardShowcase } from "@/components/site/dashboard-showcase";
import { IdeHighlight } from "@/components/site/ide-highlight";
import { AppsShowcase } from "@/components/site/apps-showcase";
import { getPlatformStats, fmtStat } from "@/lib/data/platform-stats";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { Button } from "@/components/site/site-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SIGNUP_URL } from "@/lib/site-links";
import { TRILHAS } from "@/lib/trilhas";
import {
  CAREERS,
  DASHBOARD_FEATURES,
  FAQS,
  FEATURES,
  PROJECTS,
  STEPS,
  TESTIMONIALS,
} from "@/lib/site-data";

const LEVEL_LABEL: Record<string, string> = {
  basico: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const metadata: Metadata = {
  title: "Python Learning Platform — Domine Python do básico à carreira",
  description:
    "Aprenda Python com trilhas guiadas, exercícios com IA, projetos reais, dashboard de evolução, materiais, livros e carreira.",
};

const ANTES = [
  "Estudos desorganizados e sem direção",
  "Links e materiais perdidos por toda parte",
  "Sem clareza da própria evolução",
  "Pouca ou nenhuma prática com projetos reais",
  "Sem um caminho claro de carreira",
];
const DEPOIS = [
  "Trilhas organizadas do básico ao avançado",
  "Dashboard com progresso, XP e nível",
  "Materiais, livros e cursos centralizados",
  "Mais de 1300 projetos reais para o portfólio",
  "Roadmap profissional e consultor de IA",
];

export default async function HomePage() {
  const raw = await getPlatformStats();
  const stats = {
    trilhas: String(raw.trilhas),
    modulos: fmtStat(raw.modulos),
    exercicios: fmtStat(raw.exercicios),
    projetos: fmtStat(raw.projetos),
  };
  return (
    <>
      <HeroSection stats={stats} />

      {/* IDE no navegador — zero setup (gatilho de conversão) */}
      <IdeHighlight />

      {/* Por dentro da plataforma (showcase) */}
      <DashboardShowcase />

      {/* Stack de tecnologia */}
      <TechStackSection />

      {/* Como funciona */}
      <section id="como-funciona" className="container py-20">
        <SectionHeader
          badge="Como funciona"
          title={<>Da conta ao domínio em <GradientText>4 passos</GradientText></>}
          description="Um fluxo simples e guiado para você sair do zero e evoluir de verdade no ecossistema Python."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.number} delay={i * 0.08}>
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
      </section>

      {/* Trilhas */}
      <section className="container py-20">
        <SectionHeader
          badge="Trilhas de aprendizado"
          title={<>17 trilhas, um <GradientText>caminho em Python</GradientText></>}
          description="Trilhas guiadas para cada objetivo — dos fundamentos às especializações mais buscadas do mercado (Backend, Dados, IA, DevOps, Arquitetura, IoT, Segurança e mais)."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRILHAS.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 0.05}>
              <TrackCard
                track={{
                  icon: t.icon,
                  title: t.title,
                  description: t.subtitle,
                  level: LEVEL_LABEL[t.level] ?? t.level,
                  duration: `~${t.adHours}h`,
                  accent: t.accent,
                }}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/trilhas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:underline"
          >
            Ver todas as trilhas e o que cada plano inclui →
          </Link>
        </div>
      </section>

      {/* Dashboard inteligente */}
      <section className="container py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
              Dashboard inteligente
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo o que você estuda, <GradientText>em um só painel</GradientText>
            </h2>
            <p className="mt-4 text-text-secondary">
              Após o login, você acessa um dashboard completo que organiza seus
              estudos e mostra sua evolução em tempo real.
            </p>
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
            <Button href={SIGNUP_URL} external variant="primary" className="mt-8">
              Acessar o dashboard
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glow-primary">
              <DashboardMockup />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Recursos */}
      <section className="bg-surface/40 py-20">
        <div className="container">
          <SectionHeader
            badge="Recursos da plataforma"
            title={<>Recursos pensados para a <GradientText>sua evolução</GradientText></>}
            description="Tudo o que você precisa para aprender, praticar e se preparar para o mercado — sem depender de mil ferramentas."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 5) * 0.05}>
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section id="projetos" className="container scroll-mt-24 py-20">
        <SectionHeader
          badge="Projetos reais"
          title={<>Aprenda <GradientText>construindo de verdade</GradientText></>}
          description="Projetos práticos com requisitos, tecnologias e passo a passo para você montar um portfólio que impressiona."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Carreira */}
      <section id="carreira" className="scroll-mt-24 bg-surface/40 py-20">
        <div className="container">
          <SectionHeader
            badge="Carreira Python"
            title={<>Aonde o Python pode <GradientText>te levar</GradientText></>}
            description="Caminhos profissionais com as habilidades, tecnologias e a evolução de cada carreira."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAREERS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.06}>
                <CareerCard career={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Antes e depois */}
      <section className="container py-20">
        <SectionHeader
          badge="Transformação"
          title={<>Do caos à <GradientText>clareza total</GradientText></>}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card h-full border-magenta/20 p-7">
              <h3 className="text-lg font-semibold text-text-secondary">Antes</h3>
              <ul className="mt-5 space-y-3">
                {ANTES.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-magenta/15 text-magenta">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-gradient h-full rounded-2xl p-7">
              <h3 className="text-lg font-semibold">
                Depois com a <GradientText>PyTrack</GradientText>
              </h3>
              <ul className="mt-5 space-y-3">
                {DEPOIS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-text-secondary">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fundador */}
      <FounderSection />

      {/* Depoimentos */}
      <section className="container py-20">
        <SectionHeader
          badge="Depoimentos"
          title={<>Histórias de quem <GradientText>evoluiu com a gente</GradientText></>}
          description="Exemplos ilustrativos de como a plataforma organiza e acelera o aprendizado."
        />
        <TestimonialsMarquee items={TESTIMONIALS} />
        <p className="mt-6 text-center text-xs text-text-secondary">
          * Depoimentos ilustrativos, apenas para demonstração visual.
        </p>
      </section>

      {/* Preços */}
      <section className="container py-20">
        <SectionHeader
          badge="Planos"
          title={<>Comece grátis, <GradientText>evolua quando quiser</GradientText></>}
          description="Do grátis ao vitalício — escolha o quanto do ecossistema Python você quer dominar. 7 dias grátis, cancele quando quiser, com garantia de reembolso."
        />
        <PricingPlans />
      </section>

      {/* FAQ */}
      <section className="container py-20">
        <SectionHeader badge="FAQ" title="Perguntas frequentes" />
        <div className="mx-auto mt-12 grid max-w-3xl gap-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <AppsShowcase />

      <CTASection />
    </>
  );
}
