"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SiteSettingsResult {
  error?: string;
  success?: string;
}

export async function saveSiteSettings(
  _prev: SiteSettingsResult,
  formData: FormData,
): Promise<SiteSettingsResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const patch = {
    default_locale: String(formData.get("default_locale") ?? "pt"),
    maintenance: formData.get("maintenance") === "on",
    signups_enabled: formData.get("signups_enabled") === "on",
    announcement: String(formData.get("announcement") ?? "").trim() || null,
    announcement_type: String(formData.get("announcement_type") ?? "info"),
    announcement_link: String(formData.get("announcement_link") ?? "").trim() || null,
    primary_contact: String(formData.get("primary_contact") ?? "").trim() || null,
    social_github: String(formData.get("social_github") ?? "").trim() || null,
    social_linkedin: String(formData.get("social_linkedin") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("site_settings").update(patch).eq("id", 1);
    if (error) return { error: error.message };
    revalidateTag("site-settings"); // reflete banner/manutenção imediatamente
    revalidatePath("/", "layout");
    revalidatePath("/admin/site");
    return { success: "Configurações do site salvas e aplicadas." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao salvar." };
  }
}
