"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitFeedback(input: { rating: number; category: string; message: string; page?: string }) {
  if (!input.message.trim() || input.message.trim().length < 3) return { error: "Escreva um pouco mais, por favor." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  try {
    const admin = createAdminClient();
    await admin.from("site_feedback").insert({
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      rating: input.rating >= 1 && input.rating <= 5 ? input.rating : null,
      category: input.category || "geral",
      message: input.message.trim().slice(0, 4000),
      page: input.page?.slice(0, 200) ?? null,
    });
    // avisa o admin
    const { sendEmail } = await import("@/lib/email");
    await sendEmail({
      subject: `💬 Novo feedback (${input.rating}★) — ${input.category}`,
      text: `De: ${user?.email ?? "anônimo"}\nNota: ${input.rating}/5\nCategoria: ${input.category}\nPágina: ${input.page ?? "-"}\n\n${input.message}`,
    }).catch(() => {});
  } catch {
    return { error: "Não foi possível enviar agora. Tente novamente." };
  }
  return { ok: true };
}
