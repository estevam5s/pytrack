"use server";

import { createClient } from "@/lib/supabase/server";

/** Marca o tutorial como concluído no banco (não mostra de novo, em qualquer dispositivo). */
export async function completeTutorial(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("users_profile")
    .update({ tutorial_done: true })
    .eq("user_id", user.id);
}
