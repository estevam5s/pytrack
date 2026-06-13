import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Headset, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FaqItem } from "@/components/site/faq-item";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { AnimatedPricing } from "@/components/site/animated-pricing";
import { CTASection } from "@/components/site/cta-section";
import { FAQS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preços",
  description:
    "Planos da PyTrack: comece grátis, assine o Essencial (R$10/mês) para todas as trilhas Python, ou o Completo (R$19/mês) com comunidade, projetos, especializações e carreira.",
};

const PLANS = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "7 dias",
    desc: "Experimente a plataforma por 7 dias, sem cartão.",
    cta: "Começar grátis",
    href: "/auth/register",
    highlight: false,
    features: [
      "7 dias de acesso grátis",
      "🗺️ Roadmaps de Carreira (todas as áreas)",
      "Trilha de Fundamentos de Python",
      "IDE Python no navegador",
      "Depois de 7 dias, escolha um plano",
    ],
  },
  {
    name: "Essencial",
    price: "R$ 10",
    period: "/mês",
    desc: "Aprenda Python a fundo, todas as trilhas.",
    cta: "Assinar Essencial",
    href: "/assinar",
    highlight: false,
    features: [
      "Todas as trilhas de conteúdo",
      "Exercícios com correção por IA",
      "🔥 Desafios Diários (sequência/streak)",
      "IDE Python + evolução e XP",
      "Materiais, livros e aulas",
      "7 dias grátis",
    ],
  },
  {
    name: "Completo",
    price: "R$ 19",
    period: "/mês",
    desc: "A plataforma inteira, do estudo à carreira.",
    cta: "Assinar Completo",
    href: "/assinar",
    highlight: true,
    features: [
      "Tudo do Essencial, mais:",
      "Comunidade, ranking e conexões",
      "🤖 Plano de Estudos com IA",
      "📅 Planejamento semanal de Python",
      "🧭 Guia de carreira",
      "💰 Planejamento financeiro",
      "Milhares de projetos para portfólio",
      "Especializações + consultor de carreira IA",
      "Vagas e perguntas de entrevista",
      "App Android e Desktop (download)",
      "7 dias grátis",
    ],
  },
  {
    name: "Suprema",
    price: "R$ 46",
    period: "/mês",
    desc: "Domine tudo + a Trilha Suprema e projeto final.",
    cta: "Assinar Suprema",
    href: "/assinar",
    highlight: false,
    features: [
      "Tudo do Completo, mais:",
      "🧩 Extensão oficial para VS Code (exclusiva)",
      "📱 Apps (Android/Desktop) + Bot do Telegram",
      "👥 Ver perfis profissionais de outros membros da Rede",
      "🚀 Construa seu SaaS (projeto final + boilerplate por IA)",
      "Trilha Suprema Python Mastery",
      "120+ módulos · 1000+ aulas",
      "Deploy AWS + RAG + Agentes IA",
      "7 dias grátis",
    ],
  },
];

const COMPARISON: {
  feature: string;
  free: boolean;
  ess: boolean;
  comp: boolean;
  sup: boolean;
  vit: boolean;
}[] = [
  { feature: "Acesso por 7 dias grátis", free: true, ess: true, comp: true, sup: true, vit: true },
  { feature: "Fundamentos de Python", free: true, ess: true, comp: true, sup: true, vit: true },
  { feature: "IDE Python no navegador", free: true, ess: true, comp: true, sup: true, vit: true },
  { feature: "Todas as trilhas de conteúdo", free: false, ess: true, comp: true, sup: true, vit: true },
  { feature: "Exercícios com correção por IA", free: false, ess: true, comp: true, sup: true, vit: true },
  { feature: "Evolução, XP e níveis", free: false, ess: true, comp: true, sup: true, vit: true },
  { feature: "Materiais, livros e aulas", free: false, ess: true, comp: true, sup: true, vit: true },
  { feature: "Comunidade completa", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Projetos para portfólio", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Especializações avançadas", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Consultor de carreira (IA)", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Vagas e entrevistas", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "App Android e Desktop (download)", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Atendimento personalizado", free: false, ess: false, comp: true, sup: true, vit: true },
  { feature: "Simulador de entrevista com IA", free: false, ess: false, comp: false, sup: true, vit: true },
  { feature: "Extensão oficial para VS Code", free: false, ess: false, comp: false, sup: true, vit: true },
  { feature: "Trilha Suprema Python Mastery", free: false, ess: false, comp: false, sup: true, vit: true },
  { feature: "Projeto final: SaaS completo", free: false, ess: false, comp: false, sup: true, vit: true },
  { feature: "Deploy AWS + IA Generativa + RAG", free: false, ess: false, comp: false, sup: true, vit: true },
  { feature: "Pagamento único (sem mensalidade)", free: false, ess: false, comp: false, sup: false, vit: true },
  { feature: "Atualizações futuras para sempre", free: false, ess: false, comp: false, sup: false, vit: true },
];

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-4 w-4 text-green" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-text-secondary/40" />
  );
}

export default function PrecosPage() {
  return (
    <>
      <PageHero
        badge="Planos"
        title="Escolha o plano ideal para"
        highlight="sua jornada"
        description="Comece grátis e evolua quando quiser. Sem cobranças escondidas, cancele a qualquer momento."
      />

      {/* planos com toggle animado mensal/anual */}
      <AnimatedPricing
        title="Escolha o plano ideal para sua jornada"
        description={"Comece com 7 dias grátis. Cancele quando quiser, com garantia de reembolso.\nNo grátis você já tem os 🗺️ Roadmaps de Carreira completos — depois escolha um plano abaixo."}
        plans={[
          {
            name: "Essencial",
            price: 10,
            yearlyPrice: 8,
            period: "mês",
            description: "Aprenda Python a fundo, com todas as trilhas.",
            buttonText: "Começar grátis",
            href: "/assinar",
            isPopular: false,
            features: [
              "Todas as trilhas de conteúdo",
              "Exercícios com correção por IA",
              "🔥 Desafios Diários (sequência/streak)",
              "⚔️ 2.000+ Desafios de código (com ranking)",
              "🐛 Debug — 3.300+ bugs reais do mercado",
              "IDE Python + evolução, XP e níveis",
              "Materiais, livros e aulas",
            ],
          },
          {
            name: "Completo",
            price: 19,
            yearlyPrice: 15,
            period: "mês",
            description: "A plataforma inteira, do estudo à carreira.",
            buttonText: "Assinar Completo",
            href: "/assinar",
            isPopular: true,
            features: [
              "Tudo do Essencial, mais:",
              "🧭 Plano de Carreira (coach com IA + tracker)",
              "🤖 Plano de Estudos com IA + 📅 semanal",
              "💰 Planejamento financeiro",
              "Comunidade, ranking e conexões",
              "Milhares de projetos para portfólio",
              "Especializações + consultor de carreira IA",
              "Vagas, entrevista e apps (download)",
            ],
          },
          {
            name: "Suprema",
            price: 46,
            yearlyPrice: 37,
            period: "mês",
            description: "Domine tudo + a Trilha Suprema Python Mastery.",
            buttonText: "Assinar Suprema",
            href: "/assinar",
            isPopular: false,
            features: [
              "Tudo do Completo, mais:",
              "🧭 Carreira Personalizada com IA (trilhas sob medida)",
              "🚀 Construa seu SaaS (boilerplate por IA)",
              "🎤 Simulador de entrevista com IA",
              "🧩 Extensão VS Code + apps + Bot Telegram",
              "Trilha Suprema Python Mastery",
              "120+ módulos · 1000+ aulas",
              "Deploy AWS + RAG + Agentes IA",
            ],
          },
        ]}
      />

      <section className="container">
        {/* Atendimento personalizado — Completo+ */}
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-2xl border border-secondary/30 bg-secondary/5 p-5 sm:p-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <Headset className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">
                  Atendimento personalizado a partir do plano Completo (R$ 19)
                </p>
                <p className="text-sm text-text-secondary">
                  Assinantes <strong>Completo</strong>, <strong>Suprema</strong> e{" "}
                  <strong>Vitalício</strong> têm suporte <strong>prioritário e personalizado</strong> —
                  respostas mais rápidas da equipe, orientação de carreira e ajuda direta nos seus projetos.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Vitalício — pagamento único */}
        <Reveal className="mt-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-primary/40 bg-surface p-7">
            <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-25 blur" />
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary-light">
                  <Crown className="h-4 w-4" /> Vitalício · pague uma vez, use para sempre
                </p>
                <p className="mt-1 max-w-xl text-sm text-text-secondary">
                  Acesso total e permanente a <strong>tudo</strong> — todas as trilhas,
                  exercícios com IA, app Android/Desktop, comunidade e todas as
                  atualizações futuras. Sem mensalidade, nunca mais.
                </p>
              </div>
              <div className="shrink-0 sm:text-right">
                <div className="mb-2 flex items-end gap-1 sm:justify-end">
                  <span className="text-4xl font-bold">R$ 697</span>
                  <span className="pb-1 text-text-secondary">único</span>
                </div>
                <Link
                  href="/assinar"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
                >
                  Quero o vitalício <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Garantia de reembolso */}
        <Reveal className="mt-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 rounded-2xl border border-green/30 bg-green/5 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green/15 text-green">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <p className="text-lg font-bold">Garantia de 7 dias — reembolso 100% do dinheiro</p>
              <p className="mt-1 text-sm text-text-secondary">
                Experimente sem risco. Se não gostar, você mesmo solicita o
                reembolso integral em <strong>Configurações → Plano</strong> dentro de
                7 dias — sem perguntas, sem burocracia.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* comparativo */}
      <section className="container py-12">
        <SectionHeader badge="Comparativo" title="O que cada plano inclui" />
        <Reveal className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border border-border">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[1.5fr_repeat(5,1fr)] bg-surface-2 text-xs font-semibold">
              <div className="p-4">Recurso</div>
              <div className="p-4 text-center text-text-secondary">Grátis</div>
              <div className="p-4 text-center text-text-secondary">Essencial</div>
              <div className="p-4 text-center text-primary-light">Completo</div>
              <div className="p-4 text-center text-text-secondary">Suprema</div>
              <div className="bg-primary/5 p-4 text-center text-primary-light">Vitalício</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={cn(
                  "grid grid-cols-[1.5fr_repeat(5,1fr)] items-center border-t border-border text-sm",
                  i % 2 && "bg-surface/40",
                )}
              >
                <div className="p-4 text-text-secondary">{row.feature}</div>
                <div className="p-4"><Cell on={row.free} /></div>
                <div className="p-4"><Cell on={row.ess} /></div>
                <div className="p-4"><Cell on={row.comp} /></div>
                <div className="p-4"><Cell on={row.sup} /></div>
                <div className="bg-primary/5 p-4"><Cell on={row.vit} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container py-12">
        <SectionHeader badge="Dúvidas" title="Perguntas frequentes" />
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
