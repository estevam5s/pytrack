import "server-only";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  // senhas de app do Gmail são exibidas com espaços; o valor real não os tem
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export interface SendEmailInput {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  to?: string;
}

/** Envia e-mail via Resend (se configurado) ou Gmail SMTP. Fail-safe. */
export async function sendEmail(
  input: SendEmailInput,
): Promise<{ ok?: true; error?: string }> {
  const to = input.to || process.env.CONTACT_TO || process.env.GMAIL_USER!;

  // 1) Resend (melhor entregabilidade) — usado se RESEND_API_KEY estiver setado
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.RESEND_FROM || "PyTrack <onboarding@resend.dev>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject: input.subject, text: input.text, html: input.html, reply_to: input.replyTo }),
      });
      if (res.ok) return { ok: true };
      const err = await res.text();
      return { error: `Resend: ${err.slice(0, 160)}` };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Falha no Resend." };
    }
  }

  // 2) fallback: Gmail SMTP
  const t = getTransporter();
  if (!t) return { error: "E-mail não configurado." };
  try {
    await t.sendMail({
      from: `"PyTrack" <${process.env.GMAIL_USER}>`,
      to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao enviar e-mail." };
  }
}
