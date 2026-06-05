/**
 * Faz o parsing de doc/Conteudos/exercicio_python.md e gera:
 *   - supabase/practice_exercises.json  (linhas para inserir via REST)
 *   - supabase/practice_exercises.sql   (DDL: tabela + RLS)
 *
 * Captura os blocos EX#### (trilha canônica) e PX#### (banco progressivo),
 * cada um com objetivo, requisitos, critérios de aceite e checklist.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "doc", "Conteudos", "exercicio_python.md");

const lines = readFileSync(SRC, "utf8").split(/\r?\n/);

const HEAD = /^#{3,4}\s+(EX|PX)(\d{4})\s+—\s+(.+?)\s*$/;
const ROW = /^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$/;

function clean(v) {
  return v.replace(/`/g, "").trim();
}

function levelOf(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("especialista")) return "desafio";
  if (t.includes("avançado") || t.includes("avancado")) return "avancado";
  if (t.includes("intermediário") || t.includes("intermediario"))
    return "intermediario";
  return "basico";
}

function groupOf(category) {
  const c = (category || "").toLowerCase();
  const has = (re) => re.test(c);
  if (has(/seguran|owasp|criptografia|jwt|injection|xss|csrf/)) return "Segurança";
  if (has(/big data|kafka|spark|streaming|lakehouse|hadoop/)) return "Big Data";
  if (has(/docker|devops|ci\/cd|kubernetes|observabilidade|infra|deploy|produç/))
    return "Docker & DevOps";
  if (has(/data science|machine learning|\bml\b|\bia\b|numpy|pandas|dados.*ml|ciência de dados|ciencia de dados|viz/))
    return "Data Science & ML";
  if (has(/web|api|fastapi|flask|backend|integraç|full stack|websocket|graphql/))
    return "Web & APIs";
  if (has(/sql|banco|persist|orm|database/)) return "SQL & Banco de Dados";
  if (has(/excel|openpyxl|planilha|relatório/)) return "Arquivos & Dados";
  if (has(/arquivo|csv|json|toml|yaml|serial/)) return "Arquivos & Dados";
  if (has(/automaç|automac|scraping|cli|shell|bot|scripts|produtividade/))
    return "Automação & CLI";
  if (has(/concorr|async|asyncio|performance|paralelis|thread/))
    return "Concorrência & Performance";
  if (has(/test|qualidade|pytest|tdd|cobertura/)) return "Testes & Qualidade";
  if (has(/avançado|avancado|decorator|metaclass|descriptor/))
    return "Python Avançado";
  if (has(/poo|orientada a objetos|design/)) return "POO";
  if (has(/função|funcoes|funções|módulo|modulo|pacote/)) return "Funções & Módulos";
  if (has(/estrutura|coleç|colec|algoritmo/)) return "Estruturas de Dados";
  if (has(/fundamento|sintaxe|preparaç|primeiros passos|essenciais|linguagem|nível 0|nível 1/))
    return "Fundamentos";
  if (has(/ferramenta|plataforma|ecossistema|framework/)) return "Ferramentas & Ecossistema";
  if (has(/desktop|mobile|gui/)) return "Desktop & Mobile";
  return "Outros";
}

const exercises = [];
let i = 0;
let order = 0;

while (i < lines.length) {
  const m = lines[i].match(HEAD);
  if (!m) {
    i++;
    continue;
  }
  const [, kind, num, title] = m;
  // coleta o bloco até o próximo cabeçalho EX/PX
  const block = [];
  i++;
  while (i < lines.length && !HEAD.test(lines[i])) {
    block.push(lines[i]);
    i++;
  }

  const fields = {};
  let section = null;
  const reqs = [];
  const accept = [];
  const checklist = [];
  let objective = "";

  for (const raw of block) {
    const line = raw.trim();
    const row = raw.match(ROW);
    if (row && !line.startsWith("| Campo") && !line.startsWith("|---")) {
      fields[clean(row[1]).toLowerCase()] = clean(row[2]);
      continue;
    }
    if (/^\*\*Objetivo\*\*/.test(line)) {
      section = "obj";
      continue;
    }
    if (/^\*\*Requisitos\*\*/.test(line)) {
      section = "req";
      continue;
    }
    if (/^\*\*Critérios de aceite\*\*/.test(line)) {
      section = "acc";
      continue;
    }
    if (/^\*\*Checklist\*\*/.test(line)) {
      section = "chk";
      continue;
    }
    if (line.startsWith("**")) {
      section = null;
      continue;
    }
    if (section === "obj" && line && line !== "---") {
      objective = objective ? `${objective} ${line}` : line;
    } else if (line.startsWith("- ")) {
      const item = line.replace(/^-\s+/, "").replace(/^\[[ x]\]\s*/i, "").trim();
      if (section === "req") reqs.push(item);
      else if (section === "acc") accept.push(item);
      else if (section === "chk") checklist.push(item);
    }
  }

  const category = fields["categoria"] || "Geral";
  order += 1;
  exercises.push({
    ex_id: `${kind}${num}`,
    title: title.replace(/`/g, ""),
    category,
    group_label: groupOf(category),
    level: levelOf(fields["nível sugerido"] || fields["nivel sugerido"]),
    type: fields["tipo"] || "Implementação prática",
    objective: objective || title,
    requirements: reqs,
    acceptance: accept,
    checklist,
    suggested_file: fields["arquivo sugerido"] || null,
    suggested_test: fields["teste sugerido"] || null,
    source: kind === "EX" ? "canonico" : "progressivo",
    order_index: order,
  });
}

writeFileSync(
  join(ROOT, "supabase", "practice_exercises.json"),
  JSON.stringify(exercises),
);

const ddl = `-- Tabela do banco de exercícios (gerada de exercicio_python.md)
create table if not exists public.practice_exercises (
  id             uuid primary key default gen_random_uuid(),
  ex_id          text unique not null,
  title          text not null,
  category       text,
  group_label    text,
  level          difficulty_level not null default 'basico',
  type           text,
  objective      text,
  requirements   text[] default '{}',
  acceptance     text[] default '{}',
  checklist      text[] default '{}',
  suggested_file text,
  suggested_test text,
  source         text,
  order_index    int default 0,
  created_at     timestamptz not null default now()
);
create index if not exists idx_practice_group on public.practice_exercises(group_label);
create index if not exists idx_practice_level on public.practice_exercises(level);
alter table public.practice_exercises enable row level security;
drop policy if exists "read_practice" on public.practice_exercises;
create policy "read_practice" on public.practice_exercises for select using (true);
`;
writeFileSync(join(ROOT, "supabase", "practice_exercises.sql"), ddl);

const byGroup = {};
const byLevel = {};
for (const e of exercises) {
  byGroup[e.group_label] = (byGroup[e.group_label] || 0) + 1;
  byLevel[e.level] = (byLevel[e.level] || 0) + 1;
}
console.log(`Exercícios: ${exercises.length}`);
console.log("Por nível:", byLevel);
console.log("Grupos:", Object.keys(byGroup).length);
console.table(byGroup);
