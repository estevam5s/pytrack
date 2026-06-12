/**
 * Parser de doc/Conteudos/perguntas.md → perguntas de entrevista por tecnologia.
 * Gera supabase/interview_questions.json (insert via REST) + .sql (DDL).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "doc", "Conteudos", "perguntas.md");
const lines = readFileSync(SRC, "utf8").split(/\r?\n/);

// Classificador por tecnologia/tema a partir do texto da pergunta + conceito.
const CATEGORIES = [
  ["Segurança", /seguran|autentic|autoriz|jwt|oauth|owasp|criptografi|hash|senha|token|injection|xss|csrf|vulnerab/],
  ["DevOps & Produção", /docker|kubernet|container|deploy|ci\/cd|cicd|pipeline|produç|observabil|logging|monitor|nginx|gunicorn|uvicorn|infra|escalabil|rollback/],
  ["Banco de Dados & ORM", /\bsql\b|banco de dados|\borm\b|sqlalchemy|django orm|query|índice|indice|transaç|postgres|mysql|sqlite|redis|mongo|cassandra|elasticsearch|migration|normaliza|persist/],
  ["APIs & Web", /\bapi\b|rest|graphql|websocket|fastapi|flask|django|endpoint|\bhttp\b|requisiç|rota|swagger|openapi|cors|middleware|grpc/],
  ["Data Science & IA", /pandas|numpy|dataframe|machine learning|aprendizado de m|\bml\b|\bia\b|inteligência artificial|ciência de dados|cientista de dados|modelo|dataset|etl|estatístic|visualiza|matplotlib|análise de dados/],
  ["Async & Concorrência", /async|await|asyncio|concorr|paralel|thread|multiprocess|corrotina|\bgil\b|celery|fila|event loop|i\/o-bound|cpu-bound/],
  ["Testes & Qualidade", /\bteste|pytest|unittest|\bmock|\btdd\b|cobertura|coverage|lint|mypy|ruff|black|qualidade de código|fixture/],
  ["POO", /classe|objeto|herança|heranca|polimorfismo|encapsulamento|abstrat|\bpoo\b|orientaç|solid|interface|método mágico|dunder|dataclass|metaclass|mixin|composiç/],
  ["Funções & Funcional", /função|funcao|funções|lambda|closure|decorator|generator|gerador|yield|higher-order|map\b|filter\b|reduce|recurs/],
  ["Estruturas de Dados", /lista|tupla|dicionário|dicionario|conjunto|\bset\b|pilha|fila|deque|árvore|arvore|grafo|hash|complexidade|big o|ordenaç|busca|algoritmo|coleç/],
  ["Arquivos & Dados", /arquivo|\bcsv\b|\bjson\b|excel|openpyxl|serializ|pickle|yaml|toml|parquet|leitura e escrita/],
  ["Git & Versionamento", /\bgit\b|versionament|commit|branch|merge|repositório|github/],
  ["Carreira & Boas Práticas", /carreira|sênior|senior|júnior|junior|mercado|entrevista|profission|clean code|boas práticas|pep 8|legibilidade|refator/],
  ["Fundamentos de Python", /.*/], // fallback
];

function normalize(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function classify(question, concept) {
  const hay = normalize(`${question} ${concept}`);
  for (const [name, re] of CATEGORIES) if (re.test(hay)) return name;
  return "Fundamentos de Python";
}

const HEAD = /^##\s+(\d+)\.\s+(.+?)\s*$/;
const questions = [];
let i = 0;

while (i < lines.length) {
  const m = lines[i].match(HEAD);
  if (!m) {
    i++;
    continue;
  }
  const num = Number(m[1]);
  const question = m[2].trim();
  i++;
  const block = [];
  while (i < lines.length && !HEAD.test(lines[i])) {
    block.push(lines[i]);
    i++;
  }

  const text = block.join("\n");

  const field = (label) => {
    const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`);
    const mm = text.match(re);
    return mm ? mm[1].trim() : null;
  };

  // código (primeiro bloco cercado)
  const codeMatch = text.match(/```(?:python)?\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : null;

  // intro: conteúdo antes de **Explicação ampliada**, sem listas de explicação
  const idx = text.indexOf("**Explicação ampliada**");
  let intro = (idx > 0 ? text.slice(0, idx) : "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "---" && !l.startsWith("```") && !l.startsWith("**"))
    .join(" ")
    .replace(/`/g, "")
    .trim();
  if (intro.length > 320) intro = intro.slice(0, 317) + "...";

  const concept = field("Conceito-chave");
  questions.push({
    num,
    question,
    category: classify(question, concept || ""),
    intro: intro || null,
    concept,
    application: field("Aplicação prática"),
    mistakes: field("Erros comuns"),
    fix_fast: field("Como fixar rápido"),
    code,
    order_index: num,
  });
}

writeFileSync(
  join(ROOT, "supabase", "interview_questions.json"),
  JSON.stringify(questions),
);

const ddl = `-- Perguntas de entrevista por tecnologia (gerada de perguntas.md)
create table if not exists public.interview_questions (
  id          uuid primary key default gen_random_uuid(),
  num         int,
  question    text not null,
  category    text,
  intro       text,
  concept     text,
  application text,
  mistakes    text,
  fix_fast    text,
  code        text,
  order_index int default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_questions_category on public.interview_questions(category);
alter table public.interview_questions enable row level security;
drop policy if exists "read_questions" on public.interview_questions;
create policy "read_questions" on public.interview_questions for select using (true);
`;
writeFileSync(join(ROOT, "supabase", "interview_questions.sql"), ddl);

const byCat = {};
for (const q of questions) byCat[q.category] = (byCat[q.category] || 0) + 1;
console.log(`Perguntas: ${questions.length} | categorias: ${Object.keys(byCat).length}`);
console.table(byCat);
