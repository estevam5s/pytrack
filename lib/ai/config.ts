import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Modelos padrão (fallback se o admin não configurou nada no painel).
export const DEFAULT_NVIDIA_MODELS = [
  "meta/llama-3.3-70b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "meta/llama-3.1-70b-instruct",
];
export const DEFAULT_OPENROUTER_MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

export type AiProvider = "auto" | "nvidia" | "openrouter";

async function fetchModels(): Promise<{ nvidia: string[]; openrouter: string[]; provider: AiProvider }> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("ai_settings")
      .select("nvidia_models, openrouter_models, provider")
      .eq("id", "default")
      .maybeSingle();
    const nv = data?.nvidia_models as string[] | undefined;
    const or = data?.openrouter_models as string[] | undefined;
    return {
      nvidia: Array.isArray(nv) && nv.length ? nv : DEFAULT_NVIDIA_MODELS,
      openrouter: Array.isArray(or) && or.length ? or : DEFAULT_OPENROUTER_MODELS,
      provider: (data?.provider as AiProvider) ?? "auto",
    };
  } catch {
    return { nvidia: DEFAULT_NVIDIA_MODELS, openrouter: DEFAULT_OPENROUTER_MODELS, provider: "auto" };
  }
}

// Decide o provedor efetivo: config do painel ('auto' = pela env NVIDIA_API_KEY).
export function resolveProvider(configured: AiProvider): "nvidia" | "openrouter" {
  if (configured === "nvidia") return "nvidia";
  if (configured === "openrouter") return "openrouter";
  return process.env.NVIDIA_API_KEY ? "nvidia" : "openrouter";
}

// cacheado (revalida a cada 60s ou na hora ao salvar, via tag "ai-models")
export const getAiModels = unstable_cache(fetchModels, ["ai-models-config"], {
  revalidate: 60,
  tags: ["ai-models"],
});
