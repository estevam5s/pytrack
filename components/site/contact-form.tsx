"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import {
  sendContactMessage,
  type ContactResult,
} from "@/app/(site)/sobre/contact-actions";

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

export function ContactForm() {
  const [state, action] = useActionState<ContactResult, FormData>(sendContactMessage, {});

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-border bg-surface p-6">
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
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Seu nome" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
        <input name="email" type="email" required placeholder="Seu e-mail" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>
      <textarea name="message" required rows={4} placeholder="Sua mensagem" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      <SubmitBtn />
    </form>
  );
}
