import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { SecuritySettings } from "@/components/settings/security-settings";

export const metadata = { title: "Segurança · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function SegurancaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gh = user?.identities?.find((i) => i.provider === "github");
  const githubUser =
    (gh?.identity_data?.user_name as string | undefined) ??
    (gh?.identity_data?.preferred_username as string | undefined) ??
    (gh ? "github" : null);

  return (
    <div className="space-y-6">
      <Card className="border-primary/30">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Segurança da conta</p>
            <p className="text-sm text-text-secondary">
              Ative a verificação em duas etapas (2FA) e conecte sua conta do GitHub.
            </p>
          </div>
        </CardContent>
      </Card>

      <SecuritySettings githubUser={githubUser ?? null} />
    </div>
  );
}
