import { createAdminClient } from "@/lib/supabase/admin";

export interface ProfileSections {
  experiences: Record<string, unknown>[];
  education: Record<string, unknown>[];
  certificates: Record<string, unknown>[];
  awards: Record<string, unknown>[];
  languages: Record<string, unknown>[];
  testScores: Record<string, unknown>[];
  recommendations: { id: string; author_id: string; relationship: string | null; body: string; author?: { name: string; avatar_url: string | null; headline: string | null } }[];
  services: Record<string, unknown> | null;
  projects: { id: string; title: string; description: string | null; area: string | null; github_url: string | null }[];
  endorsements: Record<string, number>;
}

export async function getProfileSections(userId: string): Promise<ProfileSections> {
  const admin = createAdminClient();
  const [exp, edu, cert, award, lang, test, recs, svc, endo, projs] = await Promise.all([
    admin.from("community_experiences").select("*").eq("user_id", userId).order("is_current", { ascending: false }).order("start_date", { ascending: false }),
    admin.from("community_education").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    admin.from("community_certificates").select("*").eq("user_id", userId).order("issue_date", { ascending: false }),
    admin.from("community_awards").select("*").eq("user_id", userId).order("award_date", { ascending: false }),
    admin.from("community_languages").select("*").eq("user_id", userId).order("position"),
    admin.from("community_test_scores").select("*").eq("user_id", userId).order("test_date", { ascending: false }),
    admin.from("community_recommendations").select("*").eq("target_id", userId).eq("status", "visible").order("created_at", { ascending: false }),
    admin.from("community_services").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("community_skill_endorsements").select("skill").eq("target_id", userId),
    admin.from("projects").select("id, title, description, area, github_url, status").eq("status", "concluido").limit(6),
  ]);

  // autores das recomendações
  const recRows = recs.data ?? [];
  const authorIds = [...new Set(recRows.map((r) => r.author_id as string))];
  const { data: authors } = authorIds.length
    ? await admin.from("users_profile").select("user_id, name, avatar_url, headline").in("user_id", authorIds)
    : { data: [] };
  const amap = new Map((authors ?? []).map((a) => [a.user_id, a]));

  // contagem de endorsements por skill
  const endorsements: Record<string, number> = {};
  for (const e of endo.data ?? []) {
    const s = e.skill as string;
    endorsements[s] = (endorsements[s] ?? 0) + 1;
  }

  return {
    experiences: exp.data ?? [],
    education: edu.data ?? [],
    certificates: cert.data ?? [],
    awards: award.data ?? [],
    languages: lang.data ?? [],
    testScores: test.data ?? [],
    recommendations: recRows.map((r) => ({
      id: r.id as string,
      author_id: r.author_id as string,
      relationship: r.relationship as string | null,
      body: r.body as string,
      author: amap.get(r.author_id as string) as { name: string; avatar_url: string | null; headline: string | null } | undefined,
    })),
    services: svc.data ?? null,
    projects: (projs.data ?? []) as ProfileSections["projects"],
    endorsements,
  };
}
