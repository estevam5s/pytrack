"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  KeyRound,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";

interface Factor {
  id: string;
  friendly_name?: string | null;
  status: string;
}

export function SecuritySettings({
  githubUser,
}: {
  githubUser: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enroll, setEnroll] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  const loadFactors = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp ?? []) as Factor[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadFactors();
  }, [loadFactors]);

  async function startEnroll() {
    setBusy(true);
    setMsg({});
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `App ${new Date().toLocaleDateString("pt-BR")}`,
    });
    setBusy(false);
    if (error || !data) return setMsg({ err: error?.message ?? "Falha ao iniciar." });
    setEnroll({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirmEnroll() {
    if (!enroll || !code.trim()) return;
    setBusy(true);
    setMsg({});
    const ch = await supabase.auth.mfa.challenge({ factorId: enroll.id });
    if (ch.error) {
      setBusy(false);
      return setMsg({ err: ch.error.message });
    }
    const v = await supabase.auth.mfa.verify({
      factorId: enroll.id,
      challengeId: ch.data.id,
      code: code.trim(),
    });
    setBusy(false);
    if (v.error) return setMsg({ err: `Código inválido: ${v.error.message}` });
    setEnroll(null);
    setCode("");
    setMsg({ ok: "Autenticação em duas etapas ativada!" });
    loadFactors();
    router.refresh();
  }

  async function removeFactor(id: string) {
    if (!confirm("Desativar a verificação em duas etapas?")) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    setBusy(false);
    if (error) return setMsg({ err: error.message });
    setMsg({ ok: "2FA desativada." });
    loadFactors();
    router.refresh();
  }

  async function connectGithub() {
    setMsg({});
    const { error } = await supabase.auth.linkIdentity({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/configuracoes/seguranca` },
    });
    if (error) setMsg({ err: `GitHub: ${error.message}` });
  }

  async function disconnectGithub() {
    setBusy(true);
    const { data } = await supabase.auth.getUserIdentities();
    const gh = data?.identities?.find((i) => i.provider === "github");
    if (gh) {
      const { error } = await supabase.auth.unlinkIdentity(gh);
      if (error) setMsg({ err: error.message });
      else {
        setMsg({ ok: "GitHub desconectado." });
        router.refresh();
      }
    }
    setBusy(false);
  }

  const active = factors.filter((f) => f.status === "verified");

  return (
    <div className="space-y-6">
      {msg.err && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {msg.err}
        </div>
      )}
      {msg.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {msg.ok}
        </div>
      )}

      {/* 2FA */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary-light" />
          <h3 className="font-semibold">Verificação em duas etapas (2FA)</h3>
          {active.length > 0 && (
            <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[11px] font-semibold text-green">
              Ativa
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Use um app autenticador (Google Authenticator, Authy, 1Password…).
          Ative escaneando o QR Code; nos próximos logins, basta digitar o código.
        </p>

        {loading ? (
          <Loader2 className="mt-4 h-5 w-5 animate-spin text-text-secondary" />
        ) : active.length > 0 ? (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
            <span className="flex items-center gap-2 text-sm">
              <KeyRound className="h-4 w-4 text-green" /> 2FA configurada e ativa
            </span>
            <button
              onClick={() => removeFactor(active[0].id)}
              disabled={busy}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Desativar
            </button>
          </div>
        ) : enroll ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-start">
              {/* QR vem como SVG data URI */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={enroll.qr} alt="QR Code 2FA" className="h-44 w-44" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold">1. Escaneie o QR no seu app</p>
                <p className="mt-2">Ou insira o código manual:</p>
                <code className="mt-1 block break-all rounded bg-gray-100 p-2 text-xs">{enroll.secret}</code>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">2. Digite o código de 6 dígitos</label>
              <div className="flex gap-2">
                <Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="000000" maxLength={6} />
                <button
                  onClick={confirmEnroll}
                  disabled={busy || code.length < 6}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ativar"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={startEnroll}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <ShieldCheck className="h-4 w-4" /> Ativar 2FA
          </button>
        )}
      </div>

      {/* GitHub */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          <h3 className="font-semibold">Conta do GitHub</h3>
          {githubUser && (
            <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[11px] font-semibold text-green">
              Conectada
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Conecte seu perfil do GitHub à sua conta PyTrack.
        </p>
        {githubUser ? (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
            <span className="flex items-center gap-2 text-sm">
              <Github className="h-4 w-4" /> @{githubUser}
            </span>
            <button onClick={disconnectGithub} disabled={busy} className="text-xs text-red-400 hover:underline disabled:opacity-50">
              Desconectar
            </button>
          </div>
        ) : (
          <button
            onClick={connectGithub}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#24292e] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" /> Conectar com o GitHub
          </button>
        )}
      </div>
    </div>
  );
}
