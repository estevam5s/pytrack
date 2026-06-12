"use client";

import { useEffect, useState } from "react";
import { X, Mail, Loader2, Check, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter-actions";

const KEY = "pytrack-newsletter-seen";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(KEY)) return;
    // aparece após uma pequena rolagem/tempo na 1ª visita
    const t = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(t);
  }, []);

  function close() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await subscribeNewsletter(email, "popup");
    setLoading(false);
    if (res.error) setError(res.error);
    else { setDone(true); localStorage.setItem(KEY, "1"); setTimeout(() => setShow(false), 2500); }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        {/* header gradiente */}
        <div className="bg-gradient-to-br from-primary via-primary-light to-[#5F75F2] p-6 text-white">
          <Sparkles className="h-7 w-7" />
          <h2 className="mt-2 text-2xl font-bold">Novidades de Python no seu e-mail 🐍</h2>
          <p className="mt-1 text-sm text-white/90">Uma vez por mês: novidades da linguagem, recursos da plataforma e dicas de carreira.</p>
        </div>
        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green/15 text-green"><Check className="h-6 w-6" /></span>
              <p className="mt-3 font-semibold">Inscrição confirmada!</p>
              <p className="text-sm text-text-secondary">Enviamos um e-mail de boas-vindas. 🎉</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3">
                <Mail className="h-4 w-4 text-text-secondary" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-transparent py-3 text-sm outline-none" />
              </div>
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={loading} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-light py-3 text-sm font-semibold text-white disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Quero receber
              </button>
              <button type="button" onClick={close} className="mt-2 w-full text-center text-xs text-text-secondary hover:text-foreground">Agora não</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
