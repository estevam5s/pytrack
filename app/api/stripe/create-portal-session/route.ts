import { NextResponse } from "next/server";
import { requireStripe, APP_URL } from "@/lib/stripe/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getStripeCustomerId } from "@/lib/stripe/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const customerId = await getStripeCustomerId(user.id);
    if (!customerId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura encontrada para gerenciar." },
        { status: 404 },
      );
    }

    const stripe = requireStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/configuracoes/plano`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao abrir o portal.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
