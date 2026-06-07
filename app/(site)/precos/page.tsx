import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FaqItem } from "@/components/site/faq-item";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
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
      "+1.300 projetos para portfólio",
      "Especializações avançadas",
      "Consultor de carreira com IA",
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
      "Trilha Suprema Python Mastery",
      "120+ módulos · 1000+ aulas",
      "Projeto final: SaaS completo (FastAPI, K8s)",
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

      {/* planos */}
      <section className="container py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7",
                  p.highlight ? "border-primary/40 bg-surface" : "border-border bg-card",
                )}
              >
                {p.highlight && (
                  <>
                    <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-25 blur" />
                    <span className="absolute right-5 top-5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary-light">
                      Recomendado
                    </span>
                  </>
                )}
                <p className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  {p.highlight && <Sparkles className="h-3.5 w-3.5 text-primary-light" />}
                  {p.name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  <span className="pb-1 text-text-secondary">{p.period}</span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f, idx) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", idx === 0 && p.highlight ? "text-primary-light" : "text-green")} />
                      <span className={idx === 0 && p.highlight ? "font-medium" : "text-text-secondary"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={cn(
                    "mt-7 inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90",
                    p.highlight
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25"
                      : "border border-border bg-surface-2 text-foreground",
                  )}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

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
