"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

export async function deleteMyAccount(): Promise<{ error?: string } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  if (isAdmin(user.email)) {
    return { error: "Contas de administrador não podem ser excluídas por aqui." };
  }

  try {
    const admin = createAdminClient();
    // remove dados pessoais explícitos + o usuário (cascata cobre o resto via FK)
    await admin.from("user_ai_settings").delete().eq("user_id", user.id);
    await admin.from("support_messages").delete().eq("user_id", user.id);
    await admin.auth.admin.deleteUser(user.id);
    await supabase.auth.signOut();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao excluir a conta." };
  }
  redirect("/");
}
