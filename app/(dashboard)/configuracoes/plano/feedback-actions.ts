"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

export async function saveCancellationFeedback(input: {
  action: "refund" | "cancel" | "downgrade";
  reason: string;
  improvement?: string;
  details?: string;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  try {
    const admin = createAdminClient();
    await admin.from("cancellation_feedback").insert({
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      action: input.action,
      reason: input.reason,
      improvement: input.improvement ?? null,
      details: input.details ?? null,
    });
    // avisa o admin por e-mail
    await sendEmail({
      subject: `[Feedback ${input.action}] ${user?.email ?? "usuário"}`,
      text: `Ação: ${input.action}\nUsuário: ${user?.email}\nMotivo: ${input.reason}\nMelhoria: ${input.improvement ?? "-"}\nDetalhes: ${input.details ?? "-"}`,
    }).catch(() => {});
  } catch {
    /* não bloqueia o cancelamento se o feedback falhar */
  }
}
