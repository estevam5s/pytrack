"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { resendConfirmation } from "@/app/auth/actions";

export function ResendButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  async function resend() {
    setState("loading");
    await resendConfirmation(email);
    setState("sent");
    setTimeout(() => setState("idle"), 8000);
  }

  return (
    <button
      onClick={resend}
      disabled={state !== "idle"}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "sent" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {state === "sent" ? "E-mail reenviado!" : "Reenviar e-mail de confirmação"}
    </button>
  );
}
