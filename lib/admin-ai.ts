import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAiModels } from "@/lib/ai/config";

export interface OrModel {
  id: string;
  name: string;
  contextLength: number;
  promptPrice: number; // US$ por token
  completionPrice: number;
  free: boolean;
}

// Modelos configurados na plataforma (espelha lib/ai/openrouter.ts)
export const CONFIGURED = {
  nvidia: [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.1-nemotron-70b-instruct",
    "meta/llama-3.1-70b-instruct",
  ],
  openrouter: [
    "deepseek/deepseek-chat-v3-0324:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen-2.5-72b-instruct:free",
  ],
};

// Onde a IA é usada na plataforma
export const AI_FEATURES = [
  { name: "Correção de exercícios", desc: "Analisa o código, dá nota e solução ideal", route: "/exercicios" },
  { name: "Análise de projetos", desc: "Avalia projetos enviados", route: "/meus-projetos" },
  { name: "Consultor de carreira", desc: "Orientação de carreira por IA", route: "/consultor-ia" },
  { name: "Assistente IA (chat)", desc: "Chat estilo ChatGPT (Suprema)", route: "/chat" },
  { name: "Chat do site (Py)", desc: "Tira dúvidas sobre a plataforma", route: "/" },
  { name: "Plano de estudos / carreira", desc: "Planos personalizados por IA", route: "/planejamento" },
  { name: "Plano de carreira", desc: "Roadmap individual por IA", route: "/plano-carreira" },
  { name: "Construa seu SaaS", desc: "Boilerplate e plano por IA", route: "/construir-saas" },
];

export async function getOpenRouterModels(): Promise<OrModel[]> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((m: Record<string, unknown>) => {
      const pricing = (m.pricing ?? {}) as Record<string, string>;
      const prompt = parseFloat(pricing.prompt ?? "0") || 0;
      const completion = parseFloat(pricing.completion ?? "0") || 0;
      return {
        id: m.id as string,
        name: (m.name as string) ?? (m.id as string),
        contextLength: (m.context_length as number) ?? 0,
        promptPrice: prompt,
        completionPrice: completion,
        free: prompt === 0 && completion === 0,
      } as OrModel;
    });
  } catch {
    return [];
  }
}

export async function getAiAdminData() {
  const admin = createAdminClient();
  const dayAgo = new Date().toISOString().slice(0, 10);

  const [models, usageRows, configured] = await Promise.all([
    getOpenRouterModels(),
    admin.from("ai_usage").select("user_id, day, count"),
    getAiModels(),
  ]);

  const usage = usageRows.data ?? [];
  const totalCalls = usage.reduce((s, r) => s + ((r.count as number) ?? 0), 0);
  const callsToday = usage.filter((r) => r.day === dayAgo).reduce((s, r) => s + ((r.count as number) ?? 0), 0);
  const activeUsers = new Set(usage.map((r) => r.user_id)).size;

  // provedores configurados (chaves presentes)
  const providers = {
    nvidia: { active: !!process.env.NVIDIA_API_KEY, primary: !!process.env.NVIDIA_API_KEY },
    openrouter: { active: !!process.env.OPENROUTER_API_KEY, primary: !process.env.NVIDIA_API_KEY },
  };

  // enriquece os modelos configurados (do banco) com preço do catálogo OpenRouter
  const priceMap = new Map(models.map((m) => [m.id, m]));
  const enrich = (ids: string[]) => ids.map((id) => ({ id, model: priceMap.get(id) ?? null }));

  return {
    providers,
    configured: { nvidia: enrich(configured.nvidia), openrouter: enrich(configured.openrouter) },
    configuredRaw: configured,
    usage: { totalCalls, callsToday, activeUsers },
    features: AI_FEATURES,
    models, // catálogo completo do OpenRouter (para importar)
    modelCount: models.length,
    freeCount: models.filter((m) => m.free).length,
  };
}
