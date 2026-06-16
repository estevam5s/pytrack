import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SiteSettings {
  default_locale: string;
  maintenance: boolean;
  signups_enabled: boolean;
  announcement: string | null;
  announcement_type?: string | null; // info | success | warning
  announcement_link?: string | null;
  primary_contact: string;
  social_github: string;
  social_linkedin: string;
  logo_url?: string | null;
}

const FALLBACK: SiteSettings = {
  default_locale: "pt",
  maintenance: false,
  signups_enabled: true,
  announcement: null,
  announcement_type: "info",
  announcement_link: null,
  primary_contact: "contato@estevamsouza.com.br",
  social_github: "https://github.com/PyTrackOrganization",
  social_linkedin: "",
  logo_url: null,
};

// URL do logo: a configurada no painel ou o arquivo padrão.
export async function getLogoUrl(): Promise<string> {
  const s = await getSiteSettings();
  return s.logo_url || "/new-logo.png";
}

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return FALLBACK;
    return { ...FALLBACK, ...data } as SiteSettings;
  } catch {
    return FALLBACK;
  }
}

// cache curto (30s) — muda raramente mas precisa refletir rápido ao alternar manutenção
export const getSiteSettings = unstable_cache(fetchSettings, ["site-settings"], {
  revalidate: 30,
  tags: ["site-settings"],
});
