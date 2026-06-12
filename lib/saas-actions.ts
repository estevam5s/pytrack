"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StackChoice } from "@/lib/saas-builder";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createSaasProject(input: { name: string; idea: string; stack: StackChoice }) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (!input.name.trim()) return { error: "Dê um nome ao seu SaaS." };
  const { error } = await supabase.from("saas_projects").upsert(
    { user_id: user.id, name: input.name.trim(), idea: input.idea.trim(), stack: input.stack, steps_done: [], updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) return { error: error.message };
  revalidatePath("/construir-saas");
  return { ok: true };
}

export async function toggleSaasStep(stepId: string, done: boolean) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { data: proj } = await supabase.from("saas_projects").select("steps_done").eq("user_id", user.id).maybeSingle();
  const cur = new Set((proj?.steps_done as string[]) ?? []);
  if (done) cur.add(stepId); else cur.delete(stepId);
  await supabase.from("saas_projects").update({ steps_done: [...cur], updated_at: new Date().toISOString() }).eq("user_id", user.id);
  revalidatePath("/construir-saas");
  return { ok: true };
}

export async function setSaasRepo(repoUrl: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("saas_projects").update({ repo_url: repoUrl.trim() || null }).eq("user_id", user.id);
  revalidatePath("/construir-saas");
  return { ok: true };
}

export async function resetSaasProject() {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("saas_projects").delete().eq("user_id", user.id);
  revalidatePath("/construir-saas");
  return { ok: true };
}

// Gera boilerplate de código REAL com IA, adaptado à stack escolhida.
export async function generateBoilerplate(): Promise<{ code?: string; error?: string }> {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { data: proj } = await supabase.from("saas_projects").select("name, idea, stack").eq("user_id", user.id).maybeSingle();
  if (!proj) return { error: "Crie seu projeto primeiro." };

  const { optLabel } = await import("@/lib/saas-builder");
  const stack = (proj.stack ?? {}) as Record<string, string>;
  const stackTxt = Object.entries(stack).filter(([, v]) => v && v !== "none").map(([k, v]) => `${k}: ${optLabel(k as never, v)}`).join(", ");

  const { chatComplete } = await import("@/lib/ai/openrouter");
  const system = "Você é um engenheiro de software sênior. Gere boilerplate de código REAL, idiomático e pronto para rodar, em Markdown com blocos de código por arquivo (com o caminho do arquivo como comentário no topo). Seja conciso mas completo: estrutura de pastas, configuração principal, um modelo, um endpoint/rota de exemplo, e o arquivo de dependências. Responda em pt-BR nas explicações curtas entre os blocos.";
  const userMsg = `Gere o boilerplate inicial para um SaaS chamado "${proj.name}".\nIdeia: ${proj.idea || "—"}.\nStack escolhida: ${stackTxt}.\n\nInclua: estrutura de diretórios, arquivo principal do backend, um modelo de dados, uma rota de exemplo (ex.: health + um CRUD simples), configuração de ambiente (.env.example) e o arquivo de dependências (requirements.txt/pyproject ou package.json conforme a stack). Mantenha enxuto (~150 linhas no total).`;

  const res = await chatComplete([{ role: "system", content: system }, { role: "user", content: userMsg }], { temperature: 0.4, maxTokens: 2200 });
  if (res.error || !res.content) return { error: res.error || "A IA não respondeu. Tente novamente." };
  return { code: res.content };
}
