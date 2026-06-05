import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MODULES as BASE_MODULES, type ContentModule, type Lesson } from "./manifest";
import { EXTRA_MODULES } from "./extra-manifest";

export const MODULES: ContentModule[] = [...BASE_MODULES, ...EXTRA_MODULES];
export const MODULE_BY_SLUG: Record<string, ContentModule> = Object.fromEntries(
  MODULES.map((m) => [m.slug, m]),
);
export type { ContentModule, Lesson };

export function getModule(slug: string): ContentModule | undefined {
  return MODULE_BY_SLUG[slug];
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string,
): { module: ContentModule; lesson: Lesson; index: number } | undefined {
  const module = MODULE_BY_SLUG[moduleSlug];
  if (!module) return undefined;
  const index = module.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { module, lesson: module.lessons[index], index };
}

/** Lê o corpo markdown de uma lição a partir do arquivo em doc/Conteudos. */
export async function readLessonBody(lesson: Lesson): Promise<string> {
  const path = join(process.cwd(), lesson.file);
  try {
    return await readFile(path, "utf8");
  } catch {
    return `# ${lesson.title}\n\nConteúdo indisponível no momento.`;
  }
}

/** Extrai a tabela de conteúdo (headings ## e ###) do markdown. */
export function extractToc(
  markdown: string,
): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];
  let inCode = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) {
      const text = m[2].replace(/[*`]/g, "").trim();
      const id = text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      toc.push({ id, text, level: m[1].length });
    }
  }
  return toc;
}
