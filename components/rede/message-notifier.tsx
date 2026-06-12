"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Notificação "push" (Notification API do navegador) + refresh ao receber DM.
export function MessageNotifier({ meId }: { meId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const supabase = createClient();
    const channel = supabase
      .channel("msg-notify")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages", filter: `recipient_id=eq.${meId}` },
        async (payload) => {
          const m = payload.new as { sender_id: string; body: string };
          // não notifica se já estou na conversa com o remetente
          if (pathname === `/comunidade/mensagens/${m.sender_id}`) return;
          // nome do remetente
          const { data } = await supabase.from("users_profile").select("name, avatar_url").eq("user_id", m.sender_id).maybeSingle();
          const name = (data?.name as string) ?? "Nova mensagem";
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            const n = new Notification(`💬 ${name}`, { body: m.body.slice(0, 120), icon: (data?.avatar_url as string) || "/new-logo.png" });
            n.onclick = () => { window.focus(); router.push(`/comunidade/mensagens/${m.sender_id}`); };
          }
          router.refresh(); // atualiza badges
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [meId, pathname, router]);

  return null;
}
