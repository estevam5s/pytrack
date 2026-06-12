"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

async function guard() {
  const me = await getCurrentUser();
  return isAdmin(me?.email);
}

export async function deletePostAdmin(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const postId = String(formData.get("post_id") ?? "");
  if (!postId) return;
  const admin = createAdminClient();
  await admin.from("community_posts").delete().eq("id", postId);
  await admin.from("community_reports").update({ status: "resolved", reviewed_at: new Date().toISOString() }).eq("post_id", postId);
  revalidatePath("/admin/moderacao");
}

export async function resolveReport(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const id = String(formData.get("report_id") ?? "");
  if (!id) return;
  const admin = createAdminClient();
  await admin.from("community_reports").update({ status: "resolved", reviewed_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/moderacao");
}

export async function setUserBlocked(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const userId = String(formData.get("user_id") ?? "");
  const blocked = String(formData.get("blocked") ?? "true") === "true";
  if (!userId) return;
  const admin = createAdminClient();
  await admin.rpc("community_ensure_profile", { uid: userId });
  await admin.from("community_profiles").update({ is_blocked: blocked }).eq("user_id", userId);
  revalidatePath("/admin/moderacao");
}
