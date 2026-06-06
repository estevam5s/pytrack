// Lógica de acesso (pura, sem server-only) — usada por middleware e servidor.

export interface AccessSubscription {
  status: string;
  current_period_end: string | null;
  stripe_price_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type Tier = "free" | "essencial" | "completo";

// Mapa price_id -> tier (price IDs não são segredos).
export const TIER_BY_PRICE: Record<string, Tier> = {
  price_1TfPAnCB6Dz1wPei2nOAIofK: "essencial", // R$10/mês
  price_1TfQ0ACB6Dz1wPei7hdTfaQS: "essencial", // R$96/ano
  price_1TfQedCB6Dz1wPeiXWheSFrk: "completo", // R$19/mês
  price_1TfQeeCB6Dz1wPeiv5tsuwdx: "completo", // R$182/ano
};

/** Descobre o tier de uma assinatura. */
export function tierOf(sub: AccessSubscription | null): Tier {
  if (!sub) return "free";
  if (sub.metadata && (sub.metadata as Record<string, unknown>).comp) return "completo";
  const t = sub.stripe_price_id ? TIER_BY_PRICE[sub.stripe_price_id] : undefined;
  return t ?? "essencial";
}

// Rotas do dashboard que exigem o plano Completo.
const COMPLETO_ONLY = [
  "/comunidade",
  "/meus-projetos",
  "/especializacoes",
  "/consultor-ia",
  "/minha-carreira",
  "/vagas",
  "/perguntas-carreira-python",
];

export function requiresCompleto(pathname: string): boolean {
  return COMPLETO_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"));
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
  if (pathname === "/inicio") return true; // hub com upsell
  if (pathname === "/ide" || pathname.startsWith("/ide/")) return true; // IDE grátis
  if (pathname === "/conteudos") return true; // catálogo
  if (pathname.startsWith(`/conteudos/${FREE_MODULE_SLUG}`)) return true; // 1º módulo
  if (pathname === "/perfil" || pathname.startsWith("/perfil/")) return true;
  if (pathname === "/configuracoes" || pathname.startsWith("/configuracoes/"))
    return true; // para gerenciar/assinar/indicar
  return false;
}
