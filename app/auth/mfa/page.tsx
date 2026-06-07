"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MfaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      const f = (data?.totp ?? []).find((x) => x.status === "verified");
      setFactorId(f?.id ?? null);
      setLoading(false);
      if (!f) router.replace("/inicio");
    })();
  }, [supabase, router]);

  async function verify() {
    if (!factorId || code.length < 6) return;
    setBusy(true);
    setErr(null);
    const ch = await supabase.auth.mfa.challenge({ factorId });
    if (ch.error) {
      setBusy(false);
      return setErr(ch.error.message);
    }
    const v = await supabase.auth.mfa.verify({
      factorId,
      challengeId: ch.data.id,
      code: code.trim(),
    });
    setBusy(false);
    if (v.error) return setErr("Código inválido. Tente novamente.");
    router.replace("/inicio");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-50" />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-7 text-center">
        <Image src="/new-logo.png" alt="PyTrack" width={44} height={44} className="mx-auto h-11 w-11 rounded-lg object-contain" />
        <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold">Verificação em duas etapas</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Digite o código de 6 dígitos do seu app autenticador.
        </p>

        {err && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          autoFocus
          className="mt-5 w-full rounded-lg border border-border bg-surface-2 px-3 py-3 text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-primary"
        />

        <button
          onClick={verify}
          disabled={busy || loading || code.length < 6}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar e entrar"}
        </button>
      </div>
    </div>
  );
}
