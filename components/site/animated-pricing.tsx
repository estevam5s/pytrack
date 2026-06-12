"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  price: number; // mensal (R$)
  yearlyPrice: number; // equivalente mensal no plano anual (R$)
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

export function AnimatedPricing({
  plans,
  title = "Planos simples e transparentes",
  description = "Escolha o plano ideal para você. Todos com 7 dias grátis e garantia de reembolso.",
}: {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: ["#29E0A9", "#5F75F2", "#9956F6", "#E254FF"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 32,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container py-16">
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto max-w-xl whitespace-pre-line text-text-secondary">{description}</p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", isMonthly ? "text-foreground" : "text-text-secondary")}>Mensal</span>
        <Switch ref={switchRef} checked={!isMonthly} onCheckedChange={handleToggle} />
        <span className={cn("text-sm font-medium", !isMonthly ? "text-foreground" : "text-text-secondary")}>
          Anual <span className="text-green">(−20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 40, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -16 : 0,
                    opacity: 1,
                    scale: plan.isPopular ? 1.04 : 0.97,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 26, delay: index * 0.1 }}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-surface p-6 text-center",
              plan.isPopular ? "border-primary/60 shadow-xl shadow-primary/10" : "border-border",
            )}
          >
            {plan.isPopular && (
              <>
                <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-brand opacity-20 blur" />
                <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl rounded-tr-2xl bg-gradient-to-r from-primary to-primary-light px-3 py-1">
                  <Star className="h-3.5 w-3.5 fill-white text-white" />
                  <span className="text-xs font-semibold text-white">Popular</span>
                </div>
              </>
            )}

            <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">{plan.name}</p>

            <div className="mt-5 flex items-end justify-center gap-1">
              <span className="text-5xl font-bold tracking-tight">
                R$&nbsp;
                <NumberFlow
                  value={isMonthly ? plan.price : plan.yearlyPrice}
                  format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  transformTiming={{ duration: 500, easing: "ease-out" }}
                  willChange
                  className="tabular-nums"
                />
              </span>
              <span className="pb-1.5 text-sm text-text-secondary">/{plan.period}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              {isMonthly ? "cobrado mensalmente" : "cobrado anualmente"}
            </p>

            <ul className="mt-5 flex flex-1 flex-col gap-2 text-left">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  <span className="text-text-secondary">{f}</span>
                </li>
              ))}
            </ul>

            <hr className="my-5 border-border" />

            <Link
              href={plan.href}
              className={cn(
                "group w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300",
                plan.isPopular
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 hover:opacity-90"
                  : "border border-border bg-surface-2 text-foreground hover:border-primary/50",
              )}
            >
              {plan.buttonText}
            </Link>
            <p className="mt-4 text-xs text-text-secondary">{plan.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
