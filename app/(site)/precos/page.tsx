import type { Metadata } from "next";
import { Check, Minus, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PricingCard } from "@/components/site/pricing-card";
import { FaqItem } from "@/components/site/faq-item";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { GradientText } from "@/components/site/gradient-text";
import { CTASection } from "@/components/site/cta-section";
import { FAQS, TESTIMONIALS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Preços",
  description:
    "Plano Python Pro: acesso completo a trilhas guiadas, exercícios com IA, IDE Python, projetos, comunidade, vagas, materiais, livros e carreira — sem cobranças escondidas.",
};

const INCLUDED = [
  {
    group: "Aprendizado",
    items: [
      "74 módulos de conteúdo guiado",
      "Trilhas do básico à especialização",
      "Leitor de lições em Markdown",
      "Atualizações contínuas de conteúdo",
    ],
  },
  {
    group: "Prática",
    items: [
      "2.400+ exercícios com correção por IA",
      "IDE Python no navegador (sem instalar nada)",
      "1.300+ projetos para portfólio",
      "Editor com syntax highlight",
    ],
  },
  {
    group: "Carreira & Comunidade",
    items: [
      "Consultor de carreira com IA",
      "1.700+ perguntas de entrevista",
      "Vagas do ecossistema Python",
      "Comunidade, ranking e conexões",
    ],
  },
  {
    group: "Acompanhamento",
    items: [
      "Dashboard de evolução com XP e níveis",
      "Mapa de proficiência por área",
      "Materiais e biblioteca de livros",
      "Tema claro/escuro e acesso multiplataforma",
    ],
  },
];

const COMPARISON: { feature: string; free: boolean; pro: boolean }[] = [
  { feature: "Trilhas e conteúdos", free: true, pro: true },
  { feature: "Exercícios com correção por IA", free: false, pro: true },
  { feature: "IDE Python no navegador", free: true, pro: true },
  { feature: "Projetos para portfólio", free: false, pro: true },
  { feature: "Consultor de carreira (IA)", free: false, pro: true },
  { feature: "Comunidade e vagas", free: true, pro: true },
  { feature: "Dashboard de evolução completo", free: false, pro: true },
  { feature: "Especializações avançadas", free: false, pro: true },
];

export default function PrecosPage() {
  return (
    <>
      <PageHero
        badge="Acesso"
        title="Um plano,"
        highlight="acesso completo"
        description="Tudo o que você precisa para evoluir em Python, dados, IoT, backend e engenharia — em um único lugar, sem cobranças escondidas."
      />

      {/* faixa de benefícios */}
      <section className="container -mt-6">
        <Reveal className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Comece em segundos", text: "Crie a conta e acesse tudo na hora." },
            { icon: ShieldCheck, title: "Sem pegadinhas", text: "Sem cartão para começar, cancele quando quiser." },
            { icon: Sparkles, title: "Sempre evoluindo", text: "Novos conteúdos e recursos com frequência." },
          ].map((b) => (
            <div key={b.title} className="card flex items-start gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-text-secondary">{b.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* card de preço */}
      <section className="container py-16">
        <PricingCard />
      </section>

      {/* tudo incluído */}
      <section className="container py-12">
        <SectionHeader
          badge="Tudo incluído"
          title={<>O que vem no <GradientText>Python Pro</GradientText></>}
          description="Acesso total a toda a plataforma — aprendizado, prática, carreira e acompanhamento."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((col, i) => (
            <Reveal key={col.group} delay={i * 0.05}>
              <div className="card h-full p-6">
                <h3 className="font-semibold text-primary-light">{col.group}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                      <span className="text-text-secondary">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* comparativo */}
      <section className="container py-12">
        <SectionHeader badge="Comparativo" title="Gratuito vs Python Pro" />
        <Reveal className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_auto_auto] bg-surface-2 text-sm font-semibold">
            <div className="p-4">Recurso</div>
            <div className="w-24 p-4 text-center text-text-secondary">Grátis</div>
            <div className="w-24 p-4 text-center text-primary-light">Pro</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_auto_auto] items-center border-t border-border text-sm ${
                i % 2 ? "bg-surface/40" : ""
              }`}
            >
              <div className="p-4 text-text-secondary">{row.feature}</div>
              <div className="flex w-24 justify-center p-4">
                {row.free ? (
                  <Check className="h-4 w-4 text-green" />
                ) : (
                  <Minus className="h-4 w-4 text-text-secondary/50" />
                )}
              </div>
              <div className="flex w-24 justify-center p-4">
                {row.pro ? (
                  <Check className="h-4 w-4 text-green" />
                ) : (
                  <Minus className="h-4 w-4 text-text-secondary/50" />
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* depoimentos */}
      <section className="container py-12">
        <SectionHeader badge="Depoimentos" title="Quem usa, recomenda" description="Exemplos ilustrativos de como a plataforma acelera o aprendizado." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="card h-full p-7">
                <p className="text-sm leading-relaxed text-text-secondary">“{t.text}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-background`}>
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-text-secondary">
          * Depoimentos fictícios, apenas para demonstração.
        </p>
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
