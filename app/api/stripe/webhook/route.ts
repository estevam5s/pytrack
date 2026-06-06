import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { requireStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Admin = ReturnType<typeof createAdminClient>;

const tsFromUnix = (s?: number | null) =>
  s ? new Date(s * 1000).toISOString() : null;

async function resolveUserId(
  admin: Admin,
  sub: any,
): Promise<string | null> {
  if (sub?.metadata?.user_id) return sub.metadata.user_id as string;
  const customerId = typeof sub?.customer === "string" ? sub.customer : sub?.customer?.id;
  if (!customerId) return null;
  const { data } = await admin
    .from("stripe_customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function upsertSubscription(admin: Admin, sub: any, userId: string) {
  const item = sub.items?.data?.[0];
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId ?? null,
      stripe_subscription_id: sub.id,
      stripe_price_id: item?.price?.id ?? null,
      status: sub.status,
      current_period_start: tsFromUnix(sub.current_period_start ?? item?.current_period_start),
      current_period_end: tsFromUnix(sub.current_period_end ?? item?.current_period_end),
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      canceled_at: tsFromUnix(sub.canceled_at),
      trial_start: tsFromUnix(sub.trial_start),
      trial_end: tsFromUnix(sub.trial_end),
      metadata: sub.metadata ?? {},
    },
    { onConflict: "user_id" },
  );
}

async function syncSubscriptionById(admin: Admin, subId: string, userHint?: string | null) {
  const stripe = requireStripe();
  const sub = await stripe.subscriptions.retrieve(subId);
  const userId = userHint ?? (await resolveUserId(admin, sub));
  if (userId) await upsertSubscription(admin, sub, userId);
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  let stripe: Stripe;
  try {
    stripe = requireStripe();
  } catch {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "assinatura inválida";
    return NextResponse.json({ error: `Webhook signature: ${msg}` }, { status: 400 });
  }

  const admin = createAdminClient();

  // dedupe
  const { data: seen } = await admin
    .from("payment_events")
    .select("processed")
    .eq("stripe_event_id", event.id)
    .maybeSingle();
  if (seen?.processed) return NextResponse.json({ received: true, duplicate: true });

  await admin.from("payment_events").upsert(
    { stripe_event_id: event.id, type: event.type, payload: event as any, processed: false },
    { onConflict: "stripe_event_id" },
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as any;
        const userId = s.metadata?.user_id ?? null;
        const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
        if (userId && customerId) {
          await admin.from("stripe_customers").upsert(
            { user_id: userId, stripe_customer_id: customerId, email: s.customer_details?.email ?? null },
            { onConflict: "user_id" },
          );
        }
        if (s.subscription) {
          await syncSubscriptionById(admin, s.subscription as string, userId);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = await resolveUserId(admin, sub);
        if (userId) await upsertSubscription(admin, sub, userId);
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const inv = event.data.object as any;
        const subId = inv.subscription ?? inv.parent?.subscription_details?.subscription;
        if (subId) await syncSubscriptionById(admin, subId as string);
        break;
      }
      case "customer.updated": {
        const c = event.data.object as any;
        await admin
          .from("stripe_customers")
          .update({ email: c.email ?? null })
          .eq("stripe_customer_id", c.id);
        break;
      }
      default:
        break;
    }

    await admin.from("payment_events").update({ processed: true }).eq("stripe_event_id", event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro ao processar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
