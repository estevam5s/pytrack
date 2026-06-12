import { redirect } from "next/navigation";
import { MessageCircle, Bot, User2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AdminChatReply } from "@/components/admin/admin-chat-reply";
import { cn } from "@/lib/utils";

export const metadata = { title: "Chat ao vivo · Admin · PyTrack" };
export const dynamic = "force-dynamic";

interface Conv {
  id: string;
  user_id: string | null;
  anon_id: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  last_message_at: string;
}

export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const { c } = await searchParams;
  const admin = createAdminClient();

  const { data: convs = [] } = await admin
    .from("chat_conversations")
    .select("id, user_id, anon_id, visitor_name, visitor_email, status, last_message_at")
    .order("last_message_at", { ascending: false })
    .limit(100);

  const selected = c ?? (convs ?? [])[0]?.id ?? null;

  let messages: { id: string; role: string; content: string; created_at: string }[] = [];
  let current: Conv | null = null;
  if (selected) {
    current = (convs ?? []).find((x) => x.id === selected) ?? null;
    const { data } = await admin
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", selected)
      .order("created_at", { ascending: true });
    messages = data ?? [];
  }

  const label = (cv: Conv) =>
    cv.visitor_name || cv.visitor_email || (cv.user_id ? "Cliente" : "Visitante anônimo");

  const statusBadge: Record<string, string> = {
    bot: "border-border bg-surface-2 text-text-secondary",
    waiting_human: "border-warning/30 bg-warning/10 text-warning",
    human: "border-green/30 bg-green/10 text-green",
    closed: "border-border bg-surface-2 text-text-secondary",
  };

  return (
    <div>
      <PageHeader
        title="Chat ao vivo"
        description="Todas as conversas do assistente e do suporte (anônimas e de clientes)."
      />
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* lista */}
        <Card className="overflow-hidden">
          <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {(convs ?? []).length === 0 && (
              <p className="p-4 text-sm text-text-secondary">Nenhuma conversa ainda.</p>
            )}
            {(convs ?? []).map((cv) => (
              <a
                key={cv.id}
                href={`/admin/chat?c=${cv.id}`}
                className={cn(
                  "block p-3 transition-colors hover:bg-surface-2",
                  cv.id === selected && "bg-surface-2",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate text-sm font-medium">
                    {cv.user_id ? <User2 className="h-3.5 w-3.5 text-green" /> : <Bot className="h-3.5 w-3.5 text-text-secondary" />}
                    {label(cv)}
                  </span>
                  <span className={cn("shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase", statusBadge[cv.status])}>
                    {cv.status === "waiting_human" ? "aguarda" : cv.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                  {cv.visitor_email ?? cv.anon_id ?? "—"} · {new Date(cv.last_message_at).toLocaleString("pt-BR")}
                </p>
              </a>
            ))}
          </div>
        </Card>

        {/* conversa */}
        <Card className="flex max-h-[70vh] flex-col overflow-hidden">
          {current ? (
            <>
              <div className="border-b border-border p-3 text-sm font-semibold">
                {label(current)}{" "}
                <span className="text-xs font-normal text-text-secondary">
                  · {current.visitor_email ?? (current.user_id ? "conta" : "anônimo")}
                </span>
              </div>
              <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "user"
                        ? "bg-surface-2"
                        : m.role === "admin"
                          ? "ml-auto bg-primary text-white"
                          : "ml-auto bg-primary/10",
                    )}
                  >
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                      {m.role === "user" ? "Visitante" : m.role === "admin" ? "Você" : "Py (IA)"}
                    </p>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-sm text-text-secondary">Sem mensagens.</p>
                )}
              </CardContent>
              <AdminChatReply conversationId={current.id} status={current.status} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-sm text-text-secondary">
              <MessageCircle className="mr-2 h-5 w-5" /> Selecione uma conversa.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
