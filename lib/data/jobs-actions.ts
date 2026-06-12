"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchUrlMeta } from "@/lib/data/meta";
import { chatJson } from "@/lib/ai/openrouter";
import type { JobInput } from "@/types";

export interface JobExtraction extends JobInput {
  error?: string;
  model?: string;
}

interface RawJob {
  title?: string;
  company?: string;
  type?: string;
  seniority?: string;
  salary?: string;
  modality?: string;
  location?: string;
  description?: string;
  skills?: unknown;
  stack?: unknown;
}

/**
 * Extrai dados estruturados de uma vaga a partir de uma URL (Open Graph) e/ou
 * do texto colado, usando IA. Funciona mesmo quando o site (ex.: LinkedIn)
 * bloqueia o scraping completo.
 */
export async function analyzeJob(input: {
  url?: string;
  text?: string;
}): Promise<JobExtraction> {
  let context = (input.text ?? "").trim();

  if (input.url) {
    const meta = await fetchUrlMeta(input.url);
    if (!meta.error) {
      context =
        `${meta.title ?? ""}\n${meta.description ?? ""}\n${context}`.trim();
    }
  }

  if (context.length < 15) {
    return {
      title: "",
      error:
        "Cole a descrição da vaga (ou um link com dados públicos) para a IA analisar.",
    };
  }

  const res = await chatJson<RawJob>(
    [
      {
        role: "system",
        content:
          "Você extrai dados estruturados de vagas de TI. A partir do texto da vaga, retorne SOMENTE um JSON válido com as chaves: " +
          "title (cargo), company (empresa), type (CLT, PJ, Estágio, Freelance ou Não informado), " +
          "seniority (Júnior, Pleno, Sênior, Especialista ou Não informado), salary (faixa salarial ou 'Não informado'), " +
          "modality (remoto, presencial, híbrido ou 'Não informado'), location (cidade/UF ou 'Remoto'), " +
          "description (resumo claro da vaga em pt-BR, até 600 caracteres), " +
          "skills (array de habilidades/soft skills exigidas), stack (array de tecnologias exigidas ou sugeridas). " +
          "Se algo não estiver no texto, infira de forma conservadora ou use 'Não informado'.",
      },
      { role: "user", content: context.slice(0, 8000) },
    ],
    { maxTokens: 900, temperature: 0.2 },
  );

  if (!res.data) {
    return {
      title: "",
      error: res.error ?? "A IA não conseguiu interpretar a vaga. Tente novamente.",
      model: res.model,
    };
  }

  const d = res.data;
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return {
    title: String(d.title ?? ""),
    company: d.company ? String(d.company) : null,
    type: d.type ? String(d.type) : null,
    seniority: d.seniority ? String(d.seniority) : null,
    salary: d.salary ? String(d.salary) : null,
    modality: d.modality ? String(d.modality) : null,
    location: d.location ? String(d.location) : null,
    description: d.description ? String(d.description) : null,
    skills: arr(d.skills),
    stack: arr(d.stack),
    url: input.url ?? null,
    model: res.model,
  };
}

export async function createJob(input: JobInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("jobs")
    .insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/vagas");
  return { ok: true };
}

export async function updateJob(id: string, input: JobInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("jobs")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/vagas");
  return { ok: true };
}

export async function deleteJob(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/vagas");
  return { ok: true };
}
