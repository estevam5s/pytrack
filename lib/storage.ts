import { createClient } from "@/lib/supabase/client";
import { validateUpload, safeStoragePath } from "@/lib/upload-validation";

export interface UploadResult {
  url?: string;
  error?: string;
}

/** Faz upload de um arquivo para um bucket público do Supabase Storage. */
export async function uploadToBucket(
  bucket: string,
  file: File,
  userId: string,
): Promise<UploadResult> {
  // validação: tamanho, extensão e MIME por bucket + nome seguro
  const v = validateUpload(bucket, { name: file.name, size: file.size, type: file.type });
  if (!v.ok) return { error: v.error };

  const supabase = createClient();
  const path = safeStoragePath(userId, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
    cacheControl: "3600",
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
