import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

const FALLBACK: SeoSettings = {
  title: "PyTrack — Domine Python do básico à carreira",
  description:
    "Plataforma completa para aprender todo o ecossistema Python: trilhas guiadas, +5.000 exercícios com IA, IDE no navegador, projetos reais e carreira.",
  keywords: "python, curso de python, aprender python, exercícios python, carreira python",
  og_image: "/opengraph-image",
};

async function fetchSeo(): Promise<SeoSettings> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("seo_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return FALLBACK;
    return {
      title: data.title || FALLBACK.title,
      description: data.description || FALLBACK.description,
      keywords: data.keywords || FALLBACK.keywords,
      og_image: data.og_image || FALLBACK.og_image,
    };
  } catch {
    return FALLBACK;
  }
}

export const getSeoSettings = unstable_cache(fetchSeo, ["seo-settings"], {
  revalidate: 120,
  tags: ["seo-settings"],
});
