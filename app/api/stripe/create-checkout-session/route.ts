import { NextResponse } from "next/server";
import {
  requireStripe,
  STRIPE_PRICE_ID,
  STRIPE_TRIAL_DAYS,
  APP_URL,
  priceForPlan,
  isLifetimePlan,
} from "@/lib/stripe/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getStripeCustomerId } from "@/lib/stripe/subscriptions";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readCookie(req: Request, name: string): string | undefined {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // DataFast: atribuição de receita por canal de marketing
    const df = {
      datafast_visitor_id: readCookie(req, "datafast_visitor_id"),
      datafast_session_id: readCookie(req, "datafast_session_id"),
    };
    const dfMeta = Object.fromEntries(
      Object.entries(df).filter(([, v]) => Boolean(v)),
    ) as Record<string, string>;

    let plan = "essencial_monthly";
    let bodyUtm: Record<string, unknown> = {};
    try {
      const body = await req.json();
      if (typeof body?.plan === "string") plan = body.plan;
      if (body?.utm && typeof body.utm === "object") bodyUtm = body.utm;
    } catch {
      /* sem body = essencial mensal */
    }

    // Utmify: captura UTMs (cookies da Utmify ou enviados pelo cliente) + IP
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck"];
    const utmMeta: Record<string, string> = {};
    for (const k of utmKeys) {
      const v = (bodyUtm[k] as string) || readCookie(req, k);
      if (v) utmMeta[k] = String(v).slice(0, 200);
    }
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (ip) utmMeta.customer_ip = ip;

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

    // assinatura atual do usuário
    const { data: prior } = await admin
      .from("subscriptions")
      .select("id, stripe_subscription_id, status, metadata")
      .eq("user_id", user.id)
      .maybeSingle();

    // PLANO VITALÍCIO (pagamento único) — checkout em modo "payment"
    if (isLifetimePlan(plan)) {
      if ((prior?.metadata as Record<string, unknown> | null)?.lifetime) {
        return NextResponse.json({ url: `${APP_URL}/configuracoes/plano` });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { user_id: user.id, plan: "vitalicio", ...dfMeta, ...utmMeta },
        payment_intent_data: { metadata: { user_id: user.id, plan: "vitalicio", ...dfMeta } },
        allow_promotion_codes: true,
        success_url: `${APP_URL}/inicio?checkout=success`,
        cancel_url: `${APP_URL}/assinar?checkout=cancelled`,
      });
      return NextResponse.json({ url: session.url });
    }

    // já tem assinatura ativa -> faz UPGRADE/DOWNGRADE direto (sem novo checkout)
    if (
      prior?.stripe_subscription_id &&
      ["active", "trialing", "past_due"].includes(prior.status)
    ) {
      const current = await stripe.subscriptions.retrieve(
        prior.stripe_subscription_id,
      );
      const item = current.items.data[0];
      if (item?.price?.id === priceId) {
        // já está nesse plano
        return NextResponse.json({ url: `${APP_URL}/configuracoes/plano` });
      }
      // upgrade = imediato + proração; downgrade = agendado p/ o fim do período
      const { applyPlanChange } = await import("@/lib/stripe/change-plan");
      const result = await applyPlanChange(
        user.id,
        prior.stripe_subscription_id,
        priceId,
      );
      return NextResponse.json({
        url: `${APP_URL}/configuracoes/plano?${result.kind === "downgrade" ? "scheduled" : "upgraded"}=1`,
      });
    }

    // trial só na primeira assinatura do usuário
    const trialDays = STRIPE_TRIAL_DAYS > 0 && !prior ? STRIPE_TRIAL_DAYS : undefined;

    // oferta ativa: aplica o cupom automaticamente (se vigente e do plano)
    let offerCoupon: string | null = null;
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const { data: offer } = await createAdminClient()
        .from("offers").select("stripe_coupon_id, plan, ends_at")
        .eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (offer?.stripe_coupon_id && (!offer.ends_at || new Date(offer.ends_at as string) > new Date()) && (offer.plan === "all" || offer.plan === plan)) {
        offerCoupon = offer.stripe_coupon_id as string;
      }
    } catch { /* sem oferta */ }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: user.id, plan, ...dfMeta, ...utmMeta },
      subscription_data: {
        metadata: { user_id: user.id, ...dfMeta, ...utmMeta },
        ...(trialDays ? { trial_period_days: trialDays } : {}),
      },
      // Stripe não permite discounts + allow_promotion_codes juntos
      ...(offerCoupon
        ? { discounts: [{ coupon: offerCoupon }] }
        : { allow_promotion_codes: true }),
      success_url: `${APP_URL}/inicio?checkout=success`,
      cancel_url: `${APP_URL}/assinar?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao iniciar pagamento.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
