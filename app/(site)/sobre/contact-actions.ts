"use server";

import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export interface ContactResult {
  error?: string;
  success?: string;
}

export async function sendContactMessage(
  _prev: ContactResult,
  formData: FormData,
): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // honeypot anti-bot
  if (String(formData.get("company") ?? "")) return { success: "Mensagem enviada!" };

  if (!name || !email || !message) return { error: "Preencha todos os campos." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "E-mail inválido." };

  if (!(await rateLimit(`contact:${email.toLowerCase()}`, 3, 600))) {
    return { error: "Muitas mensagens. Tente novamente em alguns minutos." };
  }

  const res = await sendEmail({
    subject: `[Contato PyTrack] ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p><p><strong>E-mail:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
    replyTo: email,
  });
  if (res.error) return { error: "Não foi possível enviar agora. Tente o e-mail direto." };
  return { success: "Mensagem enviada! Responderemos no seu e-mail." };
}
