"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { AnimatePresence, motion } from "framer-motion";
import { Headset, Loader2, Send, Sparkles, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  id?: string;
  role: string;
  content: string;
}

function SnakeIcon({ className }: { className?: string }) {
  // cobra estilizada (Python) — SVG próprio
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 4.5h5.5a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="4.5" r="1.6" fill="currentColor" />
      <circle cx="6.1" cy="4.2" r="0.4" fill="#fff" />
    </svg>
  );
}

const STORAGE_CONV = "pytrack-chat-conv";
const STORAGE_ANON = "pytrack-chat-anon";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("bot");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [adminOnline, setAdminOnline] = useState(false);
  const [showHuman, setShowHuman] = useState(false);
  const [guest, setGuest] = useState({ name: "", email: "" });
  const convId = useRef<string | null>(null);
  const anonId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // init ids
  useEffect(() => {
    try {
      convId.current = localStorage.getItem(STORAGE_CONV);
      let a = localStorage.getItem(STORAGE_ANON);
      if (!a) {
        a = crypto.randomUUID();
        localStorage.setItem(STORAGE_ANON, a);
      }
      anonId.current = a;
    } catch {
      anonId.current = Math.random().toString(36).slice(2);
    }
  }, []);

  const refresh = useCallback(async () => {
    const params = new URLSearchParams();
    if (convId.current) params.set("conversationId", convId.current);
    if (anonId.current) params.set("anonId", anonId.current);
    try {
      const r = await fetch(`/api/chat?${params}`, { cache: "no-store" });
      const d = await r.json();
      setLoggedIn(Boolean(d.loggedIn));
      setUserName(d.userName ?? null);
      setAdminOnline(Boolean(d.adminOnline));
      if (d.status) setStatus(d.status);
      if (Array.isArray(d.messages) && d.messages.length) {
        setMessages(d.messages.map((m: Msg) => ({ id: m.id, role: m.role, content: m.content })));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ao abrir, carrega estado
  useEffect(() => {
    if (open) {
      refresh();
      if (messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content:
              "Olá! 👋 Eu sou o **Py**, assistente da PyTrack. Posso te explicar **planos**, **trilhas**, **recursos** e como a plataforma funciona. Como posso ajudar?",
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // polling quando aguardando humano
  useEffect(() => {
    if (!open || (status !== "waiting_human" && status !== "human")) return;
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [open, status, refresh]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(extra?: { wantHuman?: boolean }) {
    const text = input.trim();
    if (!text && !extra?.wantHuman) return;
    setLoading(true);
    if (text) {
      setMessages((m) => [...m, { role: "user", content: text }]);
      setInput("");
    }
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: convId.current,
          anonId: anonId.current,
          wantHuman: extra?.wantHuman ?? false,
          name: guest.name || undefined,
          email: guest.email || undefined,
        }),
      });
      const d = await r.json();
      if (d.conversationId) {
        convId.current = d.conversationId;
        try {
          localStorage.setItem(STORAGE_CONV, d.conversationId);
        } catch {
          /* ignore */
        }
      }
      if (d.status) setStatus(d.status);
      if (d.reply) setMessages((m) => [...m, { role: "assistant", content: d.reply }]);
      if (extra?.wantHuman) {
        setShowHuman(false);
        await refresh();
      }
      if (d.error) setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${d.error}` }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Não consegui responder agora. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  function requestHuman() {
    if (loggedIn) {
      send({ wantHuman: true });
    } else {
      setShowHuman(true);
    }
  }

  return (
    <>
      {/* botão flutuante */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir chat"
        className={cn(
          "fixed bottom-5 right-5 z-[81] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105",
          open && "hidden sm:flex",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <SnakeIcon className="h-7 w-7" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[80] flex h-[100dvh] w-full flex-col overflow-hidden border-border bg-card shadow-2xl sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(620px,80vh)] sm:w-[400px] sm:rounded-2xl sm:border"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-border bg-gradient-to-br from-primary/20 via-surface to-surface p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                <SnakeIcon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">Py · Assistente PyTrack</p>
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className={`h-2 w-2 rounded-full ${adminOnline ? "bg-green animate-pulse" : "bg-text-secondary/40"}`} />
                  {status === "human"
                    ? "Falando com o suporte"
                    : status === "waiting_human"
                      ? "Suporte avisado"
                      : adminOnline
                        ? "IA online · suporte disponível"
                        : "IA online · suporte offline"}
                </p>
              </div>
              <a
                href="/chat"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir Assistente IA completo (Suprema)"
                className="rounded-lg p-1.5 text-text-secondary hover:text-primary-light"
              >
                <Maximize2 className="h-4 w-4" />
              </a>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-text-secondary hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* mensagens */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={m.id ?? i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-white"
                      : "mr-auto max-w-[88%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-sm"
                  }
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="chat-md text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  {m.role === "admin" && (
                    <span className="mt-1 block text-[10px] font-semibold uppercase text-primary-light">Suporte</span>
                  )}
                </div>
              ))}
              {loading && (
                <div className="mr-auto flex items-center gap-2 rounded-2xl bg-surface-2 px-3.5 py-2 text-sm text-text-secondary">
                  <Loader2 className="h-4 w-4 animate-spin" /> Digitando…
                </div>
              )}
            </div>

            {/* falar com suporte — login/guest */}
            {showHuman && (
              <div className="border-t border-border bg-surface-2 p-3 text-sm">
                <p className="mb-2 font-medium">Falar com o suporte</p>
                {loggedIn ? null : (
                  <>
                    <p className="mb-2 text-xs text-text-secondary">
                      Faça login para um atendimento vinculado à sua conta, ou deixe seu contato:
                    </p>
                    <div className="mb-2 grid grid-cols-2 gap-2">
                      <input
                        value={guest.name}
                        onChange={(e) => setGuest((g) => ({ ...g, name: e.target.value }))}
                        placeholder="Seu nome"
                        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                      />
                      <input
                        value={guest.email}
                        onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
                        placeholder="Seu e-mail"
                        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                      />
                    </div>
                    <Link href="/auth/login" className="mb-2 block text-xs font-semibold text-primary-light hover:underline">
                      Ou fazer login →
                    </Link>
                  </>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => send({ wantHuman: true })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Headset className="h-3.5 w-3.5" /> Acionar suporte
                  </button>
                  <button onClick={() => setShowHuman(false)} className="text-xs text-text-secondary hover:text-foreground">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* input */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={userName ? `Pergunte algo, ${userName}…` : "Pergunte sobre a PyTrack…"}
                  className="max-h-28 flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {!showHuman && status === "bot" && (
                <button
                  onClick={requestHuman}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary-light hover:underline"
                >
                  <Sparkles className="h-3 w-3" /> Falar com uma pessoa do suporte
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
