"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

async function guard() {
  const me = await getCurrentUser();
  return isAdmin(me?.email);
}

export async function adminReplyChat(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const conversationId = String(formData.get("conversation_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId || !body) return;
  const admin = createAdminClient();
  await admin.from("chat_messages").insert({
    conversation_id: conversationId,
    role: "admin",
    content: body,
  });
  await admin
    .from("chat_conversations")
    .update({ status: "human", last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
  revalidatePath("/admin/chat");
}

export async function setChatStatus(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const conversationId = String(formData.get("conversation_id") ?? "");
  const status = String(formData.get("status") ?? "bot");
  if (!conversationId) return;
  const admin = createAdminClient();
  await admin.from("chat_conversations").update({ status }).eq("id", conversationId);
  revalidatePath("/admin/chat");
}
