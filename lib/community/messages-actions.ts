"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function sendMessage(recipientId: string, body: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (!body.trim()) return { error: "Mensagem vazia" };
  if (recipientId === user.id) return { error: "Você não pode enviar mensagem para si mesmo." };
  const clean = body.trim().slice(0, 4000);
  const { error } = await supabase.from("community_messages").insert({
    sender_id: user.id, recipient_id: recipientId, body: clean,
  });
  if (error) return { error: error.message };

  // notificação para o destinatário (sino + realtime) — admin client (bypassa RLS)
  try {
    const admin = createAdminClient();
    const { data: prof } = await admin.from("users_profile").select("name").eq("user_id", user.id).maybeSingle();
    const sender = (prof?.name as string) || "Alguém";
    await admin.from("notifications").insert({
      user_id: recipientId,
      type: "message",
      title: `💬 Nova mensagem de ${sender}`,
      body: clean.slice(0, 120),
      link: `/comunidade/mensagens/${user.id}`,
      is_read: false,
    });
    await admin.from("community_notifications").insert({
      user_id: recipientId, actor_id: user.id, type: "message", message: "enviou uma mensagem para você", read: false,
    });
  } catch { /* notificação é best-effort */ }

  revalidatePath(`/comunidade/mensagens/${recipientId}`);
  revalidatePath("/comunidade/mensagens");
  return { ok: true };
}

export async function markConversationRead(otherId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("community_messages").update({ read: true })
    .eq("recipient_id", user.id).eq("sender_id", otherId).eq("read", false);
  return { ok: true };
}
