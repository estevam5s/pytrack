"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  sender: string;
  subject: string | null;
  body: string;
  created_at: string;
}

export function SupportThread({ initial }: { initial: Msg[] }) {
  const [messages, setMessages] = useState<Msg[]>(initial);

  // realtime: novas mensagens (respostas do admin) aparecem na hora
  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getUser().then(({ data }) => {
      userId = data.user?.id ?? null;
      if (!userId) return;
      channel = supabase
        .channel("support-thread")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "support_messages",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const m = payload.new as Msg;
            setMessages((prev) =>
              prev.some((x) => x.id === m.id) ? prev : [...prev, m],
            );
          },
        )
        .subscribe();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-3">
      {messages.map((m) => (
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
    </div>
  );
}
