"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, X, Star, Loader2, Check } from "lucide-react";
import { submitFeedback } from "@/lib/feedback-actions";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "geral", label: "💬 Geral" },
  { key: "bug", label: "🐛 Problema/Bug" },
  { key: "ideia", label: "💡 Ideia/Sugestão" },
  { key: "elogio", label: "❤️ Elogio" },
];

export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [category, setCategory] = useState("geral");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setStatus("sending"); setError(null);
    const res = await submitFeedback({ rating, category, message, page: pathname });
    if (res.error) { setError(res.error); setStatus("idle"); return; }
    setStatus("done");
    setTimeout(() => { setOpen(false); setStatus("idle"); setRating(0); setMessage(""); setCategory("geral"); }, 1800);
  }

  return (
    <>
      {/* botão flutuante (acima do chat) */}
      <button
        onClick={() => setOpen(true)}
        className="group fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-lg shadow-primary/30 transition-transform hover:scale-110"
        aria-label="Enviar feedback"
        title="Enviar feedback"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-end p-4 sm:items-center sm:justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="flex items-center gap-2 font-bold"><MessageSquarePlus className="h-5 w-5 text-primary-light" /> Seu feedback</h3>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-2 hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>

            {status === "done" ? (
              <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green/15 text-green"><Check className="h-7 w-7" /></span>
                <p className="font-semibold">Obrigado pelo feedback! 💜</p>
                <p className="text-sm text-text-secondary">Sua opinião nos ajuda a melhorar a PyTrack.</p>
              </div>
            ) : (
              <div className="space-y-4 p-5">
                <p className="text-sm text-text-secondary">O que achou da PyTrack? Sua opinião é muito importante.</p>
                {/* estrelas */}
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
                      <Star className={cn("h-8 w-8 transition-colors", (hover || rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-text-secondary/40")} />
                    </button>
                  ))}
                </div>
                {/* categoria */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button key={c.key} onClick={() => setCategory(c.key)} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", category === c.key ? "border-primary/40 bg-primary/10 text-primary-light" : "border-border text-text-secondary hover:border-primary/30")}>{c.label}</button>
                  ))}
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Conte o que você achou, o que podemos melhorar…" className="w-full resize-none rounded-lg border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary" />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button onClick={send} disabled={status === "sending" || !message.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />} Enviar feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
