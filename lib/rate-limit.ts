import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Rate limit por janela fixa (DB). Retorna true se DENTRO do limite (permitido),
 * false se excedeu. Fail-open: em erro, permite (não derruba o produto).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("rl_hit", {
      p_key: key,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return (data as number) <= limit;
  } catch {
    return true;
  }
}
