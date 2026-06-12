import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

interface BroadcastInput {
  title: string;
  body?: string | null;
  link?: string | null;
  type?: string;
  audience?: "all" | "paid";
  popup?: boolean; // se true, aparece como popup (is_broadcast)
}

/**
 * Envia uma notificação para todos os usuários (ou só assinantes).
 * Reutilizado por /admin/avisos e por eventos automáticos (ex.: nova versão de app).
 */
export async function broadcastToUsers(input: BroadcastInput): Promise<{ sent: number; error?: string }> {
  const { title, body = null, link = null, type = "system", audience = "all", popup = true } = input;
  if (!title) return { sent: 0, error: "Título obrigatório." };

  try {
    const admin = createAdminClient();
    let userIds: string[] = [];
    if (audience === "paid") {
      const { data } = await admin.from("subscriptions").select("user_id").in("status", ["active", "trialing"]);
      userIds = [...new Set((data ?? []).map((r) => r.user_id as string))];
    } else {
      const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
      userIds = (data?.users ?? []).map((u) => u.id);
    }
    if (userIds.length === 0) return { sent: 0 };

    const rows = userIds.map((uid) => ({
      user_id: uid,
      type,
      title,
      body,
      link,
      is_read: false,
      is_broadcast: popup,
    }));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await admin.from("notifications").insert(rows.slice(i, i + 500));
      if (error) return { sent: i, error: error.message };
    }
    return { sent: userIds.length };
  } catch (e) {
    return { sent: 0, error: e instanceof Error ? e.message : "Erro no broadcast." };
  }
}
