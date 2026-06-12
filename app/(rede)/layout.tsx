import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RedeTopNav } from "@/components/rede/rede-topnav";
import { MessageNotifier } from "@/components/rede/message-notifier";
import { LanguageProvider } from "@/components/site/language-provider";

export const dynamic = "force-dynamic";

export default async function RedeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();
  const [{ data: prof }, { count: unread }, { count: unreadMsgs }] = await Promise.all([
    admin.from("users_profile").select("name, avatar_url").eq("user_id", user.id).maybeSingle(),
    admin.from("community_notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false),
    admin.from("community_messages").select("id", { count: "exact", head: true }).eq("recipient_id", user.id).eq("read", false),
  ]);

  const me = {
    id: user.id,
    name: (prof?.name as string) ?? user.email?.split("@")[0] ?? "Estudante",
    avatar: (prof?.avatar_url as string) ?? null,
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-surface-2/40">
        <RedeTopNav me={me} unread={unread ?? 0} unreadMsgs={unreadMsgs ?? 0} />
        <MessageNotifier meId={user.id} />
        <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
      </div>
    </LanguageProvider>
  );
}
