"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return false;
  return true;
}

export async function getNewsletterData() {
  const admin = createAdminClient();
  const [{ data: subs }, { count: active }, { data: campaigns }] = await Promise.all([
    admin.from("newsletter_subscribers").select("id, email, status, source, created_at").order("created_at", { ascending: false }).limit(200),
    admin.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
    admin.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }).limit(20),
  ]);
  const list = subs ?? [];
  const bySource: Record<string, number> = {};
  for (const s of list) bySource[s.source as string] = (bySource[s.source as string] ?? 0) + 1;
  return { subscribers: list, active: active ?? 0, total: list.length, bySource, campaigns: campaigns ?? [] };
}

// Envia uma campanha para todos os inscritos ativos (via Resend, em lotes).
export async function sendCampaign(subject: string, body: string): Promise<{ sent?: number; error?: string }> {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  if (!subject.trim() || !body.trim()) return { error: "Assunto e conteúdo são obrigatórios." };
  const admin = createAdminClient();
  const { data: subs } = await admin.from("newsletter_subscribers").select("email").eq("status", "active");
  const emails = (subs ?? []).map((s) => s.email as string);
  if (emails.length === 0) return { error: "Nenhum inscrito ativo." };

  const { campaignEmailTemplate } = await import("@/lib/email-templates");
  const { sendEmail } = await import("@/lib/email");
  const html = campaignEmailTemplate(subject, body);

  // cria a campanha
  const { data: camp } = await admin.from("newsletter_campaigns").insert({ subject, body, status: "sending" }).select("id").single();

  let sent = 0;
  for (const email of emails) {
    const r = await sendEmail({ to: email, subject, text: body, html });
    if (r.ok) sent++;
  }
  if (camp) await admin.from("newsletter_campaigns").update({ status: "sent", sent_count: sent, sent_at: new Date().toISOString() }).eq("id", camp.id);
  revalidatePath("/admin/newsletter");
  return { sent };
}

export async function removeSubscriber(id: string) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const admin = createAdminClient();
  await admin.from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
  return { ok: true };
}
