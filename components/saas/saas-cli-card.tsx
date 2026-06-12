"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Lock } from "lucide-react";

const CMD = "curl -fsSL https://www.pytrack.com.br/pytrack-saas.sh | bash";

export function SaasCliCard({ canUse }: { canUse: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-5 py-3">
        <Terminal className="h-5 w-5 text-primary-light" />
        <h2 className="font-bold">Gerar no terminal (CLI)</h2>
        {!canUse && <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-yellow-400/10 px-2.5 py-0.5 text-xs text-yellow-400"><Lock className="h-3 w-3" /> Completo+</span>}
      </div>
      <div className="p-5">
        <p className="mb-4 text-sm text-text-secondary">
          Rode o comando abaixo no seu terminal. Você escolhe a <strong className="text-foreground">stack</strong>, informa suas <strong className="text-foreground">credenciais PyTrack</strong> (que identificam o seu plano) e a CLI cria toda a <strong className="text-foreground">arquitetura inicial</strong> do seu SaaS na sua máquina — auth, billing (Stripe), banco e variáveis de ambiente.
        </p>

        {/* bloco de comando */}
        <div className="group relative rounded-xl border border-border bg-[#0b0b0f] p-4 font-mono text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="select-none text-green">$</span>
            <code className="text-foreground">{CMD}</code>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(CMD); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="absolute right-3 top-3 rounded-md border border-border bg-surface-2 p-1.5 text-text-secondary opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* passos */}
        <div className="mt-4 grid gap-2 text-xs text-text-secondary sm:grid-cols-3">
          <Step n="1" t="Rode o comando" d="Cole no terminal e execute." />
          <Step n="2" t="Escolha a stack" d="Next.js, FastAPI, Flask, Django ou Express." />
          <Step n="3" t="Pronto" d="A arquitetura é criada na sua pasta." />
        </div>

        {!canUse && (
          <p className="mt-4 rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-3 text-xs text-yellow-400">
            ⚠️ A geração via CLI está disponível a partir do plano <strong>Completo (R$19)</strong>. Os planos Gratuito e Essencial (R$10) não têm acesso.
          </p>
        )}
      </div>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary-light">{n}</span>
      <p className="mt-1.5 font-semibold text-foreground">{t}</p>
      <p>{d}</p>
    </div>
  );
}
