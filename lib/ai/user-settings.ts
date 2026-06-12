import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AiOverride } from "./openrouter";

/**
 * Carrega a configuração de IA própria do usuário logado (BYOK).
 * Retorna null se não houver, estiver desativada ou sem chave → usa o padrão.
 */
export async function getUserAiOverride(): Promise<AiOverride | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("user_ai_settings")
      .select("base_url, model, api_key, enabled")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data || !data.enabled || !data.api_key) return null;
    return {
      apiKey: data.api_key,
      model: data.model || undefined,
      baseUrl: data.base_url || undefined,
    };
  } catch {
    return null;
  }
}
