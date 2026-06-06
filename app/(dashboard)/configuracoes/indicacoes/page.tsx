import { Gift, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/stripe/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralLink } from "@/components/billing/ReferralLink";

export const metadata = { title: "Indicações · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function IndicacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let code = "";
  let total = 0;
  let converted = 0;

  if (user) {
    await supabase.rpc("community_ensure_profile", { uid: user.id });
    const { data: profile } = await supabase
      .from("community_profiles")
      .select("referral_code")
      .eq("user_id", user.id)
      .maybeSingle();
    code = profile?.referral_code ?? "";

    try {
      const admin = createAdminClient();
      const { data: refs } = await admin
        .from("referrals")
        .select("status")
        .eq("referrer_user_id", user.id);
      total = refs?.length ?? 0;
      converted = (refs ?? []).filter((r) => r.status === "converted").length;
    } catch {
      /* ignore */
    }
  }

  const link = `${APP_URL}/auth/register?ref=${code}`;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/30">
        <div className="relative bg-gradient-to-br from-primary/20 via-surface to-surface p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-40" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
              <Gift className="h-3.5 w-3.5" /> Indique e ganhe
            </span>
            <h2 className="mt-3 text-2xl font-bold">
              Ganhe <span className="text-gradient">1 mês grátis</span> por indicação
            </h2>
            <p className="mt-2 max-w-lg text-sm text-text-secondary">
              Compartilhe seu link. Quando um amigo se cadastrar e assinar,
              você ganha 1 mês grátis aplicado automaticamente na sua próxima
              cobrança.
            </p>
          </div>
        </div>
        <CardContent className="p-6">
          <ReferralLink url={link} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-text-secondary">Convites usados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold">{converted}</p>
              <p className="text-xs text-text-secondary">Amigos que assinaram</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Como funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-text-secondary">
            {[
              "Copie e compartilhe seu link de convite.",
              "Seu amigo cria a conta pelo link e assina o plano.",
              "Você ganha 1 mês grátis aplicado na sua próxima fatura, automaticamente.",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary-light">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
