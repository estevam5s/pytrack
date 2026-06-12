"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markConversationRead } from "@/lib/community/messages-actions";

interface Msg { id: string; sender_id: string; recipient_id: string; body: string; created_at: string }

export function ChatWindow({ meId, otherId, initial }: { meId: string; otherId: string; initial: Msg[] }) {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    markConversationRead(otherId);
    const supabase = createClient();
    const channel = supabase
      .channel(`dm-${meId}-${otherId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, (payload) => {
        const m = payload.new as Msg;
        // só mensagens desta conversa
        const involved = (m.sender_id === meId && m.recipient_id === otherId) || (m.sender_id === otherId && m.recipient_id === meId);
        if (!involved) return;
        setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        if (m.recipient_id === meId) markConversationRead(otherId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [meId, otherId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    setText("");
    // otimista
    const temp: Msg = { id: `temp-${Date.now()}`, sender_id: meId, recipient_id: otherId, body, created_at: new Date().toISOString() };
    setMessages((p) => [...p, temp]);
    const res = await sendMessage(otherId, body);
    setSending(false);
    if (res.error) { setMessages((p) => p.filter((m) => m.id !== temp.id)); setText(body); }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border border-border bg-card">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 && <p className="py-8 text-center text-sm text-text-secondary">Diga olá! 👋</p>}
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-gradient-to-r from-primary to-primary-light text-white" : "bg-surface-2 text-foreground"}`}>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={`mt-0.5 text-[10px] ${mine ? "text-white/70" : "text-text-secondary"}`}>{new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem…" className="flex-1 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm outline-none focus:border-primary" />
        <button type="submit" disabled={sending || !text.trim()} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-light text-white disabled:opacity-50">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
