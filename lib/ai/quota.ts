import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserTier } from "@/lib/stripe/subscriptions";
import type { Tier } from "@/lib/billing-access";

// limite diário de chamadas de IA por plano (proteção de custo/abuso).
// Quem usa a própria chave (BYOK) não tem limite.
const DAILY_LIMIT: Record<Tier, number> = {
  free: 15,
  essencial: 80,
  completo: 200,
  suprema: 500,
  vitalicio: 500,
};

export interface QuotaResult {
  allowed: boolean;
  used: number;
  limit: number;
}

/** Consome 1 uso de IA do usuário do dia. byok=true ignora a quota. */
export async function consumeAiQuota(byok: boolean): Promise<QuotaResult> {
  if (byok) return { allowed: true, used: 0, limit: Infinity };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { allowed: true, used: 0, limit: Infinity };

    const tier = await getUserTier(user.id);
    const limit = DAILY_LIMIT[tier] ?? DAILY_LIMIT.free;

    const admin = createAdminClient();
    const { data: used } = await admin.rpc("ai_hit", { p_user: user.id });
    const count = (used as number) ?? 0;
    return { allowed: count <= limit, used: count, limit };
  } catch {
    // fail-open: não bloqueia o produto se a checagem falhar
    return { allowed: true, used: 0, limit: Infinity };
  }
}
