/**
 * Gera o manifesto de conteúdos a partir de doc/Conteudos.
 *
 *  - lib/content/manifest.ts   → módulos + lições tipados (sem corpo, só metadados + path)
 *  - supabase/contents_docs.sql → upsert dos módulos na tabela `contents`
 *
 * Uso: node scripts/generate-content.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const BASE = join(ROOT, "doc", "Conteudos");

// folder (subdir imediato de Parte-N) → metadados do módulo
const MODULE_META = {
  Basico: ["Fundamentos de Python", "Fundamentos", "basico", "Fundamentos de Python"],
  Estruturas: ["Estruturas de Dados e Algoritmos", "Algoritmos", "intermediario", "Estruturas de Dados"],
  Calculo_complete: ["Matemática para Programadores", "Matemática", "intermediario", "Matemática"],
  Arquivos: ["Arquivos, Formatos e Serialização", "Persistência", "intermediario", "Arquivos"],
  Conceitos: ["Fundamentos de Banco de Dados", "Banco de Dados", "intermediario", "Banco de Dados"],
  OOP: ["Programação Orientada a Objetos", "Engenharia de Software", "intermediario", "POO"],
  SOLID: ["SOLID e Design de Software", "Engenharia de Software", "avancado", "SOLID & Design"],
  Async: ["Async, Concorrência e Mensageria", "Performance & Async", "avancado", "Async"],
  BigO: ["Algoritmos, Big O e Performance", "Performance & Async", "avancado", "Performance"],
  Automacao: ["Automação, Scraping e Bots", "Automação", "intermediario", "Automação"],
  "code-quality": ["Qualidade de Código", "Qualidade", "intermediario", "Qualidade"],
  Excel: ["Excel e Planilhas com Python", "Automação", "basico", "Excel"],
  Financas: ["Finanças com Python", "Finanças", "intermediario", "Finanças"],
  Financas_quantitativas: ["Finanças Quantitativas", "Finanças", "avancado", "Finanças Quant"],
  HTTP: ["Redes, HTTP e Protocolos", "Redes", "intermediario", "Redes & HTTP"],
  "Python-doc": ["Documentação de Software", "Qualidade", "intermediario", "Documentação"],
  Test: ["Testes Automatizados", "Qualidade", "intermediario", "Testes"],
  API: ["APIs: REST, GraphQL, gRPC e WebSockets", "Backend", "avancado", "APIs"],
  ORM: ["ORMs e Bancos NoSQL", "Banco de Dados", "intermediario", "ORM & NoSQL"],
  SQL: ["SQL e Bancos Relacionais", "Banco de Dados", "intermediario", "SQL"],
  Infra: ["Infraestrutura, CI/CD e Servidores", "DevOps", "avancado", "Infraestrutura"],
  IoT: ["Internet das Coisas (IoT)", "IoT", "avancado", "IoT"],
  Observabilidade: ["Observabilidade e Monitoramento", "DevOps", "avancado", "Observabilidade"],
  Productions: ["Deploy e Produção", "DevOps", "avancado", "Produção"],
  Data_science: ["Data Science e Engenharia de Dados", "Data Science", "intermediario", "Data Science"],
  "Bioinformática": ["Bioinformática com Python", "Especializações", "avancado", "Bioinformática"],
  "Cyber-sec": ["Cibersegurança com Python", "Segurança", "avancado", "Segurança"],
  DevOPS: ["DevOps Avançado", "DevOps", "avancado", "DevOps"],
  Engenharia: ["Arquitetura de Software", "Arquitetura", "avancado", "Arquitetura"],
  Sistemas_embarcados: ["Sistemas Embarcados", "IoT", "avancado", "Embarcados"],
};

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(file) {
  return file
    .replace(/\.md$/, "")
    .replace(/^\d+[_-]/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function firstHeading(path) {
  try {
    const txt = readFileSync(path, "utf8");
    const m = txt.match(/^#\s+(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  return null;
}

function firstParagraph(path) {
  try {
    const txt = readFileSync(path, "utf8");
    const lines = txt.split(/\r?\n/);
    let seenH1 = false;
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      if (t.startsWith("#")) {
        seenH1 = true;
        continue;
      }
      if (seenH1 && !t.startsWith("|") && !t.startsWith(">") && !t.startsWith("-")) {
        return t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 240);
      }
    }
  } catch {}
  return null;
}

// coleta recursiva de arquivos .md (exceto README)
function collectMd(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectMd(full));
    else if (entry.endsWith(".md") && entry.toLowerCase() !== "readme.md")
      out.push(full);
  }
  return out;
}

const modules = [];
let order = 0;

const parts = readdirSync(BASE)
  .filter((d) => /^Parte-\d+$/.test(d) && statSync(join(BASE, d)).isDirectory())
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

for (const part of parts) {
  const partNum = Number(part.split("-")[1]);
  const partDir = join(BASE, part);

  const subdirs = readdirSync(partDir).filter((d) =>
    statSync(join(partDir, d)).isDirectory(),
  );

  for (const folder of subdirs.sort()) {
    const moduleDir = join(partDir, folder);
    const meta = MODULE_META[folder] || [humanize(folder), "Geral", "intermediario", folder];
    const [title, area, level, category] = meta;

    const files = collectMd(moduleDir).sort((a, b) => a.localeCompare(b, "pt"));
    if (!files.length) continue;

    const slug = slugify(`${part}-${folder}`);
    const readme = join(moduleDir, "README.md");
    const description =
      (existsSync(readme) && firstParagraph(readme)) ||
      `Trilha completa e aprofundada sobre ${title.toLowerCase()}, com ${files.length} lições práticas.`;

    const lessons = files.map((f, i) => {
      const rel = relative(ROOT, f);
      const within = relative(moduleDir, f);
      return {
        slug: slugify(within.replace(/\.md$/, "")),
        title: firstHeading(f) || humanize(within.split("/").pop()),
        file: rel,
        order: i + 1,
      };
    });

    order += 1;
    modules.push({
      slug,
      title,
      description,
      part: partNum,
      partLabel: `Parte ${partNum}`,
      folder,
      area,
      level,
      category,
      orderIndex: order,
      estimatedHours: Math.max(4, Math.round(lessons.length * 2.5)),
      lessons,
    });
  }
}

// ---- manifest.ts ----
const ts = `// GERADO AUTOMATICAMENTE por scripts/generate-content.mjs — não edite à mão.
export interface Lesson {
  slug: string;
  title: string;
  file: string;
  order: number;
}

export interface ContentModule {
  slug: string;
  title: string;
  description: string;
  part: number;
  partLabel: string;
  folder: string;
  area: string;
  level: "basico" | "intermediario" | "avancado";
  category: string;
  orderIndex: number;
  estimatedHours: number;
  lessons: Lesson[];
}

export const MODULES: ContentModule[] = ${JSON.stringify(modules, null, 2)};

export const MODULE_BY_SLUG: Record<string, ContentModule> = Object.fromEntries(
  MODULES.map((m) => [m.slug, m]),
);
`;
writeFileSync(join(ROOT, "lib", "content", "manifest.ts"), ts);

// ---- SQL ----
const esc = (s) => String(s ?? "").replace(/'/g, "''");
const rows = modules
  .map(
    (m) =>
      `('${esc(m.title)}', '${esc(m.description)}', '${esc(m.category)}', '${m.level}', '${esc(m.area)}', ${m.orderIndex}, ${m.estimatedHours}, '${m.slug}', ${m.lessons.length})`,
  )
  .join(",\n");

const sql = `-- GERADO por scripts/generate-content.mjs
alter table public.contents add column if not exists slug text;
alter table public.contents add column if not exists lessons_count int default 0;
create unique index if not exists idx_contents_slug on public.contents(slug) where slug is not null;

truncate table public.contents restart identity cascade;

insert into public.contents
  (title, description, category, level, area, order_index, estimated_hours, slug, lessons_count)
values
${rows};
`;
writeFileSync(join(ROOT, "supabase", "contents_docs.sql"), sql);

const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
console.log(`Módulos: ${modules.length} | Lições: ${totalLessons}`);
console.log("Áreas:", [...new Set(modules.map((m) => m.area))].join(", "));
console.log("→ lib/content/manifest.ts");
console.log("→ supabase/contents_docs.sql");
