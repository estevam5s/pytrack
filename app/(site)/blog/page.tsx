import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CTASection } from "@/components/site/cta-section";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Aprenda Python",
  description:
    "Artigos e guias gratuitos sobre Python: como aprender do zero, análise de dados, backend, projetos e carreira.",
};

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        badge="Blog"
        title="Aprenda Python de"
        highlight="graça"
        description="Guias e artigos práticos para você evoluir no ecossistema Python — do primeiro print() à carreira."
      />

      <section className="container py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.05}>
              <Link href={`/blog/${p.slug}`}>
                <article className="card card-hover flex h-full flex-col p-6">
                  <div className="text-4xl">{p.emoji}</div>
                  <h2 className="mt-3 text-lg font-bold leading-snug">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {p.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {p.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary-light">
                      Ler <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
