import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { trialEndingEmailTemplate } from "@/lib/email-templates";
import { monthlyValue, fmtBRL } from "@/lib/billing-stats";
import { tierOf, TIER_LABEL } from "@/lib/billing-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron diário: avisa por e-mail quem está a ~3 dias do fim do trial (1ª cobrança).
 * Protegido por CRON_SECRET (header Authorization: Bearer ...) ou Vercel Cron.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  if (secret && !isVercelCron && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  // janela: período termina entre 2.5 e 3.5 dias a partir de agora
  const now = Date.now();
  const from = new Date(now + 2.5 * 86400000).toISOString();
  const to = new Date(now + 3.5 * 86400000).toISOString();

  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id, status, stripe_price_id, current_period_end")
    .eq("status", "trialing")
    .gte("current_period_end", from)
    .lte("current_period_end", to);

  let sent = 0;
  for (const s of subs ?? []) {
    try {
      // dedupe: não reenvia se já avisamos
      const { data: prof } = await admin
        .from("users_profile")
        .select("trial_reminded, name")
        .eq("user_id", s.user_id)
        .maybeSingle();
      if (prof?.trial_reminded) continue;

      const { data: u } = await admin.auth.admin.getUserById(s.user_id as string);
      const email = u.user?.email;
      if (!email) continue;

      const name = ((prof?.name as string) ?? "").split(" ")[0];
      const tier = tierOf(s as never);
      const value = fmtBRL(monthlyValue(s.stripe_price_id));
      const date = new Date(s.current_period_end as string).toLocaleDateString("pt-BR");

      await sendEmail({
        to: email,
        subject: "Seu período grátis termina em 3 dias · PyTrack",
        text: `Olá${name ? `, ${name}` : ""}. Seu teste grátis termina em 3 dias. A partir de ${date} sua assinatura ${TIER_LABEL[tier]} será cobrada em ${value}. Gerencie em www.pytrack.com.br/configuracoes/plano`,
        html: trialEndingEmailTemplate(name, TIER_LABEL[tier], value, date),
      });
      // notificação in-app
      await admin.from("notifications").insert({
        user_id: s.user_id,
        type: "plan",
        title: "Seu período grátis termina em 3 dias",
        body: `A partir de ${date}, sua assinatura será cobrada em ${value}.`,
        link: "/configuracoes/plano",
      });
      await admin.from("users_profile").update({ trial_reminded: true }).eq("user_id", s.user_id);
      sent += 1;
    } catch {
      /* segue para o próximo */
    }
  }

  return NextResponse.json({ ok: true, checked: subs?.length ?? 0, sent });
}
