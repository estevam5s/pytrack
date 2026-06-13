#!/usr/bin/env node
/**
 * Expansão v7 — DOBRA o banco de exercícios (~+5.300) com tipos e complexidades
 * bem variados. Combinatório TAREFA × DOMÍNIO. ex_id "TX#####". Insere via REST.
 */
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !SERVICE) { console.error("Faltam env Supabase"); process.exit(1); }
const HEADERS = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55);

// ~90 domínios reais para dar contexto único
const DOMAINS = [
  "tarefas", "finanças pessoais", "estoque", "vendas", "biblioteca", "clínica médica",
  "escola", "restaurante", "academia", "imobiliária", "eventos", "viagens",
  "receitas culinárias", "hábitos", "notas de estudo", "frota de veículos",
  "previsão do tempo", "criptomoedas", "ações da bolsa", "notícias", "vagas de emprego",
  "produtos", "pedidos", "usuários", "pacientes", "agendamentos", "logística",
  "recursos humanos", "tickets de suporte", "blog", "fórum", "rede social",
  "delivery", "marketplace", "investimentos", "consumo de energia", "transporte público",
  "chamados técnicos", "equipamentos", "manutenções", "garantias", "peças",
  "ordens de serviço", "acervos", "empréstimos", "multas", "associados",
  "matrículas", "turmas", "professores", "disciplinas", "boletins", "frequência",
  "cardápios", "reservas", "mesas", "comandas", "fornecedores", "compras",
  "doações", "voluntários", "campanhas", "metas", "orçamentos", "despesas",
  "assinaturas", "faturas", "contratos", "clientes", "leads", "propostas",
  "sensores IoT", "leituras de medidores", "alarmes", "rotas de entrega", "motoristas",
  "playlists", "músicas", "filmes", "séries", "avaliações", "comentários",
  "produtos agrícolas", "safras", "lotes", "rastreamento", "qualidade", "inspeções",
  "consultas jurídicas", "processos", "audiências", "documentos",
];

// [categoria, nível, tipo, [templates com {d}]]
const TASKS = [
  ["Fundamentos & Sintaxe", "basico", "Implementação prática", [
    "Crie um programa que cadastre e liste {d} usando listas e dicionários.",
    "Implemente um menu de terminal (CRUD em memória) para {d}.",
    "Conte e agrupe {d} por categoria, exibindo um resumo.",
    "Valide a entrada de dados de {d} com mensagens de erro claras.",
  ]],
  ["Strings & Texto", "basico", "Manipulação de texto", [
    "Normalize e formate nomes/descrições de {d} (capitalização, espaços).",
    "Implemente uma busca textual simples em registros de {d}.",
    "Gere relatórios de {d} formatados com f-strings alinhadas.",
  ]],
  ["Coleções & Comprehensions", "intermediario", "Estruturas de dados", [
    "Use comprehensions para filtrar e transformar {d}.",
    "Agrupe {d} com defaultdict e conte com Counter.",
    "Implemente um índice invertido de {d} para busca rápida.",
  ]],
  ["POO & Design", "intermediario", "Modelagem OO", [
    "Modele {d} com classes, encapsulamento e validações.",
    "Aplique um padrão de projeto adequado para gerenciar {d}.",
    "Implemente um repositório em memória para {d} com testes.",
    "Crie uma hierarquia de classes (ABC) para tipos de {d}.",
  ]],
  ["Arquivos, CSV & JSON", "intermediario", "Serialização", [
    "Implemente a exportação de {d} para CSV, JSON e Excel.",
    "Valide e importe {d} de um JSON contra um schema.",
    "Faça o merge incremental de arquivos de {d} sem duplicar.",
  ]],
  ["Bancos de Dados & SQL", "intermediario", "Persistência", [
    "Modele e implemente o CRUD de {d} em SQLite.",
    "Implemente consultas com JOIN e agregações sobre {d}.",
    "Adicione paginação e busca por filtros em {d} com SQLAlchemy.",
    "Implemente um relatório agregado de {d} por período.",
  ]],
  ["Web & APIs (FastAPI/Flask)", "avancado", "Implementação de API", [
    "Implemente uma API REST de {d} com CRUD completo e validação.",
    "Adicione paginação, ordenação e filtros à listagem de {d}.",
    "Implemente autenticação e autorização no recurso de {d}.",
    "Crie testes de integração para a API de {d}.",
    "Implemente cache e rate limiting na API de {d}.",
  ]],
  ["Data Science (NumPy/Pandas)", "avancado", "Análise de dados", [
    "Faça uma análise exploratória de um dataset de {d}.",
    "Limpe, transforme e agregue dados de {d} com pandas.",
    "Gere um relatório com métricas e gráficos de {d}.",
    "Detecte outliers e valores ausentes em dados de {d}.",
  ]],
  ["Machine Learning", "avancado", "Modelagem preditiva", [
    "Treine um classificador para prever uma categoria de {d}.",
    "Construa um pipeline de pré-processamento + modelo para {d}.",
    "Avalie um modelo de {d} com validação cruzada e métricas.",
  ]],
  ["Automação, CLI & Scraping", "intermediario", "Automação", [
    "Crie uma CLI (Typer) para gerenciar {d}.",
    "Automatize a importação de {d} a partir de um CSV.",
    "Gere um relatório PDF/Excel de {d} automaticamente.",
    "Implemente um web scraper resiliente de {d}.",
  ]],
  ["Async & Concorrência", "avancado", "Assíncrono", [
    "Implemente a sincronização concorrente de {d} de várias fontes.",
    "Crie um processador assíncrono de fila de {d}.",
    "Implemente um cliente HTTP async com retries para {d}.",
  ]],
  ["Testes & Qualidade", "intermediario", "Testes/Qualidade", [
    "Escreva uma suíte de testes pytest para o módulo de {d}.",
    "Crie fixtures e parametrização para testar {d}.",
    "Adicione property-based testing (Hypothesis) ao módulo de {d}.",
  ]],
  ["Segurança", "avancado", "Segurança", [
    "Implemente hashing seguro de senhas no cadastro de {d}.",
    "Adicione validação contra injeção ao módulo de {d}.",
    "Implemente autenticação JWT para a API de {d}.",
  ]],
  ["DevOps & Deploy", "avancado", "Infraestrutura", [
    "Containerize com Docker uma aplicação de {d}.",
    "Crie um pipeline de CI (GitHub Actions) para o projeto de {d}.",
    "Adicione logging estruturado e health checks ao serviço de {d}.",
  ]],
  ["Algoritmos & Performance", "desafio", "Algoritmos", [
    "Otimize a busca/ordenação de grandes volumes de {d}.",
    "Implemente um cache (memoization) para cálculos sobre {d}.",
    "Resolva um problema de agendamento/otimização envolvendo {d}.",
  ]],
  ["Visualização & Dashboards", "intermediario", "Visualização", [
    "Construa um dashboard interativo (Streamlit) de {d}.",
    "Gere gráficos comparativos e séries temporais de {d}.",
  ]],
];

const REQS = {
  basico: ["Implemente em arquivo próprio, seguindo o caminho sugerido.", "Use nomes claros e trate entradas inválidas.", "Inclua um exemplo de uso."],
  intermediario: ["Separe a lógica em camadas/funções reutilizáveis, com type hints.", "Trate erros e casos de borda com mensagens claras.", "Escreva ao menos um teste automatizado."],
  avancado: ["Estruture em camadas (domínio, serviço, infraestrutura).", "Adicione testes com boa cobertura e logging.", "Trate concorrência/falhas e documente decisões."],
  desafio: ["Arquitetura escalável, desacoplada e testável.", "Meça desempenho antes/depois e justifique escolhas.", "Inclua testes, observabilidade e documentação técnica."],
};
const ACCEPT = {
  basico: ["Roda sem erros e cumpre o objetivo.", "Casos de borda tratados.", "Código legível."],
  intermediario: ["Cumpre o objetivo com código organizado.", "Casos de borda e erros tratados.", "Tem teste cobrindo o caminho feliz."],
  avancado: ["Solução em camadas, testada e com logging.", "Erros e concorrência tratados.", "Documentação de uso presente."],
  desafio: ["Atende requisitos não-funcionais (perf/escala).", "Testes e medição de desempenho presentes.", "Decisões técnicas documentadas."],
};
const CHECK = ["Implementei conforme o objetivo.", "Testei entradas normais e de borda.", "Revisei a organização e a legibilidade.", "Registrei o aprendizado em nota/README."];

const out = [];
let n = 0;
for (const [group, level, type, taskTemplates] of TASKS) {
  for (const tpl of taskTemplates) {
    for (const d of DOMAINS) {
      const title = tpl.replace("{d}", d);
      n += 1;
      out.push({
        ex_id: `TX${String(n).padStart(5, "0")}`,
        title,
        category: group,
        group_label: group,
        level,
        type,
        objective: title,
        requirements: REQS[level],
        acceptance: ACCEPT[level],
        checklist: CHECK,
        suggested_file: `exercicios/${slug(group)}/${slug(title)}.py`,
        suggested_test: `tests/test_${slug(title)}.py`,
        source: "expansao-v7",
        order_index: 900000 + n,
      });
    }
  }
}

console.log(`Gerados ${out.length} exercícios (TX). Inserindo...`);
let inserted = 0;
for (let i = 0; i < out.length; i += 200) {
  const batch = out.slice(i, i + 200);
  const res = await fetch(`${SUPA}/rest/v1/practice_exercises`, {
    method: "POST", headers: { ...HEADERS, Prefer: "return=minimal" }, body: JSON.stringify(batch),
  });
  if (!res.ok) { console.error("Erro:", res.status, (await res.text()).slice(0, 300)); break; }
  inserted += batch.length;
  if (inserted % 1000 === 0 || inserted === out.length) console.log(`  ${inserted}/${out.length}`);
}
console.log(`✅ Inserido: ${inserted}`);
