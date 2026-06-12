import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSubscription } from "@/lib/stripe/subscriptions";
import { priceForPlan, billingEnabled } from "@/lib/stripe/server";
import { applyPlanChange } from "@/lib/stripe/change-plan";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (!billingEnabled) {
      return NextResponse.json(
        { error: "Pagamentos não configurados." },
        { status: 503 },
      );
    }
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

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
    if (
      !sub?.stripe_subscription_id ||
      !["active", "trialing", "past_due"].includes(sub.status)
    ) {
      return NextResponse.json(
        { error: "Você não tem uma assinatura recorrente ativa para trocar." },
        { status: 409 },
      );
    }
    // vitalício/cortesia não trocam por aqui
    const meta = (sub.metadata ?? {}) as Record<string, unknown>;
    if (meta.lifetime || meta.comp) {
      return NextResponse.json(
        { error: "Seu plano atual não permite troca por aqui." },
        { status: 409 },
      );
    }

    const result = await applyPlanChange(
      user.id,
      sub.stripe_subscription_id,
      newPriceId,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    await logError("stripe.change_plan", e);
    const msg = e instanceof Error ? e.message : "Erro ao trocar de plano.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
