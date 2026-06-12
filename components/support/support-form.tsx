"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import {
  sendSupportMessage,
  type SupportResult,
} from "@/app/(dashboard)/suporte/actions";
import { Input } from "@/components/ui/input";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <Send className="h-4 w-4" /> {pending ? "Enviando..." : "Enviar mensagem"}
    </button>
  );
}

const CATEGORIES = [
  "Dúvida sobre o plano",
  "Problema técnico / bug",
  "Pagamento / cobrança",
  "Sugestão de melhoria",
  "Conteúdo / trilha",
  "Outro",
];

export function SupportForm({ withCategory = false }: { withCategory?: boolean }) {
  const [state, formAction] = useActionState<SupportResult, FormData>(
    sendSupportMessage,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {state.success}
        </div>
      )}
      {withCategory && (
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium">Categoria</label>
          <select
            id="category"
            name="subject"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
      {!withCategory && (
        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-sm font-medium">Assunto (opcional)</label>
          <Input id="subject" name="subject" placeholder="Ex.: dúvida sobre o plano, sugestão, problema…" />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="body" className="text-sm font-medium">Mensagem</label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          placeholder="Conte o que aconteceu, o que quer melhorar ou adicionar…"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <SubmitBtn />
    </form>
  );
}
