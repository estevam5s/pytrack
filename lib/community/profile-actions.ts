"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

const TABLES = {
  experiencia: "community_experiences",
  formacao: "community_education",
  certificado: "community_certificates",
  premio: "community_awards",
  idioma: "community_languages",
  prova: "community_test_scores",
} as const;
export type ProfileSection = keyof typeof TABLES;

function revalidate(userId: string) {
  revalidatePath(`/comunidade/perfil/${userId}`);
  revalidatePath("/comunidade/eu");
}

// cria/atualiza um item de uma seção do perfil
export async function saveProfileItem(section: ProfileSection, data: Record<string, unknown>, id?: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const table = TABLES[section];
  // normaliza skills (string separada por vírgula → array)
  if (typeof data.skills === "string") {
    data.skills = (data.skills as string).split(",").map((s) => s.trim()).filter(Boolean);
  }
  const payload = { ...data, user_id: user.id };
  const { error } = id
    ? await supabase.from(table).update(payload).eq("id", id).eq("user_id", user.id)
    : await supabase.from(table).insert(payload);
  if (error) return { error: error.message };
  revalidate(user.id);
  return { ok: true };
}

export async function deleteProfileItem(section: ProfileSection, id: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from(TABLES[section]).delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidate(user.id);
  return { ok: true };
}

// URL pública (vanity) + idioma do perfil
export async function saveVanityUrl(vanity: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const slug = vanity.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  if (slug.length < 3) return { error: "A URL deve ter ao menos 3 caracteres." };
  // checa disponibilidade
  const { data: taken } = await supabase.from("users_profile").select("user_id").ilike("vanity_url", slug).neq("user_id", user.id).maybeSingle();
  if (taken) return { error: "Essa URL já está em uso." };
  const { error } = await supabase.from("users_profile").update({ vanity_url: slug }).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidate(user.id);
  return { ok: true, slug };
}

export async function saveProfileLang(lang: "pt" | "en") {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("users_profile").update({ profile_lang: lang }).eq("user_id", user.id);
  revalidate(user.id);
  return { ok: true };
}

// recomendações
export async function saveRecommendation(targetId: string, relationship: string, body: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (user.id === targetId) return { error: "Você não pode recomendar a si mesmo." };
  if (!body.trim()) return { error: "Escreva a recomendação." };
  const { error } = await supabase.from("community_recommendations").upsert(
    { author_id: user.id, target_id: targetId, relationship, body: body.trim(), status: "visible" },
    { onConflict: "author_id,target_id" },
  );
  if (error) return { error: error.message };
  revalidatePath(`/comunidade/perfil/${targetId}`);
  return { ok: true };
}

export async function deleteRecommendation(id: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("community_recommendations").delete().eq("id", id).eq("author_id", user.id);
  return { ok: true };
}

// página de serviços
export async function saveServices(input: {
  is_open?: boolean; overview?: string; services?: string; affiliated_company?: string; affiliated_company_logo?: string; media_urls?: string;
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const payload: Record<string, unknown> = { user_id: user.id, updated_at: new Date().toISOString() };
  if (input.is_open !== undefined) payload.is_open = input.is_open;
  if (input.overview !== undefined) payload.overview = input.overview;
  if (input.affiliated_company !== undefined) payload.affiliated_company = input.affiliated_company;
  if (input.affiliated_company_logo !== undefined) payload.affiliated_company_logo = input.affiliated_company_logo;
  if (input.services !== undefined) payload.services = input.services.split(",").map((s) => s.trim()).filter(Boolean);
  if (input.media_urls !== undefined) payload.media_urls = input.media_urls.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  const { error } = await supabase.from("community_services").upsert(payload, { onConflict: "user_id" });
  if (error) return { error: error.message };
  revalidate(user.id);
  return { ok: true };
}
