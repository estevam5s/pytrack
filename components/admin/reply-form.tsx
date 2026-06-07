"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { replyToUser, type ReplyResult } from "@/app/(dashboard)/configuracoes/admin/mensagens/actions";

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <Send className="h-4 w-4" /> {pending ? "..." : "Responder"}
    </button>
  );
}

export function ReplyForm({ userId }: { userId: string }) {
  const [state, formAction] = useActionState<ReplyResult, FormData>(replyToUser, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state.success]);

  return (
    <form ref={ref} action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="user_id" value={userId} />
      {state.error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" /> {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-1.5 text-xs text-green">
          <CheckCircle2 className="h-3.5 w-3.5" /> {state.success}
        </p>
      )}
      <div className="flex gap-2">
        <input
          name="body"
          required
          placeholder="Responder…"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <Btn />
      </div>
    </form>
  );
}
