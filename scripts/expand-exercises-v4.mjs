#!/usr/bin/env node
/**
 * Expansão v3 — gerador COMBINATÓRIO (tarefa × domínio) para exercícios únicos.
 * Leva o banco para 5.000+. Insere no Supabase via REST. ex_id "JX####".
 */
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !SERVICE) { console.error("Faltam env Supabase"); process.exit(1); }
const HEADERS = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55);

// domínios reais que dão contexto único aos exercícios
const DOMAINS = [
  "notas fiscais", "assinaturas", "cupons de desconto", "categorias", "fornecedores", "departamentos",
  "projetos", "sprints", "bugs", "deploys", "servidores", "domínios", "certificados", "backups",
  "newsletters", "campanhas", "leads", "contratos", "pagamentos", "reembolsos", "avaliações", "favoritos",
  "notificações", "permissões", "logs de auditoria", "webhooks", "integrações", "relatórios", "metas", "turmas",
  "matrículas", "presenças", "questões", "respostas", "certificados de conclusão", "trilhas", "módulos", "lições",
];

// [categoria, nível, tipo, TAREFA (com {d} para o domínio)]
const TASKS = [
  ["Web & APIs (FastAPI/Flask)", "avancado", "Implementação de API", [
    "Implemente uma API REST de {d} com CRUD completo e validação.",
    "Adicione paginação, ordenação e filtros à listagem de {d}.",
    "Implemente autenticação e autorização no recurso de {d}.",
    "Crie testes de integração para a API de {d}.",
  ]],
  ["Bancos de Dados & SQL", "intermediario", "Persistência", [
    "Modele e implemente o CRUD de {d} em SQLite.",
    "Implemente consultas com JOIN e agregações sobre {d}.",
    "Adicione paginação e busca por filtros em {d} com SQLAlchemy.",
    "Implemente um relatório agregado de {d} por período.",
  ]],
  ["POO & Design", "intermediario", "Modelagem OO", [
    "Modele {d} com classes, encapsulamento e validações.",
    "Aplique um padrão de projeto adequado para gerenciar {d}.",
    "Implemente um repositório em memória para {d} com testes.",
  ]],
  ["Data Science (NumPy/Pandas)", "avancado", "Análise de dados", [
    "Faça uma análise exploratória de um dataset de {d}.",
    "Limpe, transforme e agregue dados de {d} com pandas.",
    "Gere um relatório com métricas e gráficos de {d}.",
  ]],
  ["Automação, CLI & Scraping", "intermediario", "Automação", [
    "Crie uma CLI para gerenciar {d} (adicionar, listar, remover).",
    "Automatize a importação de {d} a partir de um CSV.",
    "Gere um relatório PDF/Excel de {d} automaticamente.",
  ]],
  ["Testes & Qualidade", "intermediario", "Testes/Qualidade", [
    "Escreva uma suíte de testes pytest para o módulo de {d}.",
    "Crie fixtures e parametrização para testar {d}.",
  ]],
  ["Async & Concorrência", "avancado", "Assíncrono", [
    "Implemente a sincronização concorrente de {d} de várias fontes.",
    "Crie um processador assíncrono de fila de {d}.",
  ]],
  ["Arquivos, CSV & JSON", "intermediario", "Implementação prática", [
    "Implemente a exportação de {d} para CSV, JSON e Excel.",
    "Valide e importe {d} de um JSON contra um schema.",
  ]],
];

const REQS = [
  "Implemente a solução em arquivo próprio, seguindo o caminho sugerido.",
  "Separe a lógica em camadas/funções reutilizáveis, com type hints.",
  "Trate erros e casos de borda com mensagens claras.",
];
const ACCEPT = ["Roda sem erros e cumpre o objetivo.", "Casos de borda tratados.", "Código limpo e organizado."];
const CHECK = ["Implementei conforme o objetivo.", "Testei entradas normais e de borda.", "Revisei a organização do código."];

const out = [];
let n = 0;
for (const [group, level, type, taskTemplates] of TASKS) {
  for (const tpl of taskTemplates) {
    for (const d of DOMAINS) {
      const title = tpl.replace("{d}", d);
      n += 1;
      out.push({
        ex_id: `KX${String(n).padStart(5, "0")}`,
        title,
        category: group,
        group_label: group,
        level,
        type,
        objective: title,
        requirements: REQS,
        acceptance: ACCEPT,
        checklist: CHECK,
        suggested_file: `exercicios/${slug(group)}/${slug(title)}.py`,
        suggested_test: `tests/test_${slug(title)}.py`,
        source: "expansao-v4",
        order_index: 600000 + n,
      });
    }
  }
}

console.log(`Gerados ${out.length} exercícios combinatórios. Inserindo...`);
let inserted = 0;
for (let i = 0; i < out.length; i += 200) {
  const batch = out.slice(i, i + 200);
  const res = await fetch(`${SUPA}/rest/v1/practice_exercises`, {
    method: "POST", headers: { ...HEADERS, Prefer: "return=minimal" }, body: JSON.stringify(batch),
  });
  if (!res.ok) { console.error("Erro:", res.status, (await res.text()).slice(0, 200)); break; }
  inserted += batch.length;
  console.log(`  ${inserted}/${out.length}`);
}
console.log(`✅ Inserido: ${inserted}`);
