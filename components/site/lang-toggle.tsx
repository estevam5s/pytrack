"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, LANGS } from "@/components/site/language-provider";

/** Botão de tradução (PT/EN/ES/中文/한국어) reutilizável — site e dashboard. */
export function LangToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Idioma / Language / 语言 / 언어"
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Languages className="h-4 w-4" />
        <span>{current.flag}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-xl">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setOpen(false);
                  if (l.code !== lang) setLang(l.code);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-surface-2",
                  l.code === lang ? "font-semibold text-primary-light" : "text-text-secondary",
                )}
              >
                <span>{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
