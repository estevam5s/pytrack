// Catálogo de stacks + geração de roadmap para o "Construa seu SaaS".

export interface StackOption { id: string; label: string; desc: string; logo?: string }
export interface StackChoice {
  backend?: string; frontend?: string; database?: string; auth?: string;
  payments?: string; deploy?: string; ai?: string;
}

export const STACK_GROUPS: { key: keyof StackChoice; title: string; options: StackOption[] }[] = [
  { key: "backend", title: "Backend (Python)", options: [
    { id: "fastapi", label: "FastAPI", desc: "APIs assíncronas, rápido e moderno (recomendado)" },
    { id: "django", label: "Django + DRF", desc: "Baterias inclusas, admin e ORM robusto" },
    { id: "flask", label: "Flask", desc: "Minimalista e flexível" },
    { id: "litestar", label: "Litestar", desc: "Alto desempenho, type-safe" },
  ] },
  { key: "frontend", title: "Frontend", options: [
    { id: "nextjs", label: "Next.js", desc: "React + SSR, o padrão para SaaS" },
    { id: "react", label: "React (Vite)", desc: "SPA leve" },
    { id: "htmx", label: "HTMX + Jinja", desc: "Sem JS pesado, servido pelo Python" },
    { id: "streamlit", label: "Streamlit", desc: "Para SaaS data/IA, rápido de prototipar" },
  ] },
  { key: "database", title: "Banco de Dados", options: [
    { id: "postgres", label: "PostgreSQL", desc: "Relacional robusto (recomendado)" },
    { id: "supabase", label: "Supabase", desc: "Postgres + Auth + Storage gerenciado" },
    { id: "sqlite", label: "SQLite", desc: "Simples, ótimo para começar" },
    { id: "mongo", label: "MongoDB", desc: "NoSQL flexível" },
  ] },
  { key: "auth", title: "Autenticação", options: [
    { id: "jwt", label: "JWT próprio", desc: "Controle total com FastAPI/Django" },
    { id: "supabase-auth", label: "Supabase Auth", desc: "Pronto: e-mail, OAuth, magic link" },
    { id: "clerk", label: "Clerk/Auth0", desc: "Identidade gerenciada" },
  ] },
  { key: "payments", title: "Pagamentos", options: [
    { id: "stripe", label: "Stripe", desc: "Assinaturas globais (recomendado)" },
    { id: "mercadopago", label: "Mercado Pago", desc: "Pix e cartões no Brasil" },
    { id: "none", label: "Sem pagamentos", desc: "Adicionar depois" },
  ] },
  { key: "deploy", title: "Deploy / Infra", options: [
    { id: "docker-vps", label: "Docker + VPS", desc: "Controle total (Hetzner, DigitalOcean)" },
    { id: "railway", label: "Railway/Render", desc: "Deploy simples do Python" },
    { id: "vercel-fly", label: "Vercel + Fly.io", desc: "Front na Vercel, API no Fly" },
    { id: "aws", label: "AWS (ECS/Lambda)", desc: "Escala enterprise" },
  ] },
  { key: "ai", title: "Camada de IA (opcional)", options: [
    { id: "none", label: "Sem IA", desc: "SaaS tradicional" },
    { id: "openai", label: "OpenAI/Anthropic", desc: "LLM via API" },
    { id: "rag", label: "RAG (embeddings + pgvector)", desc: "Busca semântica nos seus dados" },
    { id: "agents", label: "Agentes", desc: "Workflows autônomos com ferramentas" },
  ] },
];

export interface RoadmapPhase { id: string; title: string; emoji: string; steps: { id: string; label: string }[] }

// Gera o roadmap adaptado às escolhas do usuário.
export function buildRoadmap(stack: StackChoice): RoadmapPhase[] {
  const be = stack.backend ?? "fastapi";
  const fe = stack.frontend ?? "nextjs";
  const db = stack.database ?? "postgres";
  const beLabel = optLabel("backend", be);
  const feLabel = optLabel("frontend", fe);
  const dbLabel = optLabel("database", db);

  const phases: RoadmapPhase[] = [
    { id: "setup", title: "1. Fundação", emoji: "🏗️", steps: [
      { id: "repo", label: "Criar repositório Git + estrutura de pastas" },
      { id: "venv", label: `Ambiente Python (venv/poetry/uv) + ${beLabel}` },
      { id: "env", label: "Variáveis de ambiente (.env) e configurações" },
      { id: "lint", label: "Ruff + mypy + pre-commit (qualidade desde o dia 1)" },
    ] },
    { id: "data", title: "2. Dados & Modelos", emoji: "🗄️", steps: [
      { id: "db", label: `Configurar ${dbLabel}` },
      { id: "models", label: "Modelar entidades (SQLAlchemy/SQLModel ou ORM do Django)" },
      { id: "migrations", label: "Migrations (Alembic / Django migrate)" },
      { id: "seed", label: "Dados de exemplo (seed)" },
    ] },
    { id: "auth", title: "3. Autenticação & Usuários", emoji: "🔐", steps: [
      { id: "signup", label: `Cadastro/login (${optLabel("auth", stack.auth ?? "jwt")})` },
      { id: "rbac", label: "Perfis e permissões (RBAC)" },
      { id: "multitenant", label: "Multi-tenant / organizações (se aplicável)" },
    ] },
    { id: "core", title: "4. Núcleo do produto", emoji: "⚙️", steps: [
      { id: "api", label: `Endpoints REST/GraphQL no ${beLabel}` },
      { id: "validation", label: "Validação com Pydantic / serializers" },
      { id: "tests", label: "Testes (pytest) das regras de negócio" },
      { id: "jobs", label: "Tarefas em background (Celery/RQ/async)" },
    ] },
    { id: "frontend", title: "5. Interface", emoji: "🎨", steps: [
      { id: "ui", label: `App ${feLabel} + design system` },
      { id: "dashboard", label: "Dashboard do usuário" },
      { id: "states", label: "Loading, erros e estados vazios" },
    ] },
  ];

  if ((stack.payments ?? "stripe") !== "none") {
    phases.push({ id: "billing", title: "6. Monetização", emoji: "💳", steps: [
      { id: "plans", label: `Planos e checkout (${optLabel("payments", stack.payments ?? "stripe")})` },
      { id: "webhook", label: "Webhook de pagamento + gating por plano" },
      { id: "portal", label: "Portal do cliente (gerenciar assinatura)" },
    ] });
  }

  if ((stack.ai ?? "none") !== "none") {
    phases.push({ id: "ai", title: "7. Inteligência (IA)", emoji: "🤖", steps: [
      { id: "ai-int", label: `Integração ${optLabel("ai", stack.ai!)}` },
      { id: "prompt", label: "Prompts, limites de uso e custos" },
      ...(stack.ai === "rag" ? [{ id: "vectors", label: "Embeddings + pgvector + busca semântica" }] : []),
    ] });
  }

  phases.push(
    { id: "quality", title: "Qualidade & Segurança", emoji: "🛡️", steps: [
      { id: "rls", label: "RLS / autorização em todas as rotas" },
      { id: "ratelimit", label: "Rate limiting + headers de segurança (CSP, HSTS)" },
      { id: "ci", label: "CI (testes + lint) no GitHub Actions" },
      { id: "obs", label: "Logs, métricas e Sentry" },
    ] },
    { id: "launch", title: "Deploy & Lançamento", emoji: "🚀", steps: [
      { id: "deploy", label: `Deploy (${optLabel("deploy", stack.deploy ?? "railway")})` },
      { id: "domain", label: "Domínio + HTTPS" },
      { id: "landing", label: "Landing page + SEO + analytics" },
      { id: "launch", label: "Beta com primeiros usuários e feedback" },
    ] },
  );

  return phases;
}

export function optLabel(group: keyof StackChoice, id: string): string {
  return STACK_GROUPS.find((g) => g.key === group)?.options.find((o) => o.id === id)?.label ?? id;
}

export function totalSteps(phases: RoadmapPhase[]): number {
  return phases.reduce((s, p) => s + p.steps.length, 0);
}
