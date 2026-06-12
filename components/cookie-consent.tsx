"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings2 } from "lucide-react";

const STORAGE_KEY = "pytrack-cookie-consent";

interface Prefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ necessary: true, analytics: true, marketing: true });

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // pequeno atraso para não competir com o carregamento da página
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function persist(p: Prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, ts: Date.now() }));
    } catch {
      /* ignore */
    }
    // aplica o consentimento ao Google Analytics (Consent Mode)
    try {
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      w.gtag?.("consent", "update", {
        analytics_storage: p.analytics ? "granted" : "denied",
        ad_storage: p.marketing ? "granted" : "denied",
      });
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-5">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Cookie className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Nós usamos cookies 🍪</p>
            <p className="mt-1 text-sm text-text-secondary">
              Usamos cookies para manter você logado, lembrar suas preferências e entender como você usa a plataforma —
              para melhorá-la continuamente. Você pode escolher o que aceitar. Veja nossa{" "}
              <Link href="/privacidade" className="text-primary-light hover:underline">Política de Privacidade</Link>.
            </p>

            {details && (
              <div className="mt-3 space-y-2 rounded-lg border border-border bg-surface p-3">
                <Row label="Necessários" desc="Essenciais para login e funcionamento. Sempre ativos." checked disabled />
                <Row
                  label="Analytics"
                  desc="Ajudam a entender o uso e melhorar a plataforma (Google Analytics)."
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                />
                <Row
                  label="Marketing"
                  desc="Usados para medir campanhas e atribuição de origem."
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => persist({ necessary: true, analytics: true, marketing: true })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"
              >
                <Check className="h-4 w-4" /> Aceitar todos
              </button>
              {details ? (
                <button
                  onClick={() => persist(prefs)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground"
                >
                  Salvar preferências
                </button>
              ) : (
                <button
                  onClick={() => setDetails(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground"
                >
                  <Settings2 className="h-4 w-4" /> Personalizar
                </button>
              )}
              <button
                onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
                className="ml-auto text-sm text-text-secondary hover:text-foreground"
              >
                Recusar opcionais
              </button>
            </div>
          </div>
          <button
            onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
            aria-label="Fechar"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-text-secondary hover:text-foreground sm:static"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, desc, checked, disabled, onChange }: { label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-text-secondary">{desc}</span>
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-surface-2"} ${disabled ? "opacity-60" : ""}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
