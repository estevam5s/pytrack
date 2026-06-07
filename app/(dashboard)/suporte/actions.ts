"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export interface SupportResult {
  error?: string;
  success?: string;
}

export async function sendSupportMessage(
  _prev: SupportResult,
  formData: FormData,
): Promise<SupportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  // anti-spam: 5 mensagens por minuto
  if (!(await rateLimit(`support:${user.id}`, 5, 60))) {
    return { error: "Você enviou muitas mensagens. Aguarde um pouco." };
  }

  const subject = String(formData.get("subject") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Escreva sua mensagem." };

  const { error } = await supabase.from("support_messages").insert({
    user_id: user.id,
    sender: "user",
    subject,
    body,
    read_by_user: true,
  });
  if (error) return { error: error.message };

  revalidatePath("/suporte");
  return { success: "Mensagem enviada! Nossa equipe responde por aqui." };
}
