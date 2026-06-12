"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

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

  // notifica a equipe por e-mail (fail-safe — não bloqueia se falhar)
  await sendEmail({
    subject: `[Suporte PyTrack] ${subject ?? "Nova mensagem"} — ${user.email}`,
    text: `De: ${user.email}\nAssunto: ${subject ?? "(sem assunto)"}\n\n${body}`,
    html: `<p><strong>De:</strong> ${user.email}</p><p><strong>Assunto:</strong> ${subject ?? "(sem assunto)"}</p><hr/><p>${body.replace(/\n/g, "<br/>")}</p>`,
    replyTo: user.email ?? undefined,
  }).catch(() => {});

  revalidatePath("/suporte");
  return { success: "Mensagem enviada! Nossa equipe responde por aqui (e por e-mail)." };
}
