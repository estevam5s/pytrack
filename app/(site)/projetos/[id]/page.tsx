import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ListChecks, Rocket, Sparkles, Target, Wrench } from "lucide-react";
import { PROJECTS } from "@/lib/site-data";
import { SIGNUP_URL } from "@/lib/site-links";
import { CTASection } from "@/components/site/cta-section";
import { cn } from "@/lib/utils";

const DIFF: Record<string, string> = {
  Iniciante: "border-green/30 bg-green/10 text-green",
  "Intermediário": "border-blue/30 bg-blue/10 text-blue",
  "Avançado": "border-primary-light/30 bg-primary/10 text-primary-light",
  Desafio: "border-magenta/30 bg-magenta/10 text-magenta",
};

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return { title: "Projeto não encontrado" };
  return { title: `${p.title} — Projeto Python`, description: p.result };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <>
      <article className="container max-w-3xl py-14">
        <Link href="/projetos" className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Todos os projetos
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={cn("rounded-full border px-3 py-0.5 text-xs font-semibold", DIFF[project.difficulty] ?? "border-border")}>
            {project.difficulty}
          </span>
          {project.time && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Clock className="h-3.5 w-3.5" /> {project.time}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg text-text-secondary">{project.overview ?? project.result}</p>

        {/* stack */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <span key={t} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-primary-light">{t}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-7 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="flex items-center gap-1.5 font-semibold">
            <Rocket className="h-4 w-4 text-primary-light" /> Construa este projeto na PyTrack
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Acesse o passo a passo guiado, exercícios e a IDE Python no navegador.
          </p>
          <Link
            href={SIGNUP_URL}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white"
          >
            Começar grátis <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        {/* features */}
        {project.features && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Target className="h-5 w-5 text-primary-light" /> O que você vai construir
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2 rounded-lg border border-border bg-surface p-3 text-sm">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-green/15 text-center text-[10px] leading-4 text-green">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* steps */}
        {project.steps && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <ListChecks className="h-5 w-5 text-primary-light" /> Passo a passo
            </h2>
            <ol className="mt-4 space-y-3">
              {project.steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">{i + 1}</span>
                  <p className="text-sm leading-relaxed text-text-secondary">{s}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* learnings */}
        {project.learnings && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Wrench className="h-5 w-5 text-primary-light" /> O que você vai aprender
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.learnings.map((l) => (
                <span key={l} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm text-text-secondary">{l}</span>
              ))}
            </div>
          </section>
        )}
      </article>

      <CTASection title="Pronto para construir seu portfólio?" />
    </>
  );
}
