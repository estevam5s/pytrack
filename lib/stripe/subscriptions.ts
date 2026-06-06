import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { billingEnabled } from "@/lib/stripe/server";

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

const BLOCKED = ["unpaid", "incomplete_expired"];

/** Regra de acesso ao dashboard. */
export function hasDashboardAccess(sub: SubscriptionRow | null): boolean {
  if (!sub) return false;
  if (sub.status === "active" || sub.status === "trialing") return true;
  if (BLOCKED.includes(sub.status)) return false;
  // mantém acesso até o fim do período pago (mesmo cancelado no fim do ciclo)
  if (sub.current_period_end && new Date(sub.current_period_end) > new Date()) {
    return true;
  }
  return false;
}

export async function getUserSubscription(
  userId: string,
): Promise<SubscriptionRow | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return (data as SubscriptionRow) ?? null;
  } catch (e) {
    console.error("[billing] getUserSubscription falhou:", e);
    return null;
  }
}

export async function getStripeCustomerId(
  userId: string,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.stripe_customer_id ?? null;
}

/** Acesso liberado se billing desativado (fail-open) ou assinatura válida.
 *  Nunca lança — em caso de erro inesperado, libera (fail-open) para não
 *  derrubar o dashboard de um usuário que pagou. */
export async function userHasAccess(userId: string): Promise<boolean> {
  try {
    if (!billingEnabled) return true;
    const sub = await getUserSubscription(userId);
    return hasDashboardAccess(sub);
  } catch (e) {
    console.error("[billing] userHasAccess falhou (liberando):", e);
    return true;
  }
}
