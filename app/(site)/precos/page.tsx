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
    period: "para sempre",
    desc: "Comece a aprender sem pagar nada.",
    cta: "Criar conta grátis",
    href: "/auth/register",
    highlight: false,
    features: [
      "Trilha de Fundamentos de Python",
      "IDE Python no navegador",
      "Acesso à comunidade (leitura)",
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
}[] = [
  { feature: "Fundamentos de Python", free: true, ess: true, comp: true, sup: true },
  { feature: "IDE Python no navegador", free: true, ess: true, comp: true, sup: true },
  { feature: "Todas as trilhas de conteúdo", free: false, ess: true, comp: true, sup: true },
  { feature: "Exercícios com correção por IA", free: false, ess: true, comp: true, sup: true },
  { feature: "Evolução, XP e níveis", free: false, ess: true, comp: true, sup: true },
  { feature: "Materiais, livros e aulas", free: false, ess: true, comp: true, sup: true },
  { feature: "Comunidade completa", free: false, ess: false, comp: true, sup: true },
  { feature: "Projetos para portfólio", free: false, ess: false, comp: true, sup: true },
  { feature: "Especializações avançadas", free: false, ess: false, comp: true, sup: true },
  { feature: "Consultor de carreira (IA)", free: false, ess: false, comp: true, sup: true },
  { feature: "Vagas e entrevistas", free: false, ess: false, comp: true, sup: true },
  { feature: "App Android e Desktop (download)", free: false, ess: false, comp: true, sup: true },
  { feature: "Trilha Suprema Python Mastery", free: false, ess: false, comp: false, sup: true },
  { feature: "Projeto final: SaaS completo", free: false, ess: false, comp: false, sup: true },
  { feature: "Deploy AWS + IA Generativa + RAG", free: false, ess: false, comp: false, sup: true },
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
      </section>

      {/* comparativo */}
      <section className="container py-12">
        <SectionHeader badge="Comparativo" title="O que cada plano inclui" />
        <Reveal className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_52px_64px_64px_64px] bg-surface-2 text-[11px] font-semibold sm:grid-cols-[1fr_72px_84px_84px_84px] sm:text-xs">
            <div className="p-3 sm:p-4">Recurso</div>
            <div className="p-3 text-center text-text-secondary sm:p-4">Grátis</div>
            <div className="p-3 text-center text-text-secondary sm:p-4">Essencial</div>
            <div className="p-3 text-center text-text-secondary sm:p-4">Completo</div>
            <div className="p-3 text-center text-primary-light sm:p-4">Suprema</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                "grid grid-cols-[1fr_52px_64px_64px_64px] items-center border-t border-border text-xs sm:grid-cols-[1fr_72px_84px_84px_84px] sm:text-sm",
                i % 2 && "bg-surface/40",
              )}
            >
              <div className="p-3 text-text-secondary sm:p-4">{row.feature}</div>
              <div className="p-3 sm:p-4"><Cell on={row.free} /></div>
              <div className="p-3 sm:p-4"><Cell on={row.ess} /></div>
              <div className="p-3 sm:p-4"><Cell on={row.comp} /></div>
              <div className="p-3 sm:p-4"><Cell on={row.sup} /></div>
            </div>
          ))}
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
