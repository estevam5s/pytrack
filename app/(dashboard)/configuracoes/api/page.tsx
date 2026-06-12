import { Code2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeysManager } from "@/components/settings/api-keys-manager";
import { ApiPlayground } from "@/components/settings/api-playground";

export const metadata = { title: "API · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ApiSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tier = user ? await getUserTier(user.id) : "free";
  const canUse = tierAtLeast(tier, "suprema");

  const { data: keys = [] } = user
    ? await supabase
        .from("api_keys")
        .select("id, name, key_prefix, last_used_at, created_at, revoked")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" /> API da plataforma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-text-secondary">
          Gere chaves para integrar seu progresso da PyTrack a outros serviços
          (badges, portfólio, automações). Disponível no plano <strong>Suprema (R$46)</strong> ou superior.
        </p>
        <ApiKeysManager keys={keys ?? []} canUse={canUse} />
        {canUse && (
          <div className="mt-5">
            <ApiPlayground />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
