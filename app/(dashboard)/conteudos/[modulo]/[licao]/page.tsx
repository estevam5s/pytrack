import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import {
  extractToc,
  getLesson,
  readLessonBody,
} from "@/lib/content/registry";
import { Markdown } from "@/components/content/markdown";
import { ReaderShell } from "@/components/content/reader-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modulo: string; licao: string }>;
}) {
  const { modulo, licao } = await params;
  const found = getLesson(modulo, licao);
  return { title: found ? `${found.lesson.title} · PyTrack` : "Lição · PyTrack" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ modulo: string; licao: string }>;
}) {
  const { modulo, licao } = await params;
  const found = getLesson(modulo, licao);
  if (!found) notFound();

  const { module, lesson, index } = found;
  const body = await readLessonBody(lesson);
  const toc = extractToc(body);

  return (
    <div>
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/inicio" className="hover:text-foreground">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/minhas-trilhas" className="hover:text-foreground">
          Trilhas
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/conteudos/${module.slug}`} className="hover:text-foreground">
          {module.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{lesson.title}</span>
      </nav>

      <ReaderShell
        moduleSlug={module.slug}
        moduleTitle={module.title}
        lessons={module.lessons.map((l) => ({
          slug: l.slug,
          title: l.title,
          order: l.order,
        }))}
        currentIndex={index}
        toc={toc}
      >
        <Markdown>{body}</Markdown>
      </ReaderShell>
    </div>
  );
}
