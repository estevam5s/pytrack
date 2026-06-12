import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Heart, MessageSquare, UserPlus, AtSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { markNotificationsRead } from "@/lib/community/actions";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/community/format";

export const metadata = { title: "Notificações · PyTrack Rede" };
export const dynamic = "force-dynamic";

const ICON: Record<string, typeof Bell> = {
  like: Heart, comment: MessageSquare, follow: UserPlus, connection: UserPlus, mention: AtSign,
};

export default async function RedeNotificacoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();
  const { data: notes } = await admin
    .from("community_notifications")
    .select("id, actor_id, type, post_id, message, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // perfis dos atores
  const actorIds = Array.from(new Set((notes ?? []).map((n) => n.actor_id).filter(Boolean) as string[]));
  const { data: profs } = actorIds.length
    ? await admin.from("users_profile").select("user_id, name, avatar_url").in("user_id", actorIds)
    : { data: [] };
  const pmap = new Map((profs ?? []).map((p) => [p.user_id, p]));

  // marca como lidas
  await markNotificationsRead();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight"><Bell className="h-6 w-6 text-primary-light" /> Notificações</h1>

      {!notes || notes.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-text-secondary">Nenhuma notificação ainda. Interaja com a comunidade!</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {notes.map((n) => {
            const Icon = ICON[n.type as string] ?? Bell;
            const actor = n.actor_id ? pmap.get(n.actor_id as string) : null;
            const href = n.post_id ? `/comunidade` : n.actor_id ? `/comunidade/perfil/${n.actor_id}` : "/comunidade";
            return (
              <Link key={n.id} href={href} className={`flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 ${n.read ? "bg-card" : "bg-primary/5"}`}>
                <span className="relative">
                  {actor?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={actor.avatar_url as string} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light">{((actor?.name as string) ?? "?").charAt(0).toUpperCase()}</span>
                  )}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card"><Icon className="h-3 w-3 text-primary-light" /></span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm"><span className="font-semibold">{(actor?.name as string) ?? "Alguém"}</span> {n.message}</p>
                  <p className="text-xs text-text-secondary">{timeAgo(n.created_at as string)}</p>
                </div>
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
