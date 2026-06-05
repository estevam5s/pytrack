import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
    cacheControl: "3600",
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
