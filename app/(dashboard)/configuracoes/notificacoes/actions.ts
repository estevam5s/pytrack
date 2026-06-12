"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveNotifPrefs(prefs: Record<string, boolean>): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { error } = await supabase
    .from("users_profile")
    .update({ notif_prefs: prefs })
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/configuracoes/notificacoes");
  return { ok: true };
}
