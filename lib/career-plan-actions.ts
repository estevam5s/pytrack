"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TRILHAS } from "@/lib/trilhas";

export interface CareerAnswers {
  objetivo: string;     // o que quer alcançar
  nivel: string;        // nível atual
  area: string;         // área de interesse
  tempo: string;        // horas/semana
  prazo: string;        // em quanto tempo
  contexto?: string;    // momento de carreira (texto livre)
}

// Gera (ou regenera) o plano de carreira personalizado com IA. Suprema.
export async function generateCareerPlan(answers: CareerAnswers): Promise<{ plan?: string; tracks?: string[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const trilhasList = TRILHAS.filter((t) => t.id !== "suprema").map((t) => `${t.id} — ${t.title} (${t.level})`).join("; ");

  const { chatComplete } = await import("@/lib/ai/openrouter");
  const system =
    "Você é um mentor de carreira sênior em tecnologia/Python. Com base no perfil do aluno, recomende um caminho de trilhas da PyTrack na ORDEM ideal e explique o porquê. " +
    "Responda em Markdown (pt-BR), conciso e acionável, com seções: 1) DIAGNÓSTICO (1 parágrafo), 2) SUA JORNADA (lista ordenada das trilhas recomendadas com 1 linha de justificativa cada), 3) METAS 30/60/90 DIAS, 4) PRÓXIMO PASSO. " +
    "No FINAL, em uma única linha, escreva exatamente: TRACKS: id1, id2, id3 (apenas os ids das trilhas recomendadas, na ordem, escolhidos da lista fornecida).";
  const userMsg =
    `Trilhas disponíveis (id — título (nível)): ${trilhasList}.\n\n` +
    `Perfil do aluno:\n- Objetivo: ${answers.objetivo}\n- Nível atual: ${answers.nivel}\n- Área de interesse: ${answers.area}\n- Horas/semana: ${answers.tempo}\n- Prazo: ${answers.prazo}\n- Momento de carreira: ${answers.contexto || "—"}`;

  const res = await chatComplete([{ role: "system", content: system }, { role: "user", content: userMsg }], { temperature: 0.6, maxTokens: 1600 });
  if (res.error || !res.content) return { error: res.error || "IA indisponível. Tente novamente." };
  const content = res.content;

  // extrai os ids recomendados da linha TRACKS:
  const validIds = new Set(TRILHAS.map((t) => t.id));
  const m = content.match(/TRACKS:\s*(.+)$/im);
  let tracks = m ? m[1].split(",").map((s) => s.trim().toLowerCase()).filter((id) => validIds.has(id)) : [];
  if (tracks.length === 0) {
    // fallback: extrai ids citados no texto
    tracks = TRILHAS.filter((t) => content.toLowerCase().includes(t.id)).map((t) => t.id).slice(0, 6);
  }
  const plan = content.replace(/TRACKS:.*$/im, "").trim();

  await supabase.from("career_plans").upsert(
    { user_id: user.id, answers, plan, recommended_tracks: tracks, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  revalidatePath("/minhas-trilhas");
  revalidatePath("/evolucao");
  return { plan, tracks };
}

export async function getCareerPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("career_plans").select("answers, plan, recommended_tracks, updated_at").eq("user_id", user.id).maybeSingle();
  return data;
}

export async function clearCareerPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("career_plans").delete().eq("user_id", user.id);
  revalidatePath("/minhas-trilhas");
  revalidatePath("/evolucao");
  return { ok: true };
}
