"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { chatComplete } from "@/lib/ai/openrouter";

export interface AiSettingsResult {
  error?: string;
  success?: string;
}

function parse(formData: FormData) {
  return {
    provider: String(formData.get("provider") ?? "openrouter").trim() || "openrouter",
    base_url: String(formData.get("base_url") ?? "").trim() || null,
    model: String(formData.get("model") ?? "").trim() || null,
    api_key: String(formData.get("api_key") ?? "").trim(),
    enabled: formData.get("enabled") === "on",
  };
}

export async function saveAiSettings(
  _prev: AiSettingsResult,
  formData: FormData,
): Promise<AiSettingsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const f = parse(formData);
  const { data: existing } = await supabase
    .from("user_ai_settings")
    .select("api_key")
    .eq("user_id", user.id)
    .maybeSingle();
  const finalKey = f.api_key || existing?.api_key || null;

  if (f.enabled && !finalKey) {
    return { error: "Informe a chave de API para ativar a sua IA." };
  }

  const { error } = await supabase.from("user_ai_settings").upsert(
    {
      user_id: user.id,
      provider: f.provider,
      base_url: f.base_url,
      model: f.model,
      api_key: finalKey,
      enabled: f.enabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { error: error.message };

  revalidatePath("/configuracoes/ia");
  return {
    success: f.enabled
      ? "IA personalizada ativada e salva!"
      : "Configuração salva. Sua IA personalizada está desativada (usando o padrão).",
  };
}

export async function testAiSettings(
  _prev: AiSettingsResult,
  formData: FormData,
): Promise<AiSettingsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const f = parse(formData);
  let key = f.api_key;
  if (!key) {
    const { data } = await supabase
      .from("user_ai_settings")
      .select("api_key")
      .eq("user_id", user.id)
      .maybeSingle();
    key = data?.api_key ?? "";
  }
  if (!key) return { error: "Informe a chave de API para testar." };

  const res = await chatComplete(
    [{ role: "user", content: "Responda apenas: ok" }],
    { maxTokens: 5, temperature: 0 },
    { apiKey: key, model: f.model || undefined, baseUrl: f.base_url || undefined },
  );
  if (res.error) return { error: `Falhou: ${res.error}` };
  return { success: `Conexão OK! Modelo respondeu (${res.model ?? "modelo"}).` };
}
