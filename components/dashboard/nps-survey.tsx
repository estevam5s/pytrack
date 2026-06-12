"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { submitNps } from "@/lib/nps-actions";
import { cn } from "@/lib/utils";

const SEEN_KEY = "pytrack-nps-seen";

export function NpsSurvey() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  // mostra uma vez, após alguns segundos de uso
  useEffect(() => {
    try { if (localStorage.getItem(SEEN_KEY)) return; } catch { return; }
    const id = setTimeout(() => setOpen(true), 25000);
    return () => clearTimeout(id);
  }, []);

  function dismiss() {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  }

  function next() {
    if (step === 1) { setStep(2); return; }
    finish();
  }

  async function finish() {
    setSending(true);
    await submitNps({ score, reason });
    setSending(false);
    dismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[min(94vw,460px)] rounded-2xl border border-white/10 bg-[#1e2435] p-5 text-white shadow-2xl">
      <button onClick={dismiss} className="absolute right-4 top-4 text-white/60 hover:text-white" aria-label="Fechar"><X className="h-5 w-5" /></button>

      {step === 1 ? (
        <>
          <h3 className="pr-8 text-lg font-semibold leading-snug">De 0 a 10, o quanto você recomendaria a PyTrack para amigos, familiares e conhecidos?</h3>
          <div className="mt-5 grid grid-cols-11 gap-px overflow-hidden rounded-lg border border-white/10">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setScore(i)}
                className={cn(
                  "py-3 text-sm font-medium transition-colors",
                  score === i ? "bg-blue-600 text-white" : "bg-white/[0.03] text-white/80 hover:bg-white/10",
                )}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/40">
            <span>pouco provável</span>
            <span>muito provável</span>
          </div>
        </>
      ) : (
        <>
          <h3 className="pr-8 text-lg font-semibold">Qual o motivo da sua nota?</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Escreva exatamente o que você pensa…"
            className="mt-4 w-full resize-none rounded-lg border border-white/10 bg-transparent p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-500"
            autoFocus
          />
        </>
      )}

      <div className="mt-5 flex items-center justify-end gap-4">
        <button onClick={step === 1 ? dismiss : finish} className="text-sm text-white/60 underline-offset-2 hover:underline">Pular</button>
        <button
          onClick={next}
          disabled={(step === 1 && score === null) || sending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "Enviando…" : "Seguinte"}
        </button>
      </div>
    </div>
  );
}
