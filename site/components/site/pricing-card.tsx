import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/lib/constants";
import { PRICING_FEATURES } from "@/lib/site-data";

export function PricingCard() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-0.5 rounded-3xl bg-brand opacity-40 blur-lg" />
      <div className="relative rounded-3xl border border-primary/30 bg-surface p-8">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" /> Plano Python Pro
          </span>
        </div>

        <div className="mt-6 flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">Acesso</span>
          <span className="pb-1.5 text-text-secondary">completo</span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          Tudo o que você precisa para evoluir em Python em um só lugar.
        </p>

        <ul className="mt-6 space-y-3">
          {PRICING_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-text-secondary">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          href={SIGNUP_URL}
          external
          variant="gradient"
          size="lg"
          className="mt-8 w-full"
        >
          Começar minha jornada Python
        </Button>
        <p className="mt-3 text-center text-xs text-text-secondary">
          Crie sua conta em segundos e comece agora.
        </p>
      </div>
    </div>
  );
}
