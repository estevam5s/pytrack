import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { timeAgo } from "@/lib/community/format";

export const metadata = { title: "Mensagens · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function MensagensPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: msgs } = await supabase
    .from("community_messages")
    .select("id, sender_id, recipient_id, body, read, created_at")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(300);

  // agrupa por interlocutor (última mensagem + não lidas)
  const conv = new Map<string, { last: string; at: string; unread: number }>();
  for (const m of msgs ?? []) {
    const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    const cur = conv.get(other as string);
    if (!cur) conv.set(other as string, { last: m.body as string, at: m.created_at as string, unread: 0 });
    if (m.recipient_id === user.id && !m.read) {
      const c = conv.get(other as string)!; c.unread += 1;
    }
  }

  const otherIds = [...conv.keys()];
  const admin = createAdminClient();
  const { data: profs } = otherIds.length
    ? await admin.from("users_profile").select("user_id, name, avatar_url, headline").in("user_id", otherIds)
    : { data: [] };
  const pmap = new Map((profs ?? []).map((p) => [p.user_id, p]));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight"><MessageSquare className="h-6 w-6 text-primary-light" /> Mensagens</h1>

      {otherIds.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-secondary">
          Nenhuma conversa ainda. Visite o perfil de alguém e clique em <strong>Mensagem</strong> para começar.
        </div>
      ) : (
        <div className="space-y-2">
          {otherIds.map((id) => {
            const c = conv.get(id)!; const p = pmap.get(id);
            return (
              <Link key={id} href={`/comunidade/mensagens/${id}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
                {p?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatar_url as string} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light">{((p?.name as string) ?? "?").charAt(0)}</span>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{(p?.name as string) ?? "Membro"}</p>
                    <span className="shrink-0 text-[11px] text-text-secondary">{timeAgo(c.at)}</span>
                  </div>
                  <p className="truncate text-sm text-text-secondary">{c.last}</p>
                </div>
                {c.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">{c.unread}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
