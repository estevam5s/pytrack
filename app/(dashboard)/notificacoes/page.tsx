import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationsList } from "@/components/dashboard/notifications-list";

export const metadata = { title: "Notificações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: items = [] } = user
    ? await supabase
        .from("notifications")
        .select("id, type, title, body, link, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] };

  // marca todas como lidas ao abrir
  if (user) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Notificações" description="Tudo o que aconteceu na sua conta e na plataforma." />
      {(items ?? []).length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-text-secondary">
            <Bell className="mx-auto mb-3 h-8 w-8 opacity-40" />
            <p>Você não tem notificações ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <NotificationsList items={(items ?? []) as never} />
      )}
    </div>
  );
}
