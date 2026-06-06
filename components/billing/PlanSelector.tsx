"use client";

import { useState } from "react";
import { Check, Gift, Lock, Sparkles } from "lucide-react";
import { SubscribeButton } from "./SubscribeButton";
import { cn } from "@/lib/utils";

const ESSENCIAL = [
  "Todas as trilhas de conteúdo Python",
  "Exercícios com correção por IA",
  "IDE Python no navegador",
  "Evolução, XP e níveis",
  "Materiais, livros e aulas",
];
const COMPLETO = [
  "Tudo do Essencial, mais:",
  "Comunidade, ranking e conexões",
  "+1.300 projetos para portfólio",
  "Especializações avançadas",
  "Consultor de carreira com IA",
  "Vagas e perguntas de entrevista",
];

export function PlanSelector({ trialDays = 7 }: { trialDays?: number }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="w-full">
      {/* toggle de intervalo */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-surface-2 p-1 text-sm font-medium">
          <button
            onClick={() => setAnnual(false)}
            className={cn("rounded-md px-4 py-1.5 transition-colors", !annual ? "bg-primary text-white" : "text-text-secondary")}
          >
            Mensal
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn("rounded-md px-4 py-1.5 transition-colors", annual ? "bg-primary text-white" : "text-text-secondary")}
          >
            Anual <span className="text-green">−20%</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Essencial */}
        <div className="flex flex-col rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Essencial
          </p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-4xl font-bold">R$ {annual ? "8" : "10"}</span>
            <span className="pb-1 text-text-secondary">/mês</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {annual ? "R$96/ano" : "cobrado mensalmente"} · aprenda Python a fundo
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm">
            {ESSENCIAL.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <span className="text-text-secondary">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <SubscribeButton
              plan={annual ? "essencial_annual" : "essencial_monthly"}
              label={trialDays > 0 ? `Testar ${trialDays} dias grátis` : "Assinar Essencial"}
              className="!from-surface-2 !to-surface-2 !text-foreground !shadow-none ring-1 ring-border hover:!opacity-80"
            />
          </div>
        </div>

        {/* Completo */}
        <div className="relative flex flex-col rounded-2xl border border-primary/40 bg-surface p-6">
          <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-30 blur" />
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-primary-light">
              <Sparkles className="h-3.5 w-3.5" /> Completo
            </p>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">
              Recomendado
            </span>
          </div>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-4xl font-bold">R$ {annual ? "15" : "19"}</span>
            <span className="pb-1 text-text-secondary">/mês</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {annual ? "R$182/ano" : "cobrado mensalmente"} · a plataforma inteira
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm">
            {COMPLETO.map((b, i) => (
              <li key={b} className="flex items-start gap-2">
                <Check className={cn("mt-0.5 h-4 w-4 shrink-0", i === 0 ? "text-primary-light" : "text-green")} />
                <span className={i === 0 ? "font-medium" : "text-text-secondary"}>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <SubscribeButton
              plan={annual ? "completo_annual" : "completo_monthly"}
              label={trialDays > 0 ? `Testar ${trialDays} dias grátis` : "Assinar Completo"}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-xs text-text-secondary">
        {trialDays > 0 && (
          <span className="inline-flex items-center gap-1 text-green">
            <Gift className="h-3 w-3" /> {trialDays} dias grátis
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Lock className="h-3 w-3" /> Pagamento seguro via Stripe · cancele quando quiser
        </span>
      </div>
    </div>
  );
}
