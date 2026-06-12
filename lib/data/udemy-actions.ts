"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CourseInput } from "@/types";

export interface CourseMeta {
  title?: string;
  instructor?: string;
  image_url?: string;
  description?: string;
  duration?: string;
  error?: string;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function meta(html: string, prop: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decode(m[1]);
  }
  return undefined;
}

function stripHtml(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

/**
 * Fallback de renderização (microlink.io) para sites que bloqueiam fetch
 * direto por fingerprint (caso da Udemy/Cloudflare).
 */
async function fromMicrolink(url: string): Promise<CourseMeta | null> {
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      status?: string;
      data?: {
        title?: string;
        description?: string;
        author?: string;
        image?: { url?: string };
        logo?: { url?: string };
      };
    };
    if (json.status !== "success" || !json.data) return null;
    const d = json.data;
    if (!d.title && !d.image?.url) return null;
    return {
      title: d.title ? decode(d.title) : undefined,
      image_url: d.image?.url ?? d.logo?.url,
      description: d.description ? stripHtml(d.description).slice(0, 500) : undefined,
      instructor: d.author ? decode(d.author) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Busca metadados (banner, título, descrição, instrutor) de uma URL de curso
 * lendo as tags Open Graph. Tenta fetch direto e, se for bloqueado (ex.: Udemy),
 * usa um serviço de renderização como fallback.
 */
export async function fetchCourseMeta(url: string): Promise<CourseMeta> {
  if (!/^https?:\/\//i.test(url)) {
    return { error: "Informe uma URL válida (começando com http)." };
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
        "sec-ch-ua":
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const fb = await fromMicrolink(url);
      return (
        fb ?? {
          error: `Não foi possível ler a página (HTTP ${res.status}). Preencha manualmente.`,
        }
      );
    }
    const html = (await res.text()).slice(0, 600_000);

    const title =
      meta(html, "og:title") ||
      decode(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "");
    const image = meta(html, "og:image");
    const description = meta(html, "og:description") || meta(html, "description");
    const author =
      meta(html, "author") ||
      meta(html, "og:author") ||
      meta(html, "twitter:data1");

    if (!title && !image) {
      const fb = await fromMicrolink(url);
      return (
        fb ?? { error: "A página não expôs metadados. Preencha manualmente." }
      );
    }

    return {
      title: title || undefined,
      image_url: image,
      description: description?.slice(0, 500),
      instructor: author,
    };
  } catch {
    return { error: "Falha ao acessar a URL. Verifique o link ou preencha manualmente." };
  }
}

export async function createCourse(input: CourseInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("udemy_courses")
    .insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/aulas-udemy");
  return { ok: true };
}

export async function updateCourse(id: string, input: CourseInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("udemy_courses")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/aulas-udemy");
  return { ok: true };
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("udemy_courses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/aulas-udemy");
  return { ok: true };
}
