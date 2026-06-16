"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && isAdmin(user.email);
}

// Define a URL do logo (configurável pelo painel; salva no Supabase).
export async function saveLogoUrl(url: string) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const clean = url.trim();
  if (clean && !/^(https?:\/\/|\/)/.test(clean)) return { error: "Use uma URL (https://…) ou caminho (/…)." };
  const admin = createAdminClient();
  const { error } = await admin.from("site_settings").update({ logo_url: clean || null, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateTag("site-settings");
  revalidatePath("/", "layout");
  return { ok: true };
}

// Upload de um arquivo de logo para o Storage e define como logo.
export async function uploadLogo(formData: FormData) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Selecione um arquivo." };
  if (file.size > 3_000_000) return { error: "Arquivo muito grande (máx. 3MB)." };
  const admin = createAdminClient();
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `logo-${Date.now()}.${ext}`;
  try {
    // garante o bucket público "branding"
    await admin.storage.createBucket("branding", { public: true }).catch(() => {});
    const { error: upErr } = await admin.storage.from("branding").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) return { error: upErr.message };
    const { data } = admin.storage.from("branding").getPublicUrl(path);
    const url = data.publicUrl;
    await admin.from("site_settings").update({ logo_url: url, updated_at: new Date().toISOString() }).eq("id", 1);
    revalidateTag("site-settings");
    revalidatePath("/", "layout");
    return { ok: true, url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha no upload." };
  }
}
