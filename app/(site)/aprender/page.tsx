import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Lock } from "lucide-react";
import { getModule } from "@/lib/content/registry";
import { FREE_MODULE_SLUG } from "@/lib/billing-access";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";

export const metadata: Metadata = {
  title: "Aprender Python grátis — Fundamentos",
  description:
    "Comece a aprender Python de graça: lições de fundamentos (variáveis, tipos, estruturas, funções e POO) abertas para todos.",
};

export default function AprenderPage() {
  const mod = getModule(FREE_MODULE_SLUG);
  const lessons = mod?.lessons ?? [];

  return (
    <>
      <PageHero
        badge="Conteúdo aberto"
        title="Comece a aprender Python"
        highlight="de graça"
        description={`As lições de ${mod?.title ?? "Fundamentos de Python"} estão liberadas para todos. Leia, pratique e evolua — sem precisar pagar para começar.`}
      />

      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <BookOpen className="h-4 w-4 text-primary" />
            {mod?.title ?? "Fundamentos de Python"} · {lessons.length} lições
          </div>
          <div className="space-y-2.5">
            {lessons.map((l, i) => (
              <Reveal key={l.slug} delay={(i % 8) * 0.03}>
                <Link
                  href={`/aprender/${l.slug}`}
                  className="card card-hover group flex items-center gap-4 p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary-light">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{l.title}</span>
                  <ArrowRight className="h-4 w-4 text-text-secondary transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="flex items-center justify-center gap-1.5 font-semibold">
              <Lock className="h-4 w-4 text-primary-light" /> Quer as outras 70+
              trilhas?
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Crie sua conta grátis e teste a plataforma completa por 7 dias.
            </p>
          </div>
        </div>
      </section>

      <CTASection title="Pronto para ir além dos fundamentos?" />
    </>
  );
}
