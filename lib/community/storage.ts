"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "community-post-images";
const MAX_BYTES = 5 * 1024 * 1024;
const MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function validateImage(file: File): string | null {
  if (!MIME.includes(file.type)) return "Formato inválido (use JPG, PNG ou WEBP).";
  if (file.size > MAX_BYTES) return "Imagem muito grande (máximo 5MB).";
  return null;
}

export async function uploadCommunityImage(file: File): Promise<string> {
  const err = validateImage(file);
  if (err) throw new Error(err);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${user.id}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
