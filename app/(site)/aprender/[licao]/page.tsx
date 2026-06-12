import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getModule, getLesson, readLessonBody } from "@/lib/content/registry";
import { FREE_MODULE_SLUG } from "@/lib/billing-access";
import { CTASection } from "@/components/site/cta-section";

export function generateStaticParams() {
  const mod = getModule(FREE_MODULE_SLUG);
  return (mod?.lessons ?? []).map((l) => ({ licao: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ licao: string }>;
}): Promise<Metadata> {
  const { licao } = await params;
  const found = getLesson(FREE_MODULE_SLUG, licao);
  if (!found) return { title: "Lição não encontrada" };
  return {
    title: `${found.lesson.title} — Python`,
    description: `Aprenda "${found.lesson.title}" em Python, de graça, na PyTrack.`,
    openGraph: { type: "article", title: found.lesson.title },
  };
}

export default async function AprenderLicaoPage({
  params,
}: {
  params: Promise<{ licao: string }>;
}) {
  const { licao } = await params;
  const found = getLesson(FREE_MODULE_SLUG, licao);
  if (!found) notFound();

  const { module, lesson, index } = found;
  const body = await readLessonBody(lesson);
  const prev = index > 0 ? module.lessons[index - 1] : null;
  const next = index < module.lessons.length - 1 ? module.lessons[index + 1] : null;

  return (
    <>
      <article className="container max-w-3xl py-14">
        <Link
          href="/aprender"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {module.title}
        </Link>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Lição {index + 1} de {module.lessons.length} · Conteúdo aberto
        </p>

        <div className="markdown mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {body}
          </ReactMarkdown>
        </div>

        {/* navegação */}
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
          {prev ? (
            <Link href={`/aprender/${prev.slug}`} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/aprender/${next.slug}`} className="inline-flex items-center gap-1.5 text-right text-sm font-semibold text-primary-light">
              {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </article>

      <CTASection title="Continue aprendendo Python — crie sua conta grátis" />
    </>
  );
}
