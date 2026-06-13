#!/usr/bin/env node
/**
 * Expansão de projetos — TRIPLICA o catálogo (~+2.800) com arquétipos NOVOS
 * (sem colidir com os existentes) × domínios. Insere direto via REST.
 */
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !SERVICE) { console.error("Faltam env Supabase"); process.exit(1); }
const HEADERS = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Arquétipos NOVOS (diferentes dos já existentes) p/ títulos únicos
const ARCH = [
  ["Aplicativo desktop (Tkinter) para {d}", "intermediario", "Desktop", ["Tkinter"]],
  ["Aplicativo desktop (PySide6) para {d}", "avancado", "Desktop", ["PySide6", "SQLite"]],
  ["Jogo 2D de {d} com Pygame", "intermediario", "Jogos", ["pygame"]],
  ["Assistente de IA (RAG) sobre {d}", "desafio", "Machine Learning", ["LangChain", "FAISS", "OpenAI"]],
  ["Agente autônomo para {d}", "desafio", "Machine Learning", ["LangGraph", "Tool Use"]],
  ["Chatbot de {d} com LLM", "avancado", "Machine Learning", ["FastAPI", "OpenAI"]],
  ["Detecção de objetos em {d}", "desafio", "Machine Learning", ["OpenCV", "YOLO"]],
  ["OCR e extração de {d}", "avancado", "Machine Learning", ["Tesseract", "OpenCV"]],
  ["Reconhecimento de voz para {d}", "avancado", "Machine Learning", ["SpeechRecognition"]],
  ["Sistema de recomendação de {d}", "avancado", "Machine Learning", ["scikit-learn", "implicit"]],
  ["Análise de sentimentos de {d}", "avancado", "Machine Learning", ["Transformers"]],
  ["Previsão de séries temporais de {d}", "avancado", "Data Science", ["Prophet", "Pandas"]],
  ["Data warehouse de {d} com dbt", "desafio", "Engenharia de Dados", ["dbt", "DuckDB"]],
  ["Streaming em tempo real de {d}", "desafio", "Engenharia de Dados", ["Kafka", "Faust"]],
  ["Data lake de {d} em Parquet", "avancado", "Engenharia de Dados", ["PyArrow", "Polars"]],
  ["Web app full-stack de {d} (HTMX)", "avancado", "Web", ["FastAPI", "HTMX", "Jinja2"]],
  ["Painel administrativo de {d}", "avancado", "Web", ["Django", "DRF"]],
  ["Loja virtual de {d}", "desafio", "Web", ["Django", "Stripe"]],
  ["Sistema de reservas de {d}", "avancado", "Web", ["FastAPI", "PostgreSQL"]],
  ["Rede social de nicho para {d}", "desafio", "Web", ["FastAPI", "WebSockets", "Redis"]],
  ["API GraphQL federada de {d}", "desafio", "Backend", ["Strawberry", "FastAPI"]],
  ["Gateway de pagamentos para {d}", "desafio", "Backend", ["FastAPI", "Stripe", "Webhooks"]],
  ["Sistema de notificações multicanal de {d}", "avancado", "Backend", ["Celery", "Redis", "SMTP"]],
  ["Motor de busca de {d}", "desafio", "Backend", ["Elasticsearch", "FastAPI"]],
  ["Encurtador de links para {d}", "intermediario", "Backend", ["FastAPI", "Redis"]],
  ["Sistema de feature flags para {d}", "avancado", "Backend", ["FastAPI", "Redis"]],
  ["Bot de Discord para {d}", "intermediario", "Automação", ["discord.py"]],
  ["Bot de WhatsApp para {d}", "avancado", "Automação", ["FastAPI", "Webhooks"]],
  ["Robô de RPA para {d}", "avancado", "Automação", ["Playwright"]],
  ["Gerador de relatórios agendados de {d}", "intermediario", "Automação", ["APScheduler", "Pandas"]],
  ["Sincronizador de {d} entre sistemas", "avancado", "Automação", ["httpx", "Pydantic"]],
  ["Ferramenta de linha de comando rica para {d}", "intermediario", "Automação", ["Typer", "Rich"]],
  ["Monitor de uptime de {d}", "intermediario", "DevOps", ["httpx", "Prometheus"]],
  ["Coletor de métricas de {d}", "avancado", "DevOps", ["OpenTelemetry", "Grafana"]],
  ["Infra como código para {d}", "desafio", "DevOps", ["Pulumi", "AWS"]],
  ["Pipeline de MLOps para {d}", "desafio", "Machine Learning", ["MLflow", "FastAPI", "Docker"]],
  ["Scanner de segurança para {d}", "avancado", "Segurança", ["requests", "regex"]],
  ["Cofre de segredos para {d}", "avancado", "Segurança", ["cryptography", "FastAPI"]],
  ["Auditoria de acessos de {d}", "avancado", "Segurança", ["FastAPI", "PostgreSQL"]],
  ["Simulação de Monte Carlo de {d}", "avancado", "Computação Científica", ["NumPy", "SciPy"]],
  ["Otimizador (programação linear) de {d}", "desafio", "Computação Científica", ["PuLP", "SciPy"]],
  ["Calculadora científica de {d}", "intermediario", "Computação Científica", ["SymPy", "NumPy"]],
];

const DOMAINS = [
  "tarefas", "finanças pessoais", "estoque", "vendas", "biblioteca", "clínica",
  "escola", "restaurante", "academia", "imobiliária", "eventos", "viagens",
  "receitas", "hábitos", "estudos", "frota de veículos", "clima", "criptomoedas",
  "ações da bolsa", "notícias", "vagas de emprego", "produtos", "pedidos", "usuários",
  "pacientes", "agendamentos", "logística", "RH", "tickets de suporte", "blog",
  "fórum", "rede social", "delivery", "marketplace", "investimentos", "energia",
  "transporte", "fornecedores", "contratos", "faturas", "leads", "campanhas",
  "doações", "voluntários", "sensores IoT", "rotas de entrega", "playlists",
  "filmes", "avaliações", "safras", "lotes", "processos jurídicos", "consultas",
  "reservas de hotel", "passagens aéreas", "assinaturas", "cupons", "indicações",
  "matrículas", "turmas", "boletins", "frequência", "cardápios", "comandas",
  "equipamentos", "manutenções", "ordens de serviço",
];

const REQ = {
  basico: ["Implemente a funcionalidade principal de forma clara e legível.", "Trate entradas inválidas e casos de borda.", "Inclua um exemplo de uso no README."],
  intermediario: ["Modele o domínio com boas práticas e separação de responsabilidades.", "Adicione validação e tratamento central de erros.", "Escreva testes automatizados (pytest).", "Documente a instalação e o uso."],
  avancado: ["Estruture em camadas (domínio, serviço, infraestrutura).", "Adicione testes com boa cobertura.", "Inclua logging estruturado e tratamento de falhas.", "Containerize a aplicação com Docker."],
  desafio: ["Arquitetura escalável, desacoplada e testável.", "Testes, CI/CD e observabilidade (logs, métricas).", "Deploy reproduzível com estratégia de rollback.", "Documente decisões técnicas (ADRs) no README."],
};
const STEPS = {
  basico: ["Planeje o escopo e a estrutura de pastas.", "Implemente o núcleo da solução.", "Adicione tratamento de erros e um exemplo.", "Escreva o README e finalize."],
  intermediario: ["Defina o domínio e a estrutura do projeto.", "Implemente as funcionalidades principais.", "Adicione validação, erros e testes.", "Documente e empacote/execute."],
  avancado: ["Modele em camadas e defina contratos.", "Implemente serviços e persistência.", "Adicione testes, logging e configuração por ambiente.", "Containerize com Docker e documente.", "Adicione CI e prepare o deploy."],
  desafio: ["Desenhe a arquitetura e as fronteiras.", "Implemente o núcleo e as integrações.", "Adicione testes, observabilidade e segurança.", "Configure CI/CD e deploy reproduzível.", "Documente decisões e meça resultados."],
};

const out = [];
for (const [pattern, difficulty, area, technologies] of ARCH) {
  for (const d of DOMAINS) {
    const title = cap(pattern.replace("{d}", d));
    out.push({
      title,
      description: `Projeto de ${area.toLowerCase()} no domínio de ${d}. Use ${technologies.join(", ")} para construir uma solução real, com boas práticas, testes e documentação.`,
      difficulty,
      area,
      technologies,
      requirements: REQ[difficulty],
      steps: STEPS[difficulty],
      github_url: null,
      status: "nao_iniciado",
    });
  }
}

console.log(`Gerados ${out.length} projetos novos. Inserindo...`);
let inserted = 0;
for (let i = 0; i < out.length; i += 200) {
  const batch = out.slice(i, i + 200);
  const res = await fetch(`${SUPA}/rest/v1/projects`, {
    method: "POST", headers: { ...HEADERS, Prefer: "return=minimal" }, body: JSON.stringify(batch),
  });
  if (!res.ok) { console.error("Erro:", res.status, (await res.text()).slice(0, 300)); break; }
  inserted += batch.length;
  if (inserted % 1000 === 0 || inserted === out.length) console.log(`  ${inserted}/${out.length}`);
}
console.log(`✅ Inserido: ${inserted}`);
