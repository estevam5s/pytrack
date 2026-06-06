import { NextResponse } from "next/server";
import { requireStripe, STRIPE_PRICE_ID, APP_URL } from "@/lib/stripe/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getStripeCustomerId } from "@/lib/stripe/subscriptions";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (!STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "Pagamentos ainda não foram configurados pelo administrador." },
        { status: 503 },
      );
    }

    const stripe = requireStripe();
    const admin = createAdminClient();

    // recupera ou cria o Stripe Customer
    let customerId = await getStripeCustomerId(user.id);
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await admin.from("stripe_customers").upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          email: user.email ?? null,
        },
        { onConflict: "user_id" },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      metadata: { user_id: user.id },
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      success_url: `${APP_URL}/inicio?checkout=success`,
      cancel_url: `${APP_URL}/assinar?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao iniciar pagamento.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
