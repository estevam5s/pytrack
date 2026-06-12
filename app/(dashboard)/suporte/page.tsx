import { redirect } from "next/navigation";
import { LifeBuoy, MessageSquare, Share2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAILS, isAdmin } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SupportForm } from "@/components/support/support-form";
import { ContactChannels } from "@/components/contact-channels";
import { SupportThread } from "@/components/support/support-thread";

export const metadata = { title: "Suporte · PyTrack" };
export const dynamic = "force-dynamic";

export default async function SuportePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // o admin é o suporte — ele atende em /admin/mensagens, não abre chamados
  if (isAdmin(user?.email)) redirect("/admin/mensagens");

  const { data: messages = [] } = user
    ? await supabase
        .from("support_messages")
        .select("id, sender, subject, body, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  if (user) {
    await supabase
      .from("support_messages")
      .update({ read_by_user: true })
      .eq("user_id", user.id)
      .eq("sender", "admin")
      .eq("read_by_user", false);
  }

  // status do admin (online se visto nos últimos 5 minutos)
  let adminOnline = false;
  try {
    const admin = createAdminClient();
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const adminIds = users.users
      .filter((u) => ADMIN_EMAILS.includes((u.email ?? "").toLowerCase()))
      .map((u) => u.id);
    if (adminIds.length) {
      const { data: profs } = await admin
        .from("users_profile")
        .select("last_seen_at")
        .in("user_id", adminIds);
      const cutoff = Date.now() - 5 * 60 * 1000;
      adminOnline = (profs ?? []).some(
        (p) => p.last_seen_at && new Date(p.last_seen_at).getTime() > cutoff,
      );
    }
  } catch {
    /* ignore */
  }

  const hasOpen = (messages ?? []).length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Suporte & Atendimento"
        description="Abra um chamado, converse com a equipe e acompanhe suas mensagens."
      />
      <div className="space-y-6">
        {/* status do atendimento */}
        <Card className="border-primary/30">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                <LifeBuoy className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Equipe PyTrack</p>
                <p className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <span
                    className={`h-2 w-2 rounded-full ${adminOnline ? "bg-green animate-pulse" : "bg-text-secondary/40"}`}
                  />
                  {adminOnline ? "Online agora" : "Offline — respondemos em breve"}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-secondary">
              <Clock className="h-3.5 w-3.5" /> Resposta em até 24h úteis
            </span>
          </CardContent>
        </Card>

        {/* abrir chamado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              {hasOpen ? "Continuar conversa" : "Abrir um chamado"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupportForm withCategory />
          </CardContent>
        </Card>

        {/* conversa (atualiza sozinha) */}
        {hasOpen && (
          <Card>
            <CardHeader>
              <CardTitle>Sua conversa</CardTitle>
            </CardHeader>
            <CardContent>
              <SupportThread
                initial={(messages ?? []).map((m) => ({
                  id: m.id,
                  sender: m.sender,
                  subject: m.subject,
                  body: m.body,
                  created_at: m.created_at,
                }))}
              />
            </CardContent>
          </Card>
        )}

        {/* canais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" /> Canais oficiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactChannels columns={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
