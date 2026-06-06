import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { PricingCard } from "@/components/site/pricing-card";
import { FaqItem } from "@/components/site/faq-item";
import { SectionHeader } from "@/components/site/section-header";
import { FAQS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Preços",
  description:
    "Plano Python Pro: acesso completo a trilhas, exercícios, projetos, materiais, livros e carreira.",
};

export default function PrecosPage() {
  return (
    <>
      <PageHero
        badge="Acesso"
        title="Um plano,"
        highlight="acesso completo"
        description="Tudo o que você precisa para evoluir em Python, dados, IoT, backend e engenharia — sem cobranças escondidas."
      />
      <section className="container py-16">
        <PricingCard />
      </section>
      <section className="container pb-20">
        <SectionHeader badge="Dúvidas" title="Perguntas frequentes" />
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {FAQS.slice(0, 6).map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}
