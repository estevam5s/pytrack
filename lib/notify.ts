import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

type NotifType = "info" | "success" | "community" | "support" | "system" | "plan" | "level";

/** Cria uma notificação para um usuário (respeita as preferências de tipo). */
export async function notifyUser(
  userId: string,
  input: { type: NotifType; title: string; body?: string; link?: string },
): Promise<void> {
  try {
    const admin = createAdminClient();
    // respeita as preferências do usuário (se desativou aquele tipo, não cria)
    const { data: prof } = await admin
      .from("users_profile")
      .select("notif_prefs")
      .eq("user_id", userId)
      .maybeSingle();
    const prefs = (prof?.notif_prefs ?? {}) as Record<string, boolean>;
    const cat =
      input.type === "plan"
        ? "plan"
        : input.type === "community"
          ? "community"
          : input.type === "support"
            ? "support"
            : "system";
    if (prefs[cat] === false) return;

    await admin.from("notifications").insert({
      user_id: userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
    });
  } catch {
    /* não bloqueia o fluxo */
  }
}
