"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { chatComplete } from "@/lib/ai/openrouter";
import { PLATFORM_KNOWLEDGE } from "@/lib/chat-knowledge";

async function gate() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Faça login.", user: null, supabase };
  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier, "suprema")) return { error: "Disponível apenas no plano Suprema (R$46).", user: null, supabase };
  return { user, supabase, error: null };
}

export async function listConversations() {
  const { user, supabase } = await gate();
  if (!user) return [];
  const { data } = await supabase.from("ai_conversations").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(100);
  return data ?? [];
}

export async function getMessages(conversationId: string) {
  const { user, supabase } = await gate();
  if (!user) return [];
  const { data } = await supabase.from("ai_messages").select("id, role, content, created_at").eq("conversation_id", conversationId).eq("user_id", user.id).order("created_at", { ascending: true });
  return data ?? [];
}

export async function createConversation() {
  const { user, supabase, error } = await gate();
  if (!user) return { error };
  const { data } = await supabase.from("ai_conversations").insert({ user_id: user.id, title: "Nova conversa" }).select("id").single();
  return { id: data?.id as string };
}

export async function deleteConversation(id: string) {
  const { user, supabase } = await gate();
  if (!user) return { error: "Não autorizado" };
  await supabase.from("ai_conversations").delete().eq("id", id).eq("user_id", user.id);
  return { ok: true };
}

export async function renameConversation(id: string, title: string) {
  const { user, supabase } = await gate();
  if (!user) return { error: "Não autorizado" };
  await supabase.from("ai_conversations").update({ title: title.slice(0, 80) }).eq("id", id).eq("user_id", user.id);
  return { ok: true };
}

export async function sendChatMessage(conversationId: string | null, content: string) {
  const { user, supabase, error } = await gate();
  if (!user) return { error };
  if (!content.trim()) return { error: "Mensagem vazia." };

  // cria conversa se necessário
  let convId = conversationId;
  if (!convId) {
    const { data } = await supabase.from("ai_conversations").insert({ user_id: user.id, title: content.trim().slice(0, 60) }).select("id").single();
    convId = data?.id as string;
  }
  if (!convId) return { error: "Não foi possível criar a conversa." };

  // salva mensagem do usuário
  await supabase.from("ai_messages").insert({ conversation_id: convId, user_id: user.id, role: "user", content: content.trim().slice(0, 8000) });

  // histórico para contexto (últimas 20)
  const { data: history } = await supabase.from("ai_messages").select("role, content").eq("conversation_id", convId).order("created_at", { ascending: true }).limit(20);
  const messages = [
    { role: "system" as const, content: `Você é o assistente IA da PyTrack, especialista em Python e no ecossistema da plataforma. Responda de forma clara, didática e em português. Use markdown quando útil.\n\n${PLATFORM_KNOWLEDGE}` },
    ...(history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content as string })),
  ];

  const res = await chatComplete(messages, { maxTokens: 1200, temperature: 0.6 });
  const reply = res.content?.trim() || "Desculpe, não consegui gerar uma resposta agora. Tente novamente.";

  await supabase.from("ai_messages").insert({ conversation_id: convId, user_id: user.id, role: "assistant", content: reply });
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);

  return { conversationId: convId, reply };
}
