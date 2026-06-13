"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type Freq = "mensal" | "anual";

interface Plan {
  name: string;
  info: string;
  price: { mensal: number; anual: number }; // anual = preço total/ano
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  free?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Grátis",
    info: "Experimente por 7 dias, sem cartão.",
    price: { mensal: 0, anual: 0 },
    free: true,
    cta: "Começar grátis",
    href: "/auth/register",
    features: [
      "7 dias de acesso grátis",
      "🗺️ Roadmaps de Carreira (todas as áreas)",
      "Trilha de Fundamentos de Python",
      "IDE Python no navegador",
    ],
  },
  {
    name: "Essencial",
    info: "Aprenda Python a fundo, todas as trilhas.",
    price: { mensal: 10, anual: 96 },
    cta: "Assinar Essencial",
    href: "/assinar",
    features: [
      "Todas as trilhas de conteúdo",
      "Exercícios com correção por IA",
      "🔥 Desafios Diários (streak)",
      "IDE Python + evolução e XP",
      "Materiais, livros e aulas",
    ],
  },
  {
    name: "Completo",
    info: "A plataforma inteira, do estudo à carreira.",
    price: { mensal: 19, anual: 182 },
    highlighted: true,
    cta: "Assinar Completo",
    href: "/assinar",
    features: [
      "Tudo do Essencial, mais:",
      "Comunidade, ranking e conexões",
      "🤖 Plano de Estudos com IA",
      "📅 Planejamento semanal",
      "🧭 Guia de carreira + 💰 financeiro",
      "Milhares de projetos para portfólio",
      "Especializações + consultor IA",
      "Vagas e perguntas de entrevista",
      "App Android e Desktop",
    ],
  },
  {
    name: "Suprema",
    info: "Domine tudo + Trilha Suprema e projeto final.",
    price: { mensal: 46, anual: 442 },
    cta: "Assinar Suprema",
    href: "/assinar",
    features: [
      "Tudo do Completo, mais:",
      "🧩 Extensão oficial para VS Code",
      "📱 Apps + Bot do Telegram",
      "👥 Perfis profissionais da Rede",
      "🚀 Construa seu SaaS (boilerplate IA)",
      "Trilha Suprema · 120+ módulos",
      "Deploy AWS + RAG + Agentes IA",
    ],
  },
];

export function PricingPlans() {
  const [freq, setFreq] = useState<Freq>("mensal");

  return (
    <div className="mt-10 flex flex-col items-center">
      {/* toggle mensal/anual */}
      <div className="mb-3 flex w-fit rounded-full border border-border bg-surface-2/40 p-1">
        {(["mensal", "anual"] as Freq[]).map((f) => (
          <button key={f} onClick={() => setFreq(f)} className="relative px-5 py-1.5 text-sm font-medium capitalize">
            <span className={cn("relative z-10 transition-colors", freq === f ? "text-white" : "text-text-secondary")}>{f}</span>
            {freq === f && <motion.span layoutId="freq-pill" transition={{ type: "spring", duration: 0.4 }} className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-light" />}
          </button>
        ))}
      </div>
      <p className="mb-8 text-xs text-secondary">💜 No plano anual você economiza ~20% (2 meses grátis)</p>

      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan, i) => {
          const off = plan.free ? 0 : Math.round(((plan.price.mensal * 12 - plan.price.anual) / (plan.price.mensal * 12)) * 100);
          const shown = freq === "mensal" ? plan.price.mensal : plan.price.anual;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border",
                plan.highlighted ? "border-primary/50 bg-surface shadow-lg shadow-primary/10" : "border-border bg-card",
              )}
            >
              {plan.highlighted && <BorderBeam />}
              {/* header */}
              <div className={cn("relative border-b border-border p-5", plan.highlighted && "bg-primary/5")}>
                <div className="absolute right-3 top-3 flex gap-1.5">
                  {plan.highlighted && <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-light"><Star className="h-3 w-3 fill-current" /> Popular</span>}
                  {freq === "anual" && !plan.free && off > 0 && <span className="rounded-md bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-secondary">-{off}%</span>}
                </div>
                <p className="text-sm font-bold uppercase tracking-wider text-text-secondary">{plan.name}</p>
                <p className="mt-1 h-9 text-xs text-text-secondary">{plan.info}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">
                    {plan.free ? "R$ 0" : (
                      <motion.span key={shown} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="inline-block">
                        R$ {shown}
                      </motion.span>
                    )}
                  </span>
                  <span className="pb-1.5 text-sm text-text-secondary">{plan.free ? "/ 7 dias" : freq === "mensal" ? "/mês" : "/ano"}</span>
                </div>
              </div>
              {/* features */}
              <div className="flex-1 space-y-2.5 p-5">
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", plan.highlighted ? "text-primary-light" : "text-secondary")} />
                    <span className={cn(f.endsWith("mais:") && "font-semibold text-foreground")}>{f}</span>
                  </div>
                ))}
              </div>
              {/* cta */}
              <div className="border-t border-border p-4">
                <Link href={plan.free || freq === "mensal" ? plan.href : `${plan.href}?ciclo=anual`} className={cn(
                  "flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90",
                  plan.highlighted ? "bg-gradient-to-r from-primary to-primary-light text-white" : "border border-border bg-surface-2 text-foreground hover:border-primary/40",
                )}>
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* vitalício */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 flex w-full flex-col items-center justify-between gap-3 rounded-2xl border border-secondary/40 bg-gradient-to-r from-secondary/10 to-primary/5 p-6 text-center sm:flex-row sm:text-left">
        <p className="flex items-center gap-2 text-sm text-text-secondary">
          <Crown className="h-5 w-5 shrink-0 text-secondary" />
          <span><span className="font-bold text-secondary">Vitalício — R$ 697</span> · pague uma vez e tenha <strong className="text-foreground">tudo para sempre</strong>, incluindo atualizações futuras.</span>
        </p>
        <Link href="/assinar" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-secondary to-primary px-5 py-2.5 text-sm font-semibold text-white">Garantir vitalício</Link>
      </motion.div>
    </div>
  );
}

// Borda animada (luz percorrendo o card destacado)
function BorderBeam() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] [mask:linear-gradient(#000,#000)]">
      <motion.div
        className="absolute aspect-square w-20 rounded-full bg-[radial-gradient(circle,rgba(153,86,246,0.7),transparent_60%)]"
        style={{ offsetPath: `rect(0 auto auto 0 round 80px)` }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
    </div>
  );
}
