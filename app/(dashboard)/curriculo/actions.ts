"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { TEMPLATES, type ResumeData } from "@/lib/resume/types";

export async function createResume(): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  if (!tierAtLeast(await getUserTier(user.id), "completo"))
    return { error: "O gerador de currículo é do plano Completo (R$19) ou superior." };

  // pré-preenche com os dados do perfil
  const { data: p } = await supabase
    .from("users_profile")
    .select("name, headline, location, website, github_url, linkedin_url, bio, skills")
    .eq("user_id", user.id)
    .maybeSingle();

  const prefill = {
    fullName: (p?.name as string) ?? "",
    headline: (p?.headline as string) ?? "",
    email: user.email ?? "",
    location: (p?.location as string) ?? "",
    website: (p?.website as string) ?? "",
    github: (p?.github_url as string) ?? "",
    linkedin: (p?.linkedin_url as string) ?? "",
    summary: (p?.bio as string) ?? "",
    skills: (p?.skills as string[]) ?? [],
  };

  const { data, error } = await supabase
    .from("resumes")
    .insert({ user_id: user.id, title: "Meu currículo", template: "classic", data: prefill })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/curriculo");
  return { id: data.id };
}

export async function saveResume(input: {
  id: string;
  title: string;
  template: string;
  data: ResumeData;
}): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  // templates Suprema exigem o plano Suprema
  const tpl = TEMPLATES.find((t) => t.id === input.template);
  if (tpl?.suprema && !tierAtLeast(await getUserTier(user.id), "suprema")) {
    return { error: "Este modelo é exclusivo do plano Suprema (R$46)." };
  }

  const { error } = await supabase
    .from("resumes")
    .update({ title: input.title, template: input.template, data: input.data, updated_at: new Date().toISOString() })
    .eq("id", input.id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/curriculo");
  return { ok: true };
}

// Torna o currículo público (link compartilhável) e devolve a URL.
export async function publishResume(id: string, isPublic: boolean): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { error } = await supabase.from("resumes").update({ is_public: isPublic }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br";
  return { url: isPublic ? `${base}/cv/${id}` : undefined };
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("resumes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/curriculo");
}
