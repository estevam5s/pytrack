"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Botão/banner de instalação do PWA. variant "button" (inline) ou "banner" (flutuante). */
export function PWAInstall({ variant = "button" }: { variant?: "button" | "banner" }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // registra o service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    // já instalado?
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    try {
      if (localStorage.getItem("pytrack-pwa-dismissed") === "1") setDismissed(true);
    } catch {
      /* ignore */
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  if (installed || !deferred) return null;

  if (variant === "banner") {
    if (dismissed) return null;
    return (
      <div className="fixed bottom-5 left-5 z-[70] flex max-w-xs items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Instalar o app PyTrack</p>
          <p className="text-xs text-text-secondary">Acesso rápido, offline e sem navegador.</p>
        </div>
        <button onClick={install} className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
          Instalar
        </button>
        <button
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("pytrack-pwa-dismissed", "1");
            } catch {
              /* ignore */
            }
          }}
          className="shrink-0 text-text-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={install}
      className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
    >
      <Download className="h-4 w-4" /> Instalar app
    </button>
  );
}
