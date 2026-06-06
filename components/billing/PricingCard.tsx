"use client";

import { useState } from "react";
import { Check, Gift, Lock, Sparkles } from "lucide-react";
import { SubscribeButton } from "./SubscribeButton";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Acesso completo ao dashboard",
  "Conteúdos Python do básico ao avançado",
  "Trilhas de dados, IoT, backend e engenharia",
  "Exercícios práticos com correção por IA",
  "IDE Python no navegador",
  "Projetos reais para portfólio",
  "Comunidade, ranking e vagas",
  "Materiais, livros e aulas (Udemy/YouTube)",
  "Evolução personalizada com XP e níveis",
];

export function PricingCard({ trialDays = 7 }: { trialDays?: number }) {
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const annual = plan === "annual";

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-0.5 rounded-3xl bg-brand opacity-40 blur-lg" />
      <div className="relative rounded-3xl border border-primary/30 bg-surface p-8">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" /> Python Pro
          </span>
          {trialDays > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green/30 bg-green/10 px-2.5 py-0.5 text-[11px] font-semibold text-green">
              <Gift className="h-3 w-3" /> {trialDays} dias grátis
            </span>
          )}
        </div>

        {/* toggle mensal/anual */}
        <div className="mt-5 inline-flex rounded-lg border border-border bg-surface-2 p-1 text-xs font-medium">
          <button
            onClick={() => setPlan("monthly")}
            className={cn("rounded-md px-3 py-1.5 transition-colors", !annual ? "bg-primary text-white" : "text-text-secondary")}
          >
            Mensal
          </button>
          <button
            onClick={() => setPlan("annual")}
            className={cn("rounded-md px-3 py-1.5 transition-colors", annual ? "bg-primary text-white" : "text-text-secondary")}
          >
            Anual <span className="text-green">-20%</span>
          </button>
        </div>

        <div className="mt-5 flex items-end gap-1">
          <span className="text-5xl font-bold tracking-tight">
            R$ {annual ? "8" : "10"}
          </span>
          <span className="pb-1.5 text-text-secondary">/mês</span>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          {annual
            ? "Cobrado R$96/ano (2 meses grátis)."
            : "Cobrado mensalmente. Cancele quando quiser."}
        </p>

        <ul className="mt-6 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-text-secondary">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <SubscribeButton
            plan={plan}
            label={
              trialDays > 0
                ? `Começar ${trialDays} dias grátis`
                : annual
                  ? "Assinar plano anual"
                  : "Assinar por R$10/mês"
            }
          />
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-text-secondary">
          <Lock className="h-3 w-3" /> Pagamento seguro processado pela Stripe.
        </p>
      </div>
    </div>
  );
}
