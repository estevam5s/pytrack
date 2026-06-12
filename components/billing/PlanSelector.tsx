"use client";

import { useState } from "react";
import { Check, Crown, Gift, Lock, Sparkles } from "lucide-react";
import { SubscribeButton } from "./SubscribeButton";
import { cn } from "@/lib/utils";
import { TIER_RANK, type Tier } from "@/lib/billing-access";

interface PlanDef {
  tier: Exclude<Tier, "free">;
  name: string;
  monthly: number;
  annualMonthly: number;
  annualTotal: number;
  badge?: "recomendado" | "premium";
  features: string[];
}

const PLANS: PlanDef[] = [
  {
    tier: "essencial",
    name: "Essencial",
    monthly: 10,
    annualMonthly: 8,
    annualTotal: 96,
    features: [
      "Todas as trilhas de conteúdo",
      "Exercícios com correção por IA",
      "IDE Python no navegador",
      "Evolução, XP e níveis",
      "Materiais, livros e aulas",
    ],
  },
  {
    tier: "completo",
    name: "Completo",
    monthly: 19,
    annualMonthly: 15,
    annualTotal: 182,
    badge: "recomendado",
    features: [
      "Tudo do Essencial, mais:",
      "Comunidade, ranking e conexões",
      "+1.300 projetos para portfólio",
      "Especializações (ML, Dados, DevOps, Cyber…)",
      "Consultor de carreira com IA",
      "Vagas e perguntas de entrevista",
      "App Android e Desktop (download)",
    ],
  },
  {
    tier: "suprema",
    name: "Suprema",
    monthly: 46,
    annualMonthly: 37,
    annualTotal: 442,
    badge: "premium",
    features: [
      "Tudo do Completo, mais:",
      "🧩 Extensão oficial para VS Code (exclusiva)",
      "Trilha Suprema Python Mastery",
      "120+ módulos · 1000+ aulas",
      "Projeto final: SaaS completo",
      "Deploy AWS + IA Generativa + RAG + Agentes",
      "API da plataforma + gerador de currículo",
    ],
  },
];

export function PlanSelector({
  trialDays = 7,
  currentTier = "free",
  defaultAnnual = false,
}: {
  trialDays?: number;
  currentTier?: Tier;
  defaultAnnual?: boolean;
}) {
  const [annual, setAnnual] = useState(defaultAnnual);
  const trialLabel = trialDays > 0 ? `Testar ${trialDays} dias grátis` : null;

  return (
    <div className="w-full">
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

      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = currentTier === p.tier;
          const included = TIER_RANK[currentTier] > TIER_RANK[p.tier];
          const isUpgrade = currentTier !== "free" && !isCurrent && !included;
          const premium = p.badge === "premium";
          const rec = p.badge === "recomendado";
          const planKey = `${p.tier}_${annual ? "annual" : "monthly"}`;
          return (
            <div
              key={p.tier}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6",
                premium || rec ? "border-primary/40 bg-surface" : "border-border bg-surface",
              )}
            >
              {(premium || rec) && (
                <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-25 blur" />
              )}
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  {premium && <Crown className="h-4 w-4 text-primary-light" />}
                  {rec && <Sparkles className="h-3.5 w-3.5 text-primary-light" />}
                  {p.name}
                </p>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                    <Check className="h-3 w-3" /> Atual
                  </span>
                ) : p.badge ? (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">
                    {premium ? "Máximo" : "Popular"}
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold">R$ {annual ? p.annualMonthly : p.monthly}</span>
                <span className="pb-1 text-text-secondary">/mês</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                {annual ? `R$${p.annualTotal}/ano` : "cobrado mensalmente"}
              </p>

              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.features.map((f, i) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", i === 0 && p.badge ? "text-primary-light" : "text-green")} />
                    <span className={i === 0 && p.badge ? "font-medium" : "text-text-secondary"}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <p className="rounded-xl border border-secondary/30 bg-secondary/10 py-3 text-center text-sm font-medium text-secondary">
                    Seu plano atual
                  </p>
                ) : included ? (
                  <p className="rounded-xl border border-border bg-surface-2 py-3 text-center text-sm font-medium text-text-secondary">
                    Incluído no seu plano
                  </p>
                ) : (
                  <SubscribeButton
                    plan={planKey}
                    label={isUpgrade ? "Fazer upgrade" : trialLabel ?? `Assinar ${p.name}`}
                    className={cn(
                      !p.badge &&
                        "!from-surface-2 !to-surface-2 !text-foreground !shadow-none ring-1 ring-border hover:!opacity-80",
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vitalício — pagamento único */}
      <div className="relative mt-5 overflow-hidden rounded-2xl border border-primary/40 bg-surface p-6">
        <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-30 blur" />
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary-light">
              <Crown className="h-4 w-4" /> Vitalício · pague uma vez, use para sempre
            </p>
            <p className="mt-1 max-w-md text-sm text-text-secondary">
              Acesso total e permanente a <strong>tudo</strong> — todas as trilhas,
              exercícios com IA, app, comunidade e as atualizações futuras. Sem
              mensalidade, nunca mais.
            </p>
          </div>
          <div className="w-full shrink-0 sm:w-auto sm:text-right">
            <div className="mb-2 flex items-end gap-1 sm:justify-end">
              <span className="text-4xl font-bold">R$ 697</span>
              <span className="pb-1 text-text-secondary">único</span>
            </div>
            {currentTier === "vitalicio" ? (
              <p className="rounded-xl border border-secondary/30 bg-secondary/10 px-6 py-3 text-center text-sm font-medium text-secondary">
                Seu plano atual
              </p>
            ) : (
              <div className="sm:w-64">
                <SubscribeButton plan="vitalicio" label="Quero acesso vitalício" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-xs text-text-secondary">
        {trialDays > 0 && (
          <span className="inline-flex items-center gap-1 text-green">
            <Gift className="h-3 w-3" /> {trialDays} dias grátis na primeira assinatura
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Lock className="h-3 w-3" /> Pagamento seguro via Stripe · cancele quando quiser
        </span>
      </div>
    </div>
  );
}
