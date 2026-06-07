"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ReplyResult {
  error?: string;
  success?: string;
}

export async function replyToUser(
  _prev: ReplyResult,
  formData: FormData,
): Promise<ReplyResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const userId = String(formData.get("user_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!userId || !body) return { error: "Mensagem vazia." };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("support_messages").insert({
      user_id: userId,
      sender: "admin",
      body,
      read_by_admin: true,
    });
    if (error) return { error: error.message };
    // marca as mensagens do usuário como lidas
    await admin
      .from("support_messages")
      .update({ read_by_admin: true })
      .eq("user_id", userId)
      .eq("sender", "user");

    revalidatePath("/configuracoes/admin/mensagens");
    return { success: "Resposta enviada." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao responder." };
  }
}
