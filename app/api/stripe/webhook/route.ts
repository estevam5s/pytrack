import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { requireStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/logger";
import { sendEmail } from "@/lib/email";
import { cancellationEmailTemplate } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Admin = ReturnType<typeof createAdminClient>;

const tsFromUnix = (s?: number | null) =>
  s ? new Date(s * 1000).toISOString() : null;

// envia e-mail + notificação de cancelamento (dedupe por dia)
async function notifyCancellation(admin: Admin, userId: string) {
  try {
    const { data: u } = await admin.auth.admin.getUserById(userId);
    const email = u.user?.email;
    const name = (u.user?.user_metadata?.name as string | undefined)?.split(" ")[0] ?? "";
    // evita reenviar se já notificou nas últimas 12h
    const { data: recent } = await admin
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "plan")
      .ilike("title", "%cancel%")
      .gte("created_at", new Date(Date.now() - 12 * 3600000).toISOString())
      .maybeSingle();
    if (recent) return;

    await admin.from("notifications").insert({
      user_id: userId,
      type: "plan",
      title: "Plano cancelado",
      body: "Seu plano foi cancelado. Você não receberá mais cobranças.",
      link: "/configuracoes/plano",
    });
    if (email) {
      await sendEmail({
        to: email,
        subject: "Cancelamento confirmado · PyTrack",
        text: `Olá${name ? `, ${name}` : ""}. Confirmamos o cancelamento do seu plano na PyTrack. Você não receberá mais cobranças. Seus dados continuam salvos.`,
        html: cancellationEmailTemplate(name, "PyTrack"),
      });
    }
  } catch (e) {
    await logError("stripe.cancellation_notify", e, { userId });
  }
}

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
  const currentPriceId = item?.price?.id ?? null;
  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId ?? null,
      stripe_subscription_id: sub.id,
      stripe_price_id: currentPriceId,
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
  // Downgrade agendado entrou em vigor (o preço já é o que estava pendente, ou o
  // schedule foi solto) → limpa as colunas pending_* para a UI parar de mostrar.
  await reconcilePending(admin, userId, currentPriceId, sub.schedule);
}

/** Limpa o agendamento pendente quando a troca já aconteceu (preço == pendente). */
async function reconcilePending(
  admin: Admin,
  userId: string,
  currentPriceId: string | null,
  scheduleRef: any,
) {
  try {
    const { data: row } = await admin
      .from("subscriptions")
      .select("pending_price_id")
      .eq("user_id", userId)
      .maybeSingle();
    const pending = (row as { pending_price_id?: string | null } | null)
      ?.pending_price_id;
    if (!pending) return;
    const scheduleId =
      typeof scheduleRef === "string" ? scheduleRef : scheduleRef?.id;
    // sem schedule ativo, ou o preço atual já é o agendado → troca concluída
    if (!scheduleId || currentPriceId === pending) {
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
  } catch (e) {
    console.error("[billing] reconcilePending falhou:", e);
  }
}

async function syncSubscriptionById(admin: Admin, subId: string, userHint?: string | null) {
  const stripe = requireStripe();
  const sub = await stripe.subscriptions.retrieve(subId);
  const userId = userHint ?? (await resolveUserId(admin, sub));
  if (userId) {
    await upsertSubscription(admin, sub, userId);
    if (sub.status === "active" || sub.status === "trialing") {
      await maybeRewardReferral(admin, userId);
    }
  }
}

/** Quando o indicado vira assinante, premia quem indicou com um cupom. */
async function maybeRewardReferral(admin: Admin, referredUserId: string) {
  const coupon = process.env.STRIPE_REFERRAL_COUPON;
  if (!coupon) return;
  try {
    const { data: ref } = await admin
      .from("referrals")
      .select("id, referrer_user_id, reward_granted")
      .eq("referred_user_id", referredUserId)
      .eq("reward_granted", false)
      .maybeSingle();
    if (!ref) return;
    await admin
      .from("referrals")
      .update({ status: "converted", converted_at: new Date().toISOString() })
      .eq("id", ref.id);
    const { data: cust } = await admin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", ref.referrer_user_id)
      .maybeSingle();
    if (cust?.stripe_customer_id) {
      const stripe = requireStripe();
      // crédito de R$10 (1 mês) na próxima fatura do indicador
      await stripe.customers.createBalanceTransaction(cust.stripe_customer_id, {
        amount: -1000,
        currency: "brl",
        description: "Recompensa por indicação — 1 mês grátis",
      });
      await admin.from("referrals").update({ reward_granted: true }).eq("id", ref.id);
    }
  } catch (e) {
    console.error("[referral] recompensa falhou:", e);
  }
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
        // pagamento único (Vitalício) — concede acesso vitalício
        if (s.mode === "payment" && userId && s.metadata?.plan === "vitalicio") {
          await admin.from("subscriptions").upsert(
            {
              user_id: userId,
              status: "active",
              stripe_price_id: process.env.STRIPE_PRICE_ID_VITALICIO ?? null,
              stripe_customer_id: customerId ?? null,
              current_period_end: "2126-06-06T00:00:00+00:00",
              cancel_at_period_end: false,
              metadata: { lifetime: true, payment_intent: s.payment_intent ?? null },
            },
            { onConflict: "user_id" },
          );
        }

        // Utmify: registra a venda paga (faturamento aparece no painel da Utmify)
        try {
          const { sendUtmifyOrder } = await import("@/lib/utmify");
          const m = (s.metadata ?? {}) as Record<string, string>;
          await sendUtmifyOrder({
            orderId: (s.payment_intent as string) ?? (s.id as string),
            status: "paid",
            paymentMethod: "credit_card",
            priceInCents: typeof s.amount_total === "number" ? s.amount_total : 0,
            productName: `PyTrack — plano ${m.plan ?? "assinatura"}`,
            productId: m.plan ?? "assinatura",
            customer: { name: s.customer_details?.name ?? null, email: s.customer_details?.email ?? null, ip: m.customer_ip ?? null },
            tracking: {
              utm_source: m.utm_source ?? null, utm_campaign: m.utm_campaign ?? null,
              utm_medium: m.utm_medium ?? null, utm_content: m.utm_content ?? null, utm_term: m.utm_term ?? null,
              src: m.src ?? null, sck: m.sck ?? null,
            },
            isTest: s.livemode === false,
          });
        } catch { /* não bloqueia o webhook */ }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = await resolveUserId(admin, sub);
        if (userId) {
          await upsertSubscription(admin, sub, userId);
          if (sub.status === "active" || sub.status === "trialing") {
            await maybeRewardReferral(admin, userId);
          }
          // cancelamento confirmado → e-mail + notificação ao usuário
          const canceled =
            event.type === "customer.subscription.deleted" ||
            (event.type === "customer.subscription.updated" && sub.cancel_at_period_end === true);
          if (canceled) {
            await notifyCancellation(admin, userId);
          }
        }
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const inv = event.data.object as any;
        const subId = inv.subscription ?? inv.parent?.subscription_details?.subscription;
        if (subId) await syncSubscriptionById(admin, subId as string);

        // Utmify: renovações de assinatura (faturamento recorrente).
        // O 1º pagamento já é enviado via checkout.session.completed; aqui só os ciclos seguintes.
        const isRenewal = event.type === "invoice.payment_succeeded" && inv.billing_reason === "subscription_cycle" && (inv.amount_paid ?? 0) > 0;
        if (isRenewal) {
          try {
            const { sendUtmifyOrder } = await import("@/lib/utmify");
            // tenta recuperar UTMs/IP da metadata da assinatura
            let subMeta: Record<string, string> = {};
            try {
              const sub = await stripe.subscriptions.retrieve(subId as string);
              subMeta = (sub.metadata ?? {}) as Record<string, string>;
            } catch { /* sem metadata */ }
            await sendUtmifyOrder({
              orderId: (inv.payment_intent as string) ?? (inv.id as string),
              status: "paid",
              paymentMethod: "credit_card",
              priceInCents: inv.amount_paid ?? 0,
              productName: `PyTrack — renovação ${subMeta.plan ?? "assinatura"}`,
              productId: subMeta.plan ?? "assinatura",
              customer: { name: inv.customer_name ?? null, email: inv.customer_email ?? null, ip: subMeta.customer_ip ?? null },
              tracking: {
                utm_source: subMeta.utm_source ?? null, utm_campaign: subMeta.utm_campaign ?? null,
                utm_medium: subMeta.utm_medium ?? null, utm_content: subMeta.utm_content ?? null, utm_term: subMeta.utm_term ?? null,
                src: subMeta.src ?? null, sck: subMeta.sck ?? null,
              },
              isTest: inv.livemode === false,
            });
          } catch { /* não bloqueia */ }
        }
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
      // reembolso feito pelo dashboard da Stripe (ou disputa) → revoga o acesso
      case "charge.refunded":
      case "charge.dispute.created": {
        const charge = event.data.object as any;
        const customerId = charge.customer as string | undefined;
        if (customerId) {
          // acha o usuário pelo customer e remove a assinatura
          const { data: cust } = await admin
            .from("stripe_customers")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();
          const userId = (cust?.user_id as string) ?? (charge.metadata?.user_id as string);
          if (userId) {
            const { data: sub } = await admin
              .from("subscriptions")
              .select("stripe_subscription_id")
              .eq("user_id", userId)
              .maybeSingle();
            if (sub?.stripe_subscription_id) {
              try {
                await stripe.subscriptions.cancel(sub.stripe_subscription_id);
              } catch {
                /* já cancelada */
              }
            }
            await admin.from("subscriptions").delete().eq("user_id", userId);
            await logError("stripe.refund", `Acesso revogado por ${event.type}`, { userId });
          }
        }
        // Utmify: registra o reembolso/chargeback (status refunded)
        try {
          const { sendUtmifyOrder } = await import("@/lib/utmify");
          const cm = (charge.metadata ?? {}) as Record<string, string>;
          await sendUtmifyOrder({
            orderId: (charge.payment_intent as string) ?? (charge.id as string),
            status: event.type === "charge.dispute.created" ? "chargedback" : "refunded",
            paymentMethod: "credit_card",
            priceInCents: typeof charge.amount_refunded === "number" && charge.amount_refunded > 0 ? charge.amount_refunded : (charge.amount ?? 0),
            productName: `PyTrack — plano ${cm.plan ?? "assinatura"}`,
            productId: cm.plan ?? "assinatura",
            customer: { name: charge.billing_details?.name ?? null, email: charge.billing_details?.email ?? null, ip: cm.customer_ip ?? null },
            refundedAt: new Date(),
            isTest: charge.livemode === false,
          });
        } catch { /* não bloqueia */ }
        break;
      }
      default:
        break;
    }

    await admin.from("payment_events").update({ processed: true }).eq("stripe_event_id", event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro ao processar";
    await logError("stripe.webhook", e, { eventId: event.id, eventType: event.type });
    // alerta o admin por e-mail (best-effort)
    try {
      await sendEmail({
        subject: `🚨 [PyTrack] Falha no webhook Stripe: ${event.type}`,
        text: `Um evento do Stripe falhou ao ser processado.\n\nEvento: ${event.type}\nID: ${event.id}\nErro: ${msg}\n\nVerifique /admin/saude e os logs. O Stripe vai re-tentar automaticamente.`,
      });
    } catch { /* não bloqueia */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
