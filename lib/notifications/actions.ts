"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function deleteNotification(id: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from("notifications").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/notificacoes");
  return { ok: true };
}

export async function clearAllNotifications() {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from("notifications").delete().eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/notificacoes");
  return { ok: true };
}

export async function markAllNotificationsRead() {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  revalidatePath("/notificacoes");
  return { ok: true };
}
