"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { YoutubeInput } from "@/types";

export interface YoutubeMeta {
  title?: string;
  channel?: string;
  thumbnail_url?: string;
  kind?: "video" | "playlist";
  error?: string;
}

function detectKind(url: string): "video" | "playlist" {
  if (/[?&]list=/.test(url) && !/[?&]v=/.test(url)) return "playlist";
  if (/\/playlist\?/.test(url)) return "playlist";
  return "video";
}

function videoId(url: string): string | null {
  const m =
    url.match(/[?&]v=([\w-]{11})/) ||
    url.match(/youtu\.be\/([\w-]{11})/) ||
    url.match(/\/embed\/([\w-]{11})/) ||
    url.match(/\/shorts\/([\w-]{11})/);
  return m ? m[1] : null;
}

/** Identifica título, canal e thumbnail de um vídeo/playlist do YouTube via oEmbed. */
export async function fetchYoutubeMeta(url: string): Promise<YoutubeMeta> {
  if (!/youtube\.com|youtu\.be/i.test(url)) {
    return { error: "Cole um link do YouTube (vídeo ou playlist)." };
  }
  const kind = detectKind(url);
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return {
        kind,
        error: `Não foi possível ler o link (HTTP ${res.status}). Preencha manualmente.`,
      };
    }
    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    // thumbnail em alta resolução quando for vídeo
    const id = videoId(url);
    const thumb =
      id && kind === "video"
        ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
        : data.thumbnail_url;

    return {
      kind,
      title: data.title,
      channel: data.author_name,
      thumbnail_url: thumb,
    };
  } catch {
    return { kind, error: "Falha ao acessar o YouTube. Tente novamente." };
  }
}

export async function createYoutube(input: YoutubeInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("youtube_content")
    .insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/aulas-youtube");
  return { ok: true };
}

export async function updateYoutube(id: string, input: YoutubeInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("youtube_content")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/aulas-youtube");
  return { ok: true };
}

export async function deleteYoutube(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("youtube_content")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/aulas-youtube");
  return { ok: true };
}
