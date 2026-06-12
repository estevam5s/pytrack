import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/inicio";
  const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // e-mail de boas-vindas após confirmar a conta (uma única vez)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { createAdminClient } = await import("@/lib/supabase/admin");
          const admin = createAdminClient();
          const { data: prof } = await admin
            .from("users_profile")
            .select("welcomed")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!prof?.welcomed) {
            await admin.from("users_profile").update({ welcomed: true }).eq("user_id", user.id);
            // recompensa de indicação: o indicado confirmou a conta → indicador ganha 1 mês grátis
            try { const { grantReferralReward } = await import("@/lib/referrals"); await grantReferralReward(user.id); } catch { /* best-effort */ }
            const { sendEmail } = await import("@/lib/email");
            const { welcomeEmailTemplate } = await import("@/lib/email-templates");
            const name = (user.user_metadata?.name as string | undefined)?.split(" ")[0] ?? "";
            if (user.email) {
              await sendEmail({
                to: user.email,
                subject: "Bem-vindo(a) à PyTrack! 🐍",
                text: "Sua conta foi confirmada. Bons estudos! Acesse www.pytrack.com.br/inicio",
                html: welcomeEmailTemplate(name),
              }).catch(() => {});
            }
          }
        }
      } catch {
        /* não bloqueia o login se o e-mail falhar */
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
