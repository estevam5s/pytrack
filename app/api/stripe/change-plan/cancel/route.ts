import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSubscription } from "@/lib/stripe/subscriptions";
import { billingEnabled } from "@/lib/stripe/server";
import { cancelScheduledChange } from "@/lib/stripe/change-plan";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Cancela um downgrade agendado e mantém o plano atual. */
export async function POST() {
  try {
    if (!billingEnabled) {
      return NextResponse.json({ error: "Pagamentos não configurados." }, { status: 503 });
    }
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const sub = await getUserSubscription(user.id);
    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: "Sem assinatura ativa." }, { status: 409 });
    }
    await cancelScheduledChange(user.id, sub.stripe_subscription_id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    await logError("stripe.cancel_scheduled_change", e);
    const msg = e instanceof Error ? e.message : "Erro ao cancelar a troca.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
