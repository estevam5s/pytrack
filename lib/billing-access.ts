// Lógica de acesso (pura, sem server-only) — usada por middleware e servidor.

export interface AccessSubscription {
  status: string;
  current_period_end: string | null;
  stripe_price_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type Tier = "free" | "essencial" | "completo" | "suprema" | "vitalicio";

export const TIER_LABEL: Record<Tier, string> = {
  free: "Gratuito",
  essencial: "Essencial",
  completo: "Completo",
  suprema: "Suprema",
  vitalicio: "Vitalício",
};

export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  essencial: 1,
  completo: 2,
  suprema: 3,
  vitalicio: 4,
};

// Mapa price_id -> tier (price IDs não são segredos).
export const TIER_BY_PRICE: Record<string, Tier> = {
  price_1TfPAnCB6Dz1wPei2nOAIofK: "essencial", // R$10/mês
  price_1TfQ0ACB6Dz1wPei7hdTfaQS: "essencial", // R$96/ano
  price_1TfQedCB6Dz1wPeiXWheSFrk: "completo", // R$19/mês
  price_1TfQeeCB6Dz1wPeiv5tsuwdx: "completo", // R$182/ano
  price_1TfUEdCB6Dz1wPeiyag2DQIn: "suprema", // R$46/mês
  price_1TfUEeCB6Dz1wPeiNGrINbKd: "suprema", // R$442/ano
  price_1TfV9dCB6Dz1wPeibUtTjFbZ: "vitalicio", // R$697 vitalício (one-time)
};

/** Descobre o tier de uma assinatura. */
export function tierOf(sub: AccessSubscription | null): Tier {
  if (!sub) return "free";
  const meta = (sub.metadata ?? {}) as Record<string, unknown>;
  if (meta.lifetime) return "vitalicio";
  if (meta.comp) return "suprema";
  const t = sub.stripe_price_id ? TIER_BY_PRICE[sub.stripe_price_id] : undefined;
  return t ?? "essencial";
}

export function tierAtLeast(userTier: Tier, required: Tier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

// Rotas do dashboard que exigem pelo menos o plano Completo.
const COMPLETO_ONLY = [
  "/comunidade",
  "/noticias-python",
  "/curriculo",
  "/entrevista-ia",
  "/meus-projetos",
  "/especializacoes",
  "/consultor-ia",
  "/minha-carreira",
  "/vagas",
  "/perguntas-carreira-python",
  "/planejamento",
  "/plano-carreira",
];

export function requiresCompleto(pathname: string): boolean {
  return COMPLETO_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Rotas que exigem o plano Suprema.
const SUPREMA_ONLY = ["/construir-saas"];
export function requiresSuprema(pathname: string): boolean {
  return SUPREMA_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** Tier mínimo necessário para acessar uma rota do dashboard. */
export function requiredTierForPath(pathname: string): Tier {
  if (isFreeDashboardPath(pathname)) return "free";
  if (requiresSuprema(pathname)) return "suprema";
  if (requiresCompleto(pathname)) return "completo";
  return "essencial";
}

const BLOCKED = ["unpaid", "incomplete_expired"];

export function hasDashboardAccess(sub: AccessSubscription | null): boolean {
  if (!sub) return false;
  if (sub.status === "active" || sub.status === "trialing") return true;
  if (BLOCKED.includes(sub.status)) return false;
  if (sub.current_period_end && new Date(sub.current_period_end) > new Date()) {
    return true;
  }
  return false;
}

/** Módulo de conteúdo liberado no plano gratuito (freemium). */
export const FREE_MODULE_SLUG = "parte-1-basico";

/** Rotas do dashboard acessíveis no plano gratuito (sem assinatura). */
export function isFreeDashboardPath(pathname: string): boolean {
  if (pathname === "/assinar") return true; // página de assinatura (evita loop)
  if (pathname === "/suporte") return true; // canal de suporte sempre acessível
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true; // gating de admin é na própria página
  if (pathname === "/inicio") return true; // hub com upsell
  if (pathname === "/onboarding") return true; // escolha de objetivo pós-cadastro
  if (pathname === "/novidades") return true; // changelog/roadmap (livre)
  if (pathname === "/roadmaps" || pathname.startsWith("/roadmaps/")) return true; // roadmaps de carreira (grátis)
  if (pathname === "/anotacoes") return true; // anotações (grátis)
  if (pathname === "/notificacoes") return true; // notificações (livre)
  if (pathname === "/extensao") return true; // página da extensão (gating Suprema interno)
  if (pathname === "/minhas-trilhas" || pathname.startsWith("/minhas-trilhas/"))
    return true; // navegar/escolher trilhas é livre (módulos é que travam)
  if (pathname === "/aplicativo") return true; // qualquer um acessa (download é que trava)
  if (pathname === "/ide" || pathname.startsWith("/ide/")) return true; // IDE grátis
  if (pathname === "/conteudos") return true; // catálogo
  if (pathname.startsWith(`/conteudos/${FREE_MODULE_SLUG}`)) return true; // 1º módulo
  if (pathname === "/perfil" || pathname.startsWith("/perfil/")) return true;
  if (pathname === "/configuracoes" || pathname.startsWith("/configuracoes/"))
    return true; // para gerenciar/assinar/indicar
  return false;
}
