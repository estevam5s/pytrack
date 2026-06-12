"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Send, Play, RotateCcw, UserRound, Bot } from "lucide-react";
import { interviewTurn, type InterviewTurn } from "@/app/(dashboard)/entrevista-ia/actions";

export function InterviewAI({ defaultExperience }: { defaultExperience: string }) {
  const [started, setStarted] = useState(false);
  const [ctx, setCtx] = useState({ role: "Backend Python", level: "junior", experience: defaultExperience });
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, loading]);

  async function start() {
    setStarted(true);
    setLoading(true);
    const res = await interviewTurn({ context: ctx, history: [], message: "" });
    setLoading(false);
    if (res.reply) setHistory([{ role: "interviewer", content: res.reply }]);
  }

  async function send(custom?: string) {
    const text = custom ?? input.trim();
    if (!text) return;
    const newHistory: InterviewTurn[] = [...history, { role: "candidate", content: text }];
    setHistory(newHistory);
    setInput("");
    setLoading(true);
    const res = await interviewTurn({ context: ctx, history: newHistory, message: "" });
    setLoading(false);
    if (res.reply) setHistory([...newHistory, { role: "interviewer", content: res.reply }]);
    else setHistory([...newHistory, { role: "interviewer", content: `⚠️ ${res.error}` }]);
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6">
        <p className="text-lg font-bold">Configurar a simulação</p>
        <p className="mt-1 text-sm text-text-secondary">A IA conduz uma entrevista realista adaptada ao seu perfil.</p>
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Vaga-alvo</label>
            <input value={ctx.role} onChange={(e) => setCtx({ ...ctx, role: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Ex.: Backend Python, Engenheiro de Dados…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nível</label>
            <select value={ctx.level} onChange={(e) => setCtx({ ...ctx, level: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary">
              <option value="junior">Júnior</option>
              <option value="pleno">Pleno</option>
              <option value="senior">Sênior</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sua experiência e habilidades</label>
            <textarea value={ctx.experience} onChange={(e) => setCtx({ ...ctx, experience: e.target.value })} rows={4} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Conte sua experiência, projetos e tecnologias que domina…" />
          </div>
          <button onClick={start} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light py-3 text-sm font-semibold text-white">
            <Play className="h-4 w-4" /> Iniciar entrevista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div ref={scrollRef} className="max-h-[55vh] space-y-4 overflow-y-auto rounded-2xl border border-border bg-surface p-5">
        {history.map((t, i) => (
          <div key={i} className={t.role === "candidate" ? "flex justify-end" : "flex justify-start"}>
            <div className={`flex max-w-[88%] gap-2.5 ${t.role === "candidate" ? "flex-row-reverse" : ""}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.role === "candidate" ? "bg-surface-2" : "bg-primary/15 text-primary-light"}`}>
                {t.role === "candidate" ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${t.role === "candidate" ? "bg-primary text-white" : "bg-surface-2"}`}>
                {t.role === "candidate" ? (
                  <p className="whitespace-pre-wrap">{t.content}</p>
                ) : (
                  <div className="chat-md leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{t.content}</ReactMarkdown></div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> O entrevistador está pensando…
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={2}
          placeholder="Responda à pergunta do entrevistador…"
          className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={() => send("Pode me dar uma dica de como melhorar minha última resposta?")} disabled={loading} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-secondary hover:text-foreground">💡 Pedir dica</button>
        <button onClick={() => send("Quero encerrar. Faça um resumo final com pontos fortes, a melhorar e uma nota de 0 a 10.")} disabled={loading} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-secondary hover:text-foreground">🏁 Encerrar e avaliar</button>
        <button onClick={() => { setStarted(false); setHistory([]); }} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-secondary hover:text-foreground"><RotateCcw className="h-3 w-3" /> Recomeçar</button>
      </div>
    </div>
  );
}
