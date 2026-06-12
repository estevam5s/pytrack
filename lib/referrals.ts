import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Concede a recompensa de indicação ao indicador quando o indicado confirma
 * a conta. "1 mês grátis": crédito na fatura (Stripe) se já for cliente, e/ou
 * um mês de acesso Completo de cortesia. Idempotente (reward_granted).
 */
export async function grantReferralReward(referredUserId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: ref } = await admin
      .from("referrals")
      .select("id, referrer_user_id, reward_granted, status")
      .eq("referred_user_id", referredUserId)
      .eq("reward_granted", false)
      .maybeSingle();
    if (!ref) return;

    await admin.from("referrals").update({ status: "converted", converted_at: new Date().toISOString() }).eq("id", ref.id);

    const referrerId = ref.referrer_user_id as string;

    // 1) crédito Stripe (1 mês ~ R$10) se o indicador já é cliente
    let credited = false;
    try {
      const { data: cust } = await admin.from("stripe_customers").select("stripe_customer_id").eq("user_id", referrerId).maybeSingle();
      if (cust?.stripe_customer_id) {
        const { requireStripe } = await import("@/lib/stripe/server");
        const stripe = requireStripe();
        await stripe.customers.createBalanceTransaction(cust.stripe_customer_id as string, {
          amount: -1000, currency: "brl", description: "Recompensa por indicação — 1 mês grátis",
        });
        credited = true;
      }
    } catch { /* segue para a cortesia */ }

    // 2) se não for cliente Stripe, concede 1 mês de cortesia (Completo) estendendo/criando assinatura
    if (!credited) {
      const { data: sub } = await admin.from("subscriptions").select("id, current_period_end, status, metadata").eq("user_id", referrerId).maybeSingle();
      const now = Date.now();
      const base = sub?.current_period_end && new Date(sub.current_period_end as string).getTime() > now
        ? new Date(sub.current_period_end as string).getTime() : now;
      const newEnd = new Date(base + 30 * 86400000).toISOString();
      const meta = { ...(sub?.metadata as Record<string, unknown> ?? {}), referral_reward: true, tier: "completo" };
      if (sub) {
        await admin.from("subscriptions").update({ status: "active", current_period_end: newEnd, metadata: meta }).eq("id", sub.id);
      } else {
        await admin.from("subscriptions").insert({ user_id: referrerId, status: "active", current_period_end: newEnd, metadata: meta });
      }
    }

    await admin.from("referrals").update({ reward_granted: true }).eq("id", ref.id);

    // notifica o indicador
    await admin.from("notifications").insert({
      user_id: referrerId, type: "success",
      title: "🎁 Você ganhou 1 mês grátis!",
      body: "Sua indicação confirmou a conta na PyTrack. Aproveite a recompensa!",
      link: "/configuracoes/indicacoes", is_read: false,
    });
  } catch (e) {
    console.error("[referral] grant falhou:", e);
  }
}
