/**
 * Gera 1000+ projetos cruzando arquétipos (tipos de projeto) com domínios,
 * somados aos 106 curados de projects_expansion.json. Saída: projects_mega.json
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

// [padrão com {d}, dificuldade, area, [techs]]
const ARCH = [
  ["API REST de {d}", "intermediario", "Backend", ["FastAPI", "SQLAlchemy", "PostgreSQL"]],
  ["API GraphQL de {d}", "avancado", "Backend", ["Strawberry", "FastAPI"]],
  ["CRUD de {d} com Django", "intermediario", "Backend", ["Django", "DRF"]],
  ["Microsserviço de {d}", "avancado", "Backend", ["FastAPI", "Docker"]],
  ["Sistema full-stack de {d}", "desafio", "Engenharia de Software", ["FastAPI", "PostgreSQL", "Docker"]],
  ["Dashboard de {d}", "intermediario", "Data Science", ["Streamlit", "Plotly", "Pandas"]],
  ["Análise exploratória de {d}", "intermediario", "Data Science", ["Pandas", "Seaborn"]],
  ["App de dados de {d} com Streamlit", "basico", "Data Science", ["Streamlit", "Pandas"]],
  ["Pipeline ETL de {d}", "avancado", "Engenharia de Dados", ["Polars", "DuckDB", "Parquet"]],
  ["Pipeline orquestrado de {d}", "desafio", "Engenharia de Dados", ["Airflow", "Pandas"]],
  ["Modelo de ML para {d}", "avancado", "Machine Learning", ["scikit-learn", "Pandas"]],
  ["Previsão (forecast) de {d}", "avancado", "Data Science", ["statsmodels", "Pandas"]],
  ["Recomendador de {d}", "avancado", "Machine Learning", ["scikit-learn"]],
  ["Classificador de {d} com NLP", "avancado", "Machine Learning", ["Transformers", "spaCy"]],
  ["Bot de {d} no Telegram", "intermediario", "Automação", ["python-telegram-bot"]],
  ["Web scraper de {d}", "intermediario", "Automação", ["httpx", "BeautifulSoup"]],
  ["Crawler de {d} com Scrapy", "avancado", "Automação", ["Scrapy", "PostgreSQL"]],
  ["CLI de {d}", "basico", "Automação", ["Typer", "Rich"]],
  ["Automação de relatórios de {d}", "intermediario", "Automação", ["openpyxl", "Pandas"]],
  ["Monitor de {d}", "intermediario", "Automação", ["httpx", "APScheduler"]],
  ["Gerador de PDF de {d}", "intermediario", "Automação", ["reportlab", "Jinja2"]],
  ["Importador CSV/Excel de {d}", "basico", "Automação", ["Pandas", "openpyxl"]],
  ["Cache e busca de {d} com Redis", "intermediario", "Banco de Dados", ["Redis", "FastAPI"]],
  ["Modelagem de banco de {d}", "intermediario", "Banco de Dados", ["PostgreSQL", "Alembic"]],
  ["Notificações de {d}", "avancado", "Backend", ["FastAPI", "Celery", "RabbitMQ"]],
  ["Fila de processamento de {d}", "avancado", "Backend", ["Celery", "Redis"]],
  ["Chat de {d} em tempo real", "avancado", "Backend", ["FastAPI", "WebSockets"]],
  ["Autenticação para app de {d}", "avancado", "Segurança", ["FastAPI", "JWT"]],
  ["Painel de métricas de {d}", "intermediario", "Data Science", ["Plotly", "Pandas"]],
  ["Testes automatizados para sistema de {d}", "intermediario", "Qualidade", ["pytest"]],
  ["Deploy em containers de app de {d}", "avancado", "DevOps", ["Docker", "Docker Compose"]],
  ["CI/CD para projeto de {d}", "avancado", "DevOps", ["GitHub Actions", "Docker"]],
  ["Data app de {d} com DuckDB", "intermediario", "Engenharia de Dados", ["DuckDB", "Polars"]],
  ["Streaming de eventos de {d}", "desafio", "Engenharia de Dados", ["Kafka", "FastAPI"]],
];

const DOMAINS = [
  "tarefas", "finanças pessoais", "estoque", "vendas", "biblioteca", "clínica",
  "escola", "restaurante", "academia", "imobiliária", "eventos", "viagens",
  "receitas culinárias", "hábitos", "estudos e notas", "frota de veículos",
  "clima", "criptomoedas", "ações da bolsa", "notícias", "vagas de emprego",
  "produtos", "pedidos", "usuários", "pacientes", "agendamentos", "logística",
  "recursos humanos", "tickets de suporte", "blog", "fórum", "rede social",
  "delivery", "marketplace", "investimentos", "energia", "transporte público",
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

// 1) reaproveita os 106 curados
const curatedPath = join(ROOT, "supabase", "projects_expansion.json");
if (existsSync(curatedPath)) {
  out.push(...JSON.parse(readFileSync(curatedPath, "utf8")));
}

// 2) gera por arquétipo × domínio
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
for (const [pattern, difficulty, area, technologies] of ARCH) {
  for (const d of DOMAINS) {
    const title = pattern.replace("{d}", d);
    out.push({
      title: cap(title),
      description: `Projeto de ${area.toLowerCase()} no domínio de ${d}. Aplique ${technologies.join(", ")} para construir uma solução real, com boas práticas e testes.`,
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

writeFileSync(join(ROOT, "supabase", "projects_mega.json"), JSON.stringify(out));
const byD = {};
const byA = {};
for (const p of out) {
  byD[p.difficulty] = (byD[p.difficulty] || 0) + 1;
  byA[p.area] = (byA[p.area] || 0) + 1;
}
console.log(`Total projetos: ${out.length}`);
console.log("Por dificuldade:", byD);
console.log("Áreas:", Object.keys(byA).length);
