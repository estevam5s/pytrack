import { redirect } from "next/navigation";
import { Inbox, Mail } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { ReplyForm } from "@/components/admin/reply-form";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mensagens · Admin · PyTrack" };
export const dynamic = "force-dynamic";

interface Msg {
  id: string;
  user_id: string;
  sender: string;
  subject: string | null;
  body: string;
  read_by_admin: boolean;
  created_at: string;
}

export default async function AdminMensagensPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/configuracoes");

  const admin = createAdminClient();
  const { data: msgs = [] } = await admin
    .from("support_messages")
    .select("id, user_id, sender, subject, body, read_by_admin, created_at")
    .order("created_at", { ascending: true });

  let emailById = new Map<string, string>();
  try {
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    emailById = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
  } catch {
    /* ignore */
  }

  // marca mensagens dos usuários como lidas (limpa o badge do admin)
  await admin
    .from("support_messages")
    .update({ read_by_admin: true })
    .eq("sender", "user")
    .eq("read_by_admin", false);

  // agrupa por usuário
  const threads = new Map<string, Msg[]>();
  for (const m of (msgs ?? []) as Msg[]) {
    if (!threads.has(m.user_id)) threads.set(m.user_id, []);
    threads.get(m.user_id)!.push(m);
  }
  // ordena threads pela última mensagem (mais recente primeiro)
  const ordered = [...threads.entries()].sort((a, b) => {
    const la = a[1][a[1].length - 1].created_at;
    const lb = b[1][b[1].length - 1].created_at;
    return lb.localeCompare(la);
  });

  const unread = (msgs ?? []).filter(
    (m: Msg) => m.sender === "user" && !m.read_by_admin,
  ).length;

  return (
    <div className="space-y-6">
      <Card className="border-primary/30">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Canal de comunicação</p>
            <p className="text-sm text-text-secondary">
              Mensagens dos usuários · <strong>{unread}</strong> não lida(s) ·{" "}
              {ordered.length} conversa(s).
            </p>
          </div>
        </CardContent>
      </Card>

      {ordered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-text-secondary">
            Nenhuma mensagem ainda.
          </CardContent>
        </Card>
      ) : (
        ordered.map(([userId, list]) => {
          const hasUnread = list.some((m) => m.sender === "user" && !m.read_by_admin);
          return (
            <Card key={userId} className={cn(hasUnread && "border-primary/40")}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{emailById.get(userId) ?? userId.slice(0, 8)}</span>
                  {hasUnread && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">
                      Nova
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {list.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                        m.sender === "admin"
                          ? "ml-auto bg-primary/10 text-foreground"
                          : "bg-surface-2 text-text-secondary",
                      )}
                    >
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        {m.sender === "admin" ? "Você (equipe)" : "Cliente"}
                        {m.subject ? ` · ${m.subject}` : ""}
                      </p>
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p className="mt-1 text-[10px] text-text-secondary/70">
                        {new Date(m.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
                <ReplyForm userId={userId} />
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
