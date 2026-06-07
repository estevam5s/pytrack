"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "app-releases";

export interface UploadUrlResult {
  error?: string;
  path?: string;
  token?: string;
}

/** Gera uma URL assinada para upload direto do navegador (evita limites de body). */
export async function createUploadUrl(
  platform: string,
  filename: string,
): Promise<UploadUrlResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${platform}/${Date.now()}-${safe}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) return { error: error?.message ?? "Falha ao preparar upload." };
  return { path: data.path, token: data.token };
}

export interface ReleaseResult {
  error?: string;
  success?: string;
}

/** Registra o release após o upload do arquivo. */
export async function recordRelease(
  _prev: ReleaseResult,
  formData: FormData,
): Promise<ReleaseResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const platform = String(formData.get("platform") ?? "");
  const version = String(formData.get("version") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const path = String(formData.get("path") ?? "");
  const size = Number(formData.get("size") ?? 0) || null;
  if (!platform || !path) return { error: "Dados do upload ausentes." };

  try {
    const admin = createAdminClient();
    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    const { error } = await admin.from("app_releases").insert({
      platform,
      version,
      notes,
      file_path: path,
      download_url: pub.publicUrl,
      size_bytes: size,
    });
    if (error) return { error: error.message };
    revalidatePath("/aplicativo");
    return { success: "Aplicativo publicado com sucesso!" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao publicar." };
  }
}

export async function deleteRelease(formData: FormData): Promise<void> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return;
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (!id) return;
  const admin = createAdminClient();
  if (path) await admin.storage.from(BUCKET).remove([path]);
  await admin.from("app_releases").delete().eq("id", id);
  revalidatePath("/aplicativo");
}
