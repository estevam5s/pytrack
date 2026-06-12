import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/settings/notification-settings";

export const metadata = { title: "Notificações · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = user
    ? await supabase.from("users_profile").select("notif_prefs").eq("user_id", user.id).maybeSingle()
    : { data: null };

  const prefs = {
    sound: true,
    plan: true,
    community: true,
    support: true,
    system: true,
    ...((data?.notif_prefs as Record<string, boolean>) ?? {}),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Notificações e sons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationSettings initial={prefs} />
      </CardContent>
    </Card>
  );
}
