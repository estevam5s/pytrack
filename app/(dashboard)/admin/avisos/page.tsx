import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { BroadcastForm } from "@/components/admin/broadcast-form";

export const metadata = { title: "Avisos & Notificações · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminAvisosPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const admin = createAdminClient();
  const { data: recent } = await admin
    .from("notifications")
    .select("title, type, created_at")
    .eq("is_broadcast", true)
    .order("created_at", { ascending: false })
    .limit(8);

  // deduplica por título+data (cada broadcast cria N linhas)
  const seen = new Set<string>();
  const history = (recent ?? []).filter((r) => {
    const k = `${r.title}-${(r.created_at as string).slice(0, 16)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Avisos & Notificações"
        description="Envie novidades, features, novas trilhas/projetos/exercícios, mudanças de valores e mensagens — chega para os usuários no sino, na rota de notificações e como popup."
      />
      <Card>
        <CardContent className="p-5">
          <BroadcastForm />
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="mt-5">
          <CardContent className="p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Megaphone className="h-4 w-4 text-primary-light" /> Últimos avisos enviados</p>
            <ul className="divide-y divide-border">
              {history.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <span>{r.title}</span>
                  <span className="text-xs text-text-secondary">{new Date(r.created_at as string).toLocaleString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
