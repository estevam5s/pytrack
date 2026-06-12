import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ChatWindow } from "@/components/rede/chat-window";

export const metadata = { title: "Conversa · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  if (id === user.id) redirect("/comunidade/mensagens");

  const admin = createAdminClient();
  const { data: other } = await admin.from("users_profile").select("name, avatar_url, headline").eq("user_id", id).maybeSingle();
  if (!other) notFound();

  const { data: msgs } = await supabase
    .from("community_messages")
    .select("id, sender_id, recipient_id, body, created_at")
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true })
    .limit(200);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/comunidade/mensagens" className="text-text-secondary hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <Link href={`/comunidade/perfil/${id}`} className="flex items-center gap-2.5">
          {other.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={other.avatar_url as string} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light">{((other.name as string) ?? "?").charAt(0)}</span>}
          <div>
            <p className="font-semibold leading-tight">{other.name as string}</p>
            {other.headline ? <p className="text-xs text-text-secondary">{other.headline as string}</p> : null}
          </div>
        </Link>
      </div>
      <ChatWindow meId={user.id} otherId={id} initial={(msgs ?? []) as never} />
    </div>
  );
}
