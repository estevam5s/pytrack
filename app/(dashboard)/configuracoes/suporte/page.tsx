import { LifeBuoy, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportForm } from "@/components/support/support-form";
import { cn } from "@/lib/utils";

export const metadata = { title: "Suporte · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function SuportePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages = [] } = user
    ? await supabase
        .from("support_messages")
        .select("id, sender, subject, body, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  // marca as respostas do admin como lidas (limpa o badge)
  if (user) {
    await supabase
      .from("support_messages")
      .update({ read_by_user: true })
      .eq("user_id", user.id)
      .eq("sender", "admin")
      .eq("read_by_user", false);
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Fale com a equipe</p>
            <p className="text-sm text-text-secondary">
              Algo no seu plano? Uma sugestão de melhoria ou recurso novo? Mande
              uma mensagem — respondemos por aqui.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> Nova mensagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SupportForm />
        </CardContent>
      </Card>

      {(messages ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(messages ?? []).map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  m.sender === "admin"
                    ? "bg-primary/10 text-foreground"
                    : "ml-auto bg-surface-2 text-text-secondary",
                )}
              >
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  {m.sender === "admin" ? "Equipe PyTrack" : "Você"}
                  {m.subject ? ` · ${m.subject}` : ""}
                </p>
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className="mt-1 text-[10px] text-text-secondary/70">
                  {new Date(m.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
