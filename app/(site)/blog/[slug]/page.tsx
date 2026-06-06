import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { BLOG_POSTS, getPost } from "@/lib/blog-posts";
import { CTASection } from "@/components/site/cta-section";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="container max-w-3xl py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>

        <div className="mt-6 text-5xl">{post.emoji}</div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime}
          </span>
          <span>
            {new Date(post.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="markdown mt-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <CTASection title="Gostou? Comece a praticar Python agora" />
    </>
  );
}
