"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateStudyPlan(input: { goal: string; level: string; hours: string; career: string }): Promise<{ plan?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { chatComplete } = await import("@/lib/ai/openrouter");
  const system = "Você é um mentor de carreira e estudos de Python. Crie um plano completo, prático e motivador em Markdown (pt-BR). Estruture em 4 partes claras com títulos: 1) PLANO DE ESTUDOS (fases e tópicos na ordem certa), 2) PLANEJAMENTO SEMANAL (uma tabela ou lista com os dias da semana e o que estudar em cada um, respeitando as horas disponíveis), 3) GUIA DE CARREIRA (passos para chegar ao objetivo, habilidades, portfólio, como conseguir o primeiro emprego/cliente), 4) METAS (marcos de 30/60/90 dias). Seja específico e acionável.";
  const userMsg = `Monte meu plano. Objetivo: ${input.goal}. Nível atual: ${input.level}. Horas por semana: ${input.hours}. Carreira desejada: ${input.career}.`;

  const res = await chatComplete([{ role: "system", content: system }, { role: "user", content: userMsg }], { temperature: 0.6, maxTokens: 2200 });
  if (res.error || !res.content) return { error: res.error || "A IA não respondeu. Tente novamente." };
  return { plan: res.content };
}
