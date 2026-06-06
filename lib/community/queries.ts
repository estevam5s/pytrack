import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  CommunityComment,
  CommunityJob,
  CommunityPostWithAuthor,
  CommunityProfile,
} from "@/types/community";

async function authorMap(userIds: string[]) {
  const ids = Array.from(new Set(userIds)).filter(Boolean);
  if (!ids.length) return new Map<string, CommunityProfile>();
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .in("user_id", ids);
  return new Map((data ?? []).map((p) => [p.user_id, p as CommunityProfile]));
}

/** Garante o perfil de comunidade do usuário atual e o retorna. */
export async function getMyCommunityProfile(): Promise<CommunityProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  await supabase.rpc("community_ensure_profile", { uid: user.id });
  await supabase
    .from("community_profiles")
    .update({ is_online: true, last_seen_at: new Date().toISOString() })
    .eq("user_id", user.id);
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return (data as CommunityProfile) ?? null;
}

export type FeedFilter = string;

export async function getFeed(
  filter: FeedFilter = "feed",
  search?: string,
): Promise<CommunityPostWithAuthor[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("community_posts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  const CATS = [
    "duvida",
    "exercicio",
    "projeto",
    "vaga",
    "material",
    "conquista",
    "discussao",
    "artigo",
    "evento",
  ];

  if (filter === "meus" && user) query = query.eq("user_id", user.id);
  else if (CATS.includes(filter)) query = query.eq("category", filter);

  if (filter === "salvos" && user) {
    const { data: saved } = await supabase
      .from("community_saved_posts")
      .select("post_id")
      .eq("user_id", user.id);
    const ids = (saved ?? []).map((s) => s.post_id);
    if (!ids.length) return [];
    query = query.in("id", ids);
  }

  if (search && search.trim()) {
    const s = search.trim().replace(/[%,]/g, "");
    query = query.or(`content.ilike.%${s}%,title.ilike.%${s}%`);
  }

  const { data: posts } = await query;
  if (!posts?.length) return [];

  const authors = await authorMap(posts.map((p) => p.user_id));

  let likedSet = new Set<string>();
  let savedSet = new Set<string>();
  if (user) {
    const postIds = posts.map((p) => p.id);
    const [{ data: likes }, { data: saves }] = await Promise.all([
      supabase
        .from("community_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("target_type", "post")
        .in("post_id", postIds),
      supabase
        .from("community_saved_posts")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds),
    ]);
    likedSet = new Set((likes ?? []).map((l) => l.post_id as string));
    savedSet = new Set((saves ?? []).map((s) => s.post_id as string));
  }

  return posts.map((p) => ({
    ...(p as CommunityPostWithAuthor),
    author: authors.get(p.user_id) ?? null,
    liked: likedSet.has(p.id),
    saved: savedSet.has(p.id),
  }));
}

export async function getComments(postId: string): Promise<CommunityComment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "active")
    .order("created_at", { ascending: true });
  if (!data?.length) return [];
  const authors = await authorMap(data.map((c) => c.user_id));
  return data.map((c) => ({
    ...(c as CommunityComment),
    author: authors.get(c.user_id) ?? null,
  }));
}

export async function getRanking(limit = 8): Promise<CommunityProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);
  return (data ?? []) as CommunityProfile[];
}

export async function getOnlineUsers(limit = 8): Promise<CommunityProfile[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - 1000 * 60 * 10).toISOString();
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .gte("last_seen_at", since)
    .order("last_seen_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as CommunityProfile[];
}

export async function getRecentJobs(limit = 5): Promise<CommunityJob[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!data?.length) return [];
  const authors = await authorMap(data.map((j) => j.user_id));
  return data.map((j) => ({
    ...(j as CommunityJob),
    author: authors.get(j.user_id) ?? null,
  }));
}

export async function getUnanswered(limit = 5): Promise<CommunityPostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", "active")
    .eq("category", "duvida")
    .eq("comments_count", 0)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!data?.length) return [];
  const authors = await authorMap(data.map((p) => p.user_id));
  return data.map((p) => ({
    ...(p as CommunityPostWithAuthor),
    author: authors.get(p.user_id) ?? null,
    liked: false,
    saved: false,
  }));
}

export async function getSuggestions(limit = 5): Promise<CommunityProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: following } = await supabase
    .from("community_follows")
    .select("following_id")
    .eq("follower_id", user.id);
  const exclude = new Set([user.id, ...(following ?? []).map((f) => f.following_id)]);
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit + exclude.size + 5);
  return ((data ?? []) as CommunityProfile[])
    .filter((p) => !exclude.has(p.user_id))
    .slice(0, limit);
}

export async function getCommunityStats() {
  const supabase = await createClient();
  const [members, posts, jobs] = await Promise.all([
    supabase.from("community_profiles").select("id", { count: "exact", head: true }),
    supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("community_jobs").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);
  return {
    members: members.count ?? 0,
    posts: posts.count ?? 0,
    jobs: jobs.count ?? 0,
  };
}

export async function getFollowingIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from("community_follows")
    .select("following_id")
    .eq("follower_id", user.id);
  return new Set((data ?? []).map((f) => f.following_id as string));
}
