"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string, source = "popup"): Promise<{ ok?: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(clean)) return { error: "E-mail inválido." };
  try {
    const admin = createAdminClient();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await admin.from("newsletter_subscribers").upsert(
      { email: clean, user_id: user?.id ?? null, status: "active", source, unsubscribed_at: null },
      { onConflict: "email" },
    );
    if (error) return { error: error.message };

    // e-mail de boas-vindas da newsletter (Resend)
    try {
      const { sendEmail } = await import("@/lib/email");
      const { newsletterWelcomeTemplate } = await import("@/lib/email-templates");
      await sendEmail({
        to: clean,
        subject: "🐍 Inscrição confirmada na newsletter da PyTrack!",
        text: "Você agora recebe novidades mensais sobre Python e a PyTrack. Bem-vindo!",
        html: newsletterWelcomeTemplate(),
      });
    } catch { /* best-effort */ }

    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao inscrever." };
  }
}

export async function unsubscribeNewsletter(email: string) {
  const admin = createAdminClient();
  await admin.from("newsletter_subscribers").update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() }).eq("email", email.trim().toLowerCase());
  return { ok: true };
}
