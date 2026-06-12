import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSubscription } from "@/lib/stripe/subscriptions";
import { priceForPlan, billingEnabled } from "@/lib/stripe/server";
import { previewProration } from "@/lib/stripe/change-plan";
import { TIER_BY_PRICE, TIER_RANK, type Tier } from "@/lib/billing-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Prévia do cálculo: quanto cobra agora (upgrade) ou quando passa a valer (downgrade). */
export async function POST(req: Request) {
  try {
    if (!billingEnabled) {
      return NextResponse.json({ error: "Pagamentos não configurados." }, { status: 503 });
    }
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    let plan = "";
    try {
      const body = await req.json();
      plan = typeof body?.plan === "string" ? body.plan : "";
    } catch {
      /* sem body */
    }
    const newPriceId = priceForPlan(plan);
    if (!plan || !newPriceId) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const sub = await getUserSubscription(user.id);
    if (!sub?.stripe_subscription_id || !sub.stripe_price_id) {
      return NextResponse.json({ error: "Sem assinatura ativa." }, { status: 409 });
    }

    const currentTier: Tier = TIER_BY_PRICE[sub.stripe_price_id] ?? "essencial";
    const newTier: Tier = TIER_BY_PRICE[newPriceId] ?? "essencial";
    const isUpgrade = TIER_RANK[newTier] > TIER_RANK[currentTier];

    if (isUpgrade) {
      const cents = await previewProration(sub.stripe_subscription_id, newPriceId);
      return NextResponse.json({
        kind: "upgrade",
        chargedNowCents: typeof cents === "number" ? Math.max(0, cents) : null,
      });
    }
    return NextResponse.json({
      kind: "downgrade",
      effectiveAt: sub.current_period_end,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao calcular.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
