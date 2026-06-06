"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/types";

/** Define o status de um conteúdo para o usuário atual (upsert em progress). */
export async function setContentStatus(
  contentId: string,
  status: ContentStatus,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const percentage =
    status === "concluido" ? 100 : status === "em_andamento" ? 25 : 0;

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      content_id: contentId,
      status,
      progress_percentage: percentage,
      completed_at: status === "concluido" ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,content_id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/conteudos");
  revalidatePath("/evolucao");
  revalidatePath("/inicio");
  return { ok: true };
}

/** Atualiza a porcentagem de progresso e ajusta o status automaticamente. */
export async function setContentProgress(
  contentId: string,
  percentage: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const status: ContentStatus =
    percentage >= 100
      ? "concluido"
      : percentage > 0
        ? "em_andamento"
        : "nao_iniciado";

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      content_id: contentId,
      status,
      progress_percentage: Math.max(0, Math.min(100, percentage)),
      completed_at: percentage >= 100 ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,content_id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/conteudos");
  revalidatePath("/evolucao");
  return { ok: true };
}

/** Sincroniza o progresso de um módulo (por slug) a partir das lições lidas. */
export async function setModuleProgressBySlug(slug: string, percentage: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: content } = await supabase
    .from("contents")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!content) return { error: "Módulo não encontrado" };

  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  const status: ContentStatus =
    pct >= 100 ? "concluido" : pct > 0 ? "em_andamento" : "nao_iniciado";

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      content_id: content.id,
      status,
      progress_percentage: pct,
      completed_at: pct >= 100 ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,content_id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/conteudos");
  revalidatePath("/evolucao");
  revalidatePath("/inicio");
  return { ok: true };
}

/** Reseta todo o progresso do usuário. */
export async function resetProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export interface ProfileInput {
  name?: string;
  goal?: string;
  current_level?: "basico" | "intermediario" | "avancado";
  bio?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
  avatar_url?: string;
}

/** Atualiza o perfil do usuário (somente os campos enviados). */
export async function updateProfile(input: ProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) patch[k] = v;
  }

  const { error } = await supabase
    .from("users_profile")
    .update(patch)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/perfil");
  return { ok: true };
}
