"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Undo2 } from "lucide-react";
import { requestRefund, type RefundResult } from "@/app/(dashboard)/configuracoes/plano/actions";

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (
          !confirm(
            "Tem certeza? O reembolso é integral, encerra seu acesso premium e cancela a assinatura.",
          )
        ) {
          e.preventDefault();
        }
      }}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground disabled:opacity-60"
    >
      <Undo2 className="h-4 w-4" />
      {pending ? "Processando..." : "Solicitar reembolso"}
    </button>
  );
}

export function RefundButton() {
  const [state, formAction] = useActionState<RefundResult, FormData>(
    requestRefund,
    {},
  );
  return (
    <form action={formAction} className="space-y-3">
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
      <Btn />
    </form>
  );
}
