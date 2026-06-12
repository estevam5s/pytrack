"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Undo2 } from "lucide-react";
import { requestRefund } from "@/app/(dashboard)/configuracoes/plano/actions";
import { saveCancellationFeedback } from "@/app/(dashboard)/configuracoes/plano/feedback-actions";

const REASONS = [
  "Não estou usando o suficiente",
  "Achei caro",
  "Faltou um recurso que eu precisava",
  "Tive problemas técnicos / bugs",
  "O conteúdo não atendeu minhas expectativas",
  "Encontrei outra plataforma",
  "Outro motivo",
];

export function RefundButton() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [improvement, setImprovement] = useState("");
  const [details, setDetails] = useState("");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);

  function submit() {
    if (!reason) {
      setResult({ error: "Selecione um motivo." });
      return;
    }
    start(async () => {
      await saveCancellationFeedback({ action: "refund", reason, improvement, details });
      const res = await requestRefund({}, new FormData());
      setResult(res);
      if (res.success) setOpen(false);
    });
  }

  if (!open) {
    return (
      <div className="space-y-3">
        {result?.error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" /> {result.error}
          </div>
        )}
        {result?.success && (
          <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
            <CheckCircle2 className="h-4 w-4" /> {result.success}
          </div>
        )}
        <button
          onClick={() => { setOpen(true); setResult(null); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
        >
          <Undo2 className="h-4 w-4" /> Solicitar reembolso
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <p className="text-sm font-semibold">Antes de prosseguir, conte o motivo</p>
      <p className="text-xs text-text-secondary">Seu retorno nos ajuda a melhorar a plataforma. Leva 20 segundos.</p>

      {result?.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {result.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Por que quer o reembolso? *</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="">Selecione…</option>
          {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium">O que poderíamos melhorar?</label>
        <input value={improvement} onChange={(e) => setImprovement(e.target.value)} placeholder="Ex.: mais exercícios de X, suporte mais rápido…" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Algo mais? (opcional)</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={submit} disabled={pending} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 disabled:opacity-50">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
          Confirmar reembolso
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-foreground">Cancelar</button>
      </div>
    </div>
  );
}
