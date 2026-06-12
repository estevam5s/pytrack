"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SeoResult {
  error?: string;
  success?: string;
}

export async function saveSeoSettings(
  _prev: SeoResult,
  formData: FormData,
): Promise<SeoResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (title.length < 10 || title.length > 70) return { error: "Título deve ter entre 10 e 70 caracteres." };
  if (description.length < 50 || description.length > 180) return { error: "Descrição deve ter entre 50 e 180 caracteres." };

  const patch = {
    title,
    description,
    keywords: String(formData.get("keywords") ?? "").trim() || null,
    og_image: String(formData.get("og_image") ?? "").trim() || "/og-image.png",
    updated_at: new Date().toISOString(),
  };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("seo_settings").update(patch).eq("id", 1);
    if (error) return { error: error.message };
    revalidateTag("seo-settings");
    revalidatePath("/", "layout");
    revalidatePath("/admin/seo");
    return { success: "SEO atualizado e aplicado ao site!" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao salvar." };
  }
}
