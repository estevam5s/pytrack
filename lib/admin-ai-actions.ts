"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

export async function saveAiModels(input: { nvidia: string[]; openrouter: string[] }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return { error: "Não autorizado." };

  const clean = (arr: string[]) => [...new Set(arr.map((s) => s.trim()).filter(Boolean))].slice(0, 12);
  const nvidia = clean(input.nvidia);
  const openrouter = clean(input.openrouter);
  if (nvidia.length === 0 && openrouter.length === 0) return { error: "Configure ao menos um modelo." };

  const admin = createAdminClient();
  const { error } = await admin.from("ai_settings").upsert({
    id: "default",
    nvidia_models: nvidia,
    openrouter_models: openrouter,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };

  revalidateTag("ai-models");
  revalidatePath("/admin/ia");
  return { ok: true };
}

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && isAdmin(user.email);
}

// Define o provedor padrão (auto = pela env, ou força nvidia/openrouter).
export async function saveAiProvider(provider: "auto" | "nvidia" | "openrouter") {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const admin = createAdminClient();
  const { error } = await admin.from("ai_settings").upsert({ id: "default", provider, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  revalidateTag("ai-models");
  revalidatePath("/admin/ia");
  return { ok: true };
}

// Testa um modelo: envia um prompt e mede a latência.
export async function testModel(modelId: string, provider: "nvidia" | "openrouter") {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const { chatComplete } = await import("@/lib/ai/openrouter");
  const baseUrl = provider === "nvidia" ? "https://integrate.api.nvidia.com/v1" : "https://openrouter.ai/api/v1";
  const apiKey = provider === "nvidia" ? process.env.NVIDIA_API_KEY : process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { error: `Sem chave para ${provider}. Configure a variável de ambiente.` };
  const start = Date.now();
  const res = await chatComplete(
    [{ role: "user", content: "Em uma frase curta, o que é Python? Responda em português." }],
    { maxTokens: 80, temperature: 0.3 },
    { model: modelId, baseUrl, apiKey },
  );
  const ms = Date.now() - start;
  if (res.error) return { error: res.error, ms };
  return { ok: true, ms, content: res.content, model: res.model ?? modelId };
}
