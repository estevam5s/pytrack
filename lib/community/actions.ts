"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import type { CommunityPostCategory, CommunityReportReason } from "@/types/community";

async function uid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Bloqueado pela moderação? */
async function isBlocked(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("community_profiles")
    .select("is_blocked")
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data?.is_blocked);
}

export async function createPost(input: {
  category: CommunityPostCategory;
  title?: string;
  content: string;
  imageUrls?: string[];
  tags?: string[];
  visibility?: "public" | "members" | "private";
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (await isBlocked(supabase, user.id))
    return { error: "Sua conta está bloqueada na comunidade." };
  if (!(await rateLimit(`post:${user.id}`, 8, 60)))
    return { error: "Você está publicando rápido demais. Aguarde um pouco." };
  const content = input.content?.trim();
  if (!content || content.length > 5000) return { error: "Conteúdo inválido" };
  await supabase.rpc("community_ensure_profile", { uid: user.id });
  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    category: input.category,
    title: input.title?.trim() || null,
    content,
    image_urls: input.imageUrls ?? [],
    tags: (input.tags ?? []).slice(0, 8),
    visibility: input.visibility ?? "public",
  });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function deletePost(postId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("community_posts")
    .update({ status: "deleted" })
    .eq("id", postId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function toggleLike(postId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();
  if (existing) {
    await supabase.from("community_likes").delete().eq("id", existing.id);
    return { ok: true, liked: false };
  }
  const { error } = await supabase
    .from("community_likes")
    .insert({ user_id: user.id, post_id: postId, target_type: "post" });
  if (error) return { error: error.message };
  return { ok: true, liked: true };
}

export async function toggleSave(postId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { data: existing } = await supabase
    .from("community_saved_posts")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();
  if (existing) {
    await supabase.from("community_saved_posts").delete().eq("id", existing.id);
    revalidatePath("/comunidade");
    return { ok: true, saved: false };
  }
  const { error } = await supabase
    .from("community_saved_posts")
    .insert({ user_id: user.id, post_id: postId });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true, saved: true };
}

export async function createComment(input: {
  postId: string;
  content: string;
  parentId?: string | null;
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (await isBlocked(supabase, user.id))
    return { error: "Sua conta está bloqueada na comunidade." };
  if (!(await rateLimit(`comment:${user.id}`, 15, 60)))
    return { error: "Muitos comentários em pouco tempo. Aguarde." };
  const content = input.content?.trim();
  if (!content || content.length > 2000) return { error: "Comentário inválido" };
  await supabase.rpc("community_ensure_profile", { uid: user.id });
  const { error } = await supabase.from("community_comments").insert({
    post_id: input.postId,
    user_id: user.id,
    parent_comment_id: input.parentId ?? null,
    content,
  });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function toggleFollow(targetUserId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (user.id === targetUserId) return { error: "Você não pode seguir a si mesmo" };
  const { data: existing } = await supabase
    .from("community_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();
  if (existing) {
    await supabase.from("community_follows").delete().eq("id", existing.id);
    revalidatePath("/comunidade");
    return { ok: true, following: false };
  }
  const { error } = await supabase
    .from("community_follows")
    .insert({ follower_id: user.id, following_id: targetUserId });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true, following: true };
}

export async function reportContent(input: {
  postId?: string;
  commentId?: string;
  reason: CommunityReportReason;
  description?: string;
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase.from("community_reports").insert({
    reporter_id: user.id,
    post_id: input.postId ?? null,
    comment_id: input.commentId ?? null,
    reason: input.reason,
    description: input.description ?? null,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function sharePost(postId: string, message?: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("community_post_shares")
    .insert({ user_id: user.id, post_id: postId, message: message ?? null });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function markSolution(commentId: string, value = true) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { error } = await supabase
    .from("community_comments")
    .update({ is_solution: value })
    .eq("id", commentId);
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function createJob(input: {
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  contract_type?: string;
  seniority?: string;
  salary_range?: string;
  description?: string;
  requirements?: string[];
  apply_url?: string;
  tags?: string[];
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (!input.title?.trim() || !input.company?.trim())
    return { error: "Título e empresa são obrigatórios" };
  const { error } = await supabase.from("community_jobs").insert({
    user_id: user.id,
    title: input.title.trim(),
    company: input.company.trim(),
    location: input.location ?? null,
    remote: input.remote ?? false,
    contract_type: input.contract_type ?? null,
    seniority: input.seniority ?? null,
    salary_range: input.salary_range ?? null,
    description: input.description ?? null,
    requirements: input.requirements ?? null,
    apply_url: input.apply_url ?? null,
    tags: input.tags ?? [],
  });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function updateCommunityProfile(input: {
  display_name?: string;
  headline?: string;
  bio?: string;
  current_track?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) if (v !== undefined) patch[k] = v;
  const { error } = await supabase
    .from("community_profiles")
    .update(patch)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function markNotificationsRead() {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase
    .from("community_notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
  return { ok: true };
}
