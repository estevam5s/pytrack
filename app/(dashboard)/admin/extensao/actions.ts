"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateExtensionMeta(input: {
  version: string;
  marketplace_url: string;
  changelog: string;
}): Promise<{ ok?: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user.email)) return { error: "Sem permissão." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("extension_meta")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/admin/extensao");
  revalidatePath("/extensao");
  return { ok: true };
}

export async function uploadVsix(formData: FormData): Promise<{ ok?: boolean; error?: string; path?: string }> {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user.email)) return { error: "Sem permissão." };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "Selecione um arquivo .vsix." };
  if (!file.name.endsWith(".vsix")) return { error: "O arquivo deve ser .vsix." };
  if (file.size > 50 * 1024 * 1024) return { error: "Arquivo muito grande (máx. 50MB)." };

  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const path = file.name;

  const { error: upErr } = await admin.storage
    .from("extension")
    .upload(path, buffer, { contentType: "application/octet-stream", upsert: true });
  if (upErr) return { error: upErr.message };

  // aponta o vsix_path para o novo arquivo
  await admin.from("extension_meta").update({ vsix_path: path, updated_at: new Date().toISOString() }).eq("id", 1);
  revalidatePath("/admin/extensao");
  revalidatePath("/extensao");
  return { ok: true, path };
}
