"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Send, Trash2, MessageSquare, Loader2, Sparkles, Menu, X, Bot, User } from "lucide-react";
import { Markdown } from "@/components/content/markdown";
import { listConversations, getMessages, deleteConversation, sendChatMessage } from "@/lib/ai-chat-actions";
import { cn } from "@/lib/utils";

interface Conv { id: string; title: string; updated_at: string }
interface Msg { id?: string; role: "user" | "assistant"; content: string; created_at?: string }

const SUGGESTIONS = [
  "Explique list comprehensions com exemplos",
  "Qual a diferença entre lista e tupla?",
  "Como começar com FastAPI?",
  "Me dê um roadmap para Ciência de Dados",
];

export function AiChatInterface() {
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { listConversations().then((c) => setConvs(c as Conv[])); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function openConv(id: string) {
    setActiveId(id); setSidebarOpen(false);
    const msgs = await getMessages(id);
    setMessages(msgs as Msg[]);
  }

  function newChat() {
    setActiveId(null); setMessages([]); setSidebarOpen(false); setInput("");
  }

  async function removeConv(id: string) {
    if (!confirm("Excluir esta conversa?")) return;
    await deleteConversation(id);
    setConvs((c) => c.filter((x) => x.id !== id));
    if (activeId === id) newChat();
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput(""); setLoading(true);
    setMessages((m) => [...m, { role: "user", content }]);
    const res = await sendChatMessage(activeId, content);
    setLoading(false);
    if (res.error) { setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${res.error}` }]); return; }
    setMessages((m) => [...m, { role: "assistant", content: res.reply! }]);
    if (!activeId && res.conversationId) {
      setActiveId(res.conversationId);
      listConversations().then((c) => setConvs(c as Conv[]));
    } else {
      listConversations().then((c) => setConvs(c as Conv[]));
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-border bg-[#0d0d12]">
      {/* sidebar conversas */}
      <aside className={cn(
        "absolute inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col border-r border-border bg-[#0a0a0f] transition-transform md:static md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="p-3">
          <button onClick={newChat} className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/40">
            <Plus className="h-4 w-4" /> Nova conversa
          </button>
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Histórico</p>
          {convs.length === 0 && <p className="px-2 text-xs text-text-secondary">Nenhuma conversa ainda.</p>}
          {convs.map((c) => (
            <div key={c.id} className={cn("group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors", activeId === c.id ? "bg-primary/10 text-foreground" : "text-text-secondary hover:bg-surface-2")}>
              <button onClick={() => openConv(c.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{c.title}</span>
              </button>
              <span className="shrink-0 text-[10px] text-text-secondary/60">{new Date(c.updated_at).toLocaleDateString("pt-BR")}</span>
              <button onClick={() => removeConv(c.id)} className="shrink-0 text-text-secondary/50 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* área principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <button onClick={() => setSidebarOpen((o) => !o)} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-2 md:hidden">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <Sparkles className="h-5 w-5 text-primary-light" />
          <h1 className="font-bold">Assistente PyTrack IA</h1>
          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">Suprema</span>
        </div>

        {/* mensagens */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white"><Bot className="h-8 w-8" /></div>
              <div>
                <h2 className="text-2xl font-bold">Como posso ajudar hoje?</h2>
                <p className="mt-1 text-text-secondary">Seu assistente de Python e carreira, disponível 24/7.</p>
              </div>
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl border border-border bg-surface-2/50 p-3 text-left text-sm text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground">{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", m.role === "user" ? "bg-surface-2 text-text-secondary" : "bg-gradient-to-br from-primary to-primary-light text-white")}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div className={cn("min-w-0 max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-primary text-white" : "bg-surface-2 text-foreground")}>
                    {m.role === "assistant" ? <div className="prose-chat"><Markdown>{m.content}</Markdown></div> : <p className="whitespace-pre-wrap">{m.content}</p>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-white"><Bot className="h-4 w-4" /></span>
                  <div className="flex items-center gap-1 rounded-2xl bg-surface-2 px-4 py-3"><Loader2 className="h-4 w-4 animate-spin text-primary-light" /></div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* composer (estilo chat.md) */}
        <div className="border-t border-border p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-[#1a1a1e] p-2 focus-within:border-primary/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="Pergunte qualquer coisa sobre Python…"
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-text-secondary">O assistente pode cometer erros. Verifique informações importantes.</p>
        </div>
      </div>
    </div>
  );
}
