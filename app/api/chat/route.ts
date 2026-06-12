import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chatComplete } from "@/lib/ai/openrouter";
import { PLATFORM_KNOWLEDGE } from "@/lib/chat-knowledge";
import { rateLimit } from "@/lib/rate-limit";
import { ADMIN_EMAILS } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message ?? "").trim();
    const anonId = String(body?.anonId ?? "").slice(0, 64) || null;
    let conversationId = String(body?.conversationId ?? "") || null;
    const wantHuman = Boolean(body?.wantHuman);
    const visitorName = String(body?.name ?? "").slice(0, 80) || null;
    const visitorEmail = String(body?.email ?? "").slice(0, 120) || null;

    if (!message && !wantHuman) {
      return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    // identifica o usuário logado (se houver)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // rate limit por usuário/anon
    const rlKey = `chat:${user?.id ?? anonId ?? "anon"}`;
    if (!(await rateLimit(rlKey, 20, 60))) {
      return NextResponse.json({ error: "Você está enviando rápido demais. Aguarde um pouco." }, { status: 429 });
    }

    const admin = createAdminClient();

    // recupera ou cria a conversa
    let conv: { id: string; status: string } | null = null;
    if (conversationId) {
      const { data } = await admin
        .from("chat_conversations")
        .select("id, status, user_id, anon_id")
        .eq("id", conversationId)
        .maybeSingle();
      // valida posse
      if (data && (data.user_id === user?.id || (!data.user_id && data.anon_id === anonId))) {
        conv = { id: data.id, status: data.status };
      }
    }
    if (!conv) {
      const { data, error } = await admin
        .from("chat_conversations")
        .insert({
          user_id: user?.id ?? null,
          anon_id: user ? null : anonId,
          visitor_name: visitorName,
          visitor_email: visitorEmail ?? user?.email ?? null,
          status: "bot",
        })
        .select("id, status")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      conv = data;
      conversationId = data.id;
    }
    conversationId = conv.id;

    // vincula nome/email se enviados depois
    if (visitorName || visitorEmail) {
      await admin
        .from("chat_conversations")
        .update({ visitor_name: visitorName ?? undefined, visitor_email: visitorEmail ?? undefined })
        .eq("id", conversationId);
    }

    // escalonamento para humano
    if (wantHuman) {
      await admin
        .from("chat_conversations")
        .update({ status: "waiting_human", last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
      if (message) {
        await admin.from("chat_messages").insert({ conversation_id: conversationId, role: "user", content: message });
      }
      await admin.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: "Beleza! Já avisei a equipe de suporte. Assim que alguém estiver disponível, responde por aqui. Você também pode continuar tirando dúvidas comigo enquanto isso. 😊",
      });
      return NextResponse.json({ conversationId, status: "waiting_human" });
    }

    // salva a mensagem do usuário
    await admin.from("chat_messages").insert({ conversation_id: conversationId, role: "user", content: message });
    await admin
      .from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    // se a conversa está com humano, não responde com IA (admin responde)
    if (conv.status === "human" || conv.status === "waiting_human") {
      return NextResponse.json({ conversationId, status: conv.status });
    }

    // histórico recente para contexto
    const { data: history } = await admin
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(12);
    const recent = (history ?? []).reverse();

    const messages = [
      { role: "system" as const, content: PLATFORM_KNOWLEDGE },
      ...recent.map((m) => ({
        role: (m.role === "assistant" || m.role === "admin" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      })),
    ];

    const res = await chatComplete(messages, { maxTokens: 700, temperature: 0.4 });
    const reply =
      res.content?.trim() ||
      "Tive um probleminha para responder agora. Você pode tentar de novo ou falar com o suporte humano. 🙏";

    await admin.from("chat_messages").insert({ conversation_id: conversationId, role: "assistant", content: reply });

    return NextResponse.json({ conversationId, status: "bot", reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro no chat.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET: busca mensagens + status do admin (online/offline) + se está logado
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");
    const anonId = url.searchParams.get("anonId");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();

    // admin online?
    let adminOnline = false;
    try {
      const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const adminIds = users.users
        .filter((u) => ADMIN_EMAILS.includes((u.email ?? "").toLowerCase()))
        .map((u) => u.id);
      if (adminIds.length) {
        const { data: profs } = await admin
          .from("users_profile")
          .select("last_seen_at")
          .in("user_id", adminIds);
        const cutoff = Date.now() - 5 * 60 * 1000;
        adminOnline = (profs ?? []).some((p) => p.last_seen_at && new Date(p.last_seen_at).getTime() > cutoff);
      }
    } catch {
      /* ignore */
    }

    let messages: unknown[] = [];
    let status = "bot";
    if (conversationId) {
      const { data: conv } = await admin
        .from("chat_conversations")
        .select("status, user_id, anon_id")
        .eq("id", conversationId)
        .maybeSingle();
      if (conv && (conv.user_id === user?.id || (!conv.user_id && conv.anon_id === anonId))) {
        status = conv.status;
        const { data: msgs } = await admin
          .from("chat_messages")
          .select("id, role, content, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        messages = msgs ?? [];
      }
    }

    return NextResponse.json({
      loggedIn: Boolean(user),
      userName: (user?.user_metadata?.name as string | undefined)?.split(" ")[0] ?? null,
      adminOnline,
      status,
      messages,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
