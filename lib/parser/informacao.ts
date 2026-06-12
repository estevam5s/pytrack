/**
 * Parser do arquivo informacao.md (Stack Python Profissional).
 *
 * Lê o Markdown, extrai as seções (headings ##), itens de lista, tabelas e
 * links, e transforma tudo em objetos LearningContent prontos para importar
 * no Supabase (tabela `contents`).
 *
 * Uso: `tsx scripts/import-informacao.ts` (ver scripts/).
 */

export type ParsedLevel = "basico" | "intermediario" | "avancado";

export interface LearningContent {
  title: string;
  description: string;
  category: string;
  level: ParsedLevel;
  area: string;
  estimatedHours?: number;
}

export interface ParsedSection {
  heading: string;
  subheadings: { title: string; items: string[] }[];
  links: { label: string; url: string }[];
}

/** Mapeia uma seção do guia para uma área de carreira. */
const AREA_BY_KEYWORD: { match: RegExp; area: string }[] = [
  { match: /fundamento|biblioteca padr|poo|estrutura/i, area: "Fundamentos" },
  { match: /web|api|backend/i, area: "Backend" },
  { match: /banco|persist/i, area: "Backend" },
  { match: /data science|analytics|visualiza/i, area: "Data Science" },
  { match: /machine learning|mlops|\bia\b/i, area: "Machine Learning" },
  { match: /async|concorr|background/i, area: "Backend" },
  { match: /automa|cli|scraping|bot/i, area: "Automação" },
  { match: /devops|infra|deploy/i, area: "DevOps" },
  { match: /big data|streaming|orquestra/i, area: "Engenharia de Dados" },
  { match: /test|qualidade|seguran/i, area: "Qualidade" },
  { match: /observabilidade|opera/i, area: "DevOps" },
  { match: /especializad/i, area: "Especializações" },
];

function areaFor(heading: string): string {
  for (const { match, area } of AREA_BY_KEYWORD) {
    if (match.test(heading)) return area;
  }
  return "Geral";
}

/** Heurística simples de nível a partir do texto do subheading/seção. */
function levelFor(text: string): ParsedLevel {
  if (/avanc|senior|interno|metaprogram|distribu|escala/i.test(text))
    return "avancado";
  if (/essencial|fundamento|introdu|b[aá]sico/i.test(text)) return "basico";
  if (/recomendad|profission|interm/i.test(text)) return "intermediario";
  return "intermediario";
}

/**
 * Faz o parsing do conteúdo Markdown em seções estruturadas.
 */
export function parseSections(markdown: string): ParsedSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: ParsedSection[] = [];

  let current: ParsedSection | null = null;
  let currentSub: { title: string; items: string[] } | null = null;
  let inCodeBlock = false;

  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (line.startsWith("## ")) {
      current = {
        heading: line.replace(/^##\s+/, "").trim(),
        subheadings: [],
        links: [],
      };
      currentSub = null;
      sections.push(current);
      continue;
    }

    if (!current) continue;

    if (line.startsWith("### ")) {
      currentSub = { title: line.replace(/^###\s+/, "").trim(), items: [] };
      current.subheadings.push(currentSub);
      continue;
    }

    // Itens de lista
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      const text = listMatch[1].replace(/\*\*/g, "").trim();
      if (!currentSub) {
        currentSub = { title: "Geral", items: [] };
        current.subheadings.push(currentSub);
      }
      currentSub.items.push(text);
    }

    // Links
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(line)) !== null) {
      current.links.push({ label: m[1], url: m[2] });
    }
  }

  return sections;
}

/**
 * Transforma as seções em uma lista de LearningContent.
 * Cada subheading vira um conteúdo, com a descrição derivada dos seus itens.
 */
export function toLearningContents(
  markdown: string,
): LearningContent[] {
  const sections = parseSections(markdown);
  const contents: LearningContent[] = [];

  // Ignora seções meta (sumário, como usar, matriz, templates, etc.)
  const skip = /sum[aá]rio|como usar|vis[aã]o executiva|matriz|template|checklist|conclus/i;

  for (const section of sections) {
    if (skip.test(section.heading)) continue;
    const area = areaFor(section.heading);

    for (const sub of section.subheadings) {
      if (!sub.items.length) continue;
      const description = sub.items.slice(0, 4).join(" ");
      contents.push({
        title: `${section.heading} — ${sub.title}`,
        description:
          description.length > 280
            ? description.slice(0, 277) + "..."
            : description,
        category: section.heading,
        level: levelFor(`${sub.title} ${description}`),
        area,
        estimatedHours: Math.max(2, Math.min(20, sub.items.length * 1.5)),
      });
    }
  }

  return contents;
}
