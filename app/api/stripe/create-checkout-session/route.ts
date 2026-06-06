import { NextResponse } from "next/server";
import {
  requireStripe,
  STRIPE_PRICE_ID,
  STRIPE_TRIAL_DAYS,
  APP_URL,
  priceForPlan,
} from "@/lib/stripe/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getStripeCustomerId } from "@/lib/stripe/subscriptions";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    let plan = "essencial_monthly";
    try {
      const body = await req.json();
      if (typeof body?.plan === "string") plan = body.plan;
    } catch {
      /* sem body = essencial mensal */
    }

    const priceId = priceForPlan(plan) ?? STRIPE_PRICE_ID;

    if (!priceId) {
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
        { user_id: user.id, stripe_customer_id: customerId, email: user.email ?? null },
        { onConflict: "user_id" },
      );
    }

    // trial só na primeira assinatura do usuário
    let trialDays: number | undefined;
    if (STRIPE_TRIAL_DAYS > 0) {
      const { data: prior } = await admin
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!prior) trialDays = STRIPE_TRIAL_DAYS;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: user.id, plan },
      subscription_data: {
        metadata: { user_id: user.id },
        ...(trialDays ? { trial_period_days: trialDays } : {}),
      },
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
