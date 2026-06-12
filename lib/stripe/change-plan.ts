import "server-only";
import type Stripe from "stripe";
import { requireStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TIER_BY_PRICE, TIER_RANK, type Tier } from "@/lib/billing-access";

export type ChangeKind = "same" | "upgrade" | "downgrade";

export interface ChangeResult {
  kind: ChangeKind;
  /** quando a troca passa a valer (ISO). imediato no upgrade, fim do período no downgrade */
  effectiveAt: string | null;
  /** valor cobrado agora, em centavos (só upgrade com proração) */
  chargedNowCents?: number;
}

function tierForPrice(priceId: string): Tier {
  return TIER_BY_PRICE[priceId] ?? "essencial";
}

/**
 * Pré-visualiza quanto o usuário pagaria AGORA ao trocar para `newPriceId`
 * (diferença proporcional). Usado para mostrar o cálculo antes de confirmar.
 * Nunca lança — retorna null se não der para prever.
 */
export async function previewProration(
  subId: string,
  newPriceId: string,
): Promise<number | null> {
  const stripe = requireStripe();
  try {
    const sub = await stripe.subscriptions.retrieve(subId);
    const item = sub.items.data[0];
    if (!item) return null;
    // invoice "upcoming" simulando a troca imediata do item (Stripe 22: createPreview)
    const preview = await stripe.invoices.createPreview({
      customer:
        typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      subscription: subId,
      subscription_details: {
        items: [{ id: item.id, price: newPriceId }],
        proration_behavior: "create_prorations",
      },
    });
    return preview.amount_due ?? null;
  } catch {
    return null;
  }
}

/**
 * Aplica a troca de plano de forma "funcional":
 *  - UPGRADE  → imediato, cobrando a diferença proporcional (create_prorations).
 *  - DOWNGRADE→ agendado para o fim do período já pago (Subscription Schedule).
 *               O usuário mantém o plano atual até lá; a próxima fatura já é o
 *               plano novo (menor). Sem cobrança/crédito imediato.
 * Mantém as colunas pending_* da tabela em dia para a UI mostrar o status.
 */
export async function applyPlanChange(
  userId: string,
  subId: string,
  newPriceId: string,
): Promise<ChangeResult> {
  const stripe = requireStripe();
  const admin = createAdminClient();

  const sub = await stripe.subscriptions.retrieve(subId);
  const item = sub.items.data[0];
  const currentPriceId = item?.price?.id ?? null;

  if (!item || !currentPriceId) {
    throw new Error("Assinatura sem item de preço — não é possível trocar.");
  }
  if (currentPriceId === newPriceId) {
    return { kind: "same", effectiveAt: null };
  }

  const currentTier = tierForPrice(currentPriceId);
  const newTier = tierForPrice(newPriceId);
  const isUpgrade = TIER_RANK[newTier] > TIER_RANK[currentTier];

  // Sempre limpa um agendamento anterior antes de aplicar uma nova decisão.
  await releaseSchedule(stripe, sub);

  if (isUpgrade) {
    // imediato + proração (cobra a diferença agora)
    let chargedNowCents: number | undefined;
    try {
      const cents = await previewProration(subId, newPriceId);
      if (typeof cents === "number") chargedNowCents = Math.max(0, cents);
    } catch {
      /* preview é best-effort */
    }
    await stripe.subscriptions.update(subId, {
      items: [{ id: item.id, price: newPriceId }],
      proration_behavior: "create_prorations",
      cancel_at_period_end: false,
    });
    await admin
      .from("subscriptions")
      .update({
        pending_price_id: null,
        pending_tier: null,
        pending_effective_at: null,
        stripe_schedule_id: null,
      })
      .eq("user_id", userId);
    return {
      kind: "upgrade",
      effectiveAt: new Date().toISOString(),
      chargedNowCents,
    };
  }

  // DOWNGRADE → agenda para o fim do período via Subscription Schedule
  const periodEnd =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    item.current_period_end;

  const schedule = await stripe.subscriptionSchedules.create({
    from_subscription: subId,
  });
  const phase0 = schedule.phases[0];

  await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "release",
    proration_behavior: "none",
    phases: [
      {
        items: [{ price: currentPriceId, quantity: 1 }],
        start_date: phase0.start_date,
        end_date: phase0.end_date,
      },
      {
        items: [{ price: newPriceId, quantity: 1 }],
      },
    ],
  });

  const effectiveAt = periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : phase0.end_date
      ? new Date(phase0.end_date * 1000).toISOString()
      : null;

  await admin
    .from("subscriptions")
    .update({
      pending_price_id: newPriceId,
      pending_tier: newTier,
      pending_effective_at: effectiveAt,
      stripe_schedule_id: schedule.id,
    })
    .eq("user_id", userId);

  return { kind: "downgrade", effectiveAt };
}

/** Cancela um downgrade agendado: solta o schedule e mantém o plano atual. */
export async function cancelScheduledChange(
  userId: string,
  subId: string,
): Promise<void> {
  const stripe = requireStripe();
  const admin = createAdminClient();
  const sub = await stripe.subscriptions.retrieve(subId);
  await releaseSchedule(stripe, sub);
  await admin
    .from("subscriptions")
    .update({
      pending_price_id: null,
      pending_tier: null,
      pending_effective_at: null,
      stripe_schedule_id: null,
    })
    .eq("user_id", userId);
}

/** Solta qualquer schedule preso à assinatura (no-op se não houver). */
async function releaseSchedule(stripe: Stripe, sub: Stripe.Subscription) {
  const scheduleId =
    typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;
  if (!scheduleId) return;
  try {
    await stripe.subscriptionSchedules.release(scheduleId);
  } catch {
    /* já liberado/cancelado */
  }
}
