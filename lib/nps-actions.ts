"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitNps(input: { score: number | null; reason?: string }) {
  if (input.score === null || input.score < 0 || input.score > 10) return { error: "Nota inválida." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  try {
    await createAdminClient().from("nps_responses").insert({
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      score: input.score,
      reason: input.reason?.trim().slice(0, 2000) || null,
    });
  } catch {
    return { error: "Não foi possível salvar agora." };
  }
  return { ok: true };
}
