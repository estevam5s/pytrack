"use client";

import { useState, useTransition } from "react";
import { Volume2, CheckCircle2, CreditCard, Users, LifeBuoy, Bell, Loader2 } from "lucide-react";
import { saveNotifPrefs } from "@/app/(dashboard)/configuracoes/notificacoes/actions";
import { playNotificationSound } from "@/lib/notification-sound";

type Prefs = { sound: boolean; plan: boolean; community: boolean; support: boolean; system: boolean };

const ITEMS: { key: keyof Prefs; icon: typeof Bell; label: string; desc: string }[] = [
  { key: "sound", icon: Volume2, label: "Som de notificação", desc: "Toca um som ao receber uma notificação." },
  { key: "plan", icon: CreditCard, label: "Plano e cobrança", desc: "Avisos de fim do período grátis, renovação e pagamentos." },
  { key: "community", icon: Users, label: "Comunidade", desc: "Conexões, seguidores, curtidas e respostas." },
  { key: "support", icon: LifeBuoy, label: "Suporte", desc: "Respostas da equipe aos seus chamados." },
  { key: "system", icon: Bell, label: "Sistema e novidades", desc: "Atualizações da plataforma e conquistas." },
];

export function NotificationSettings({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof Prefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    if (key === "sound") {
      try {
        localStorage.setItem("pytrack-notif-sound", next.sound ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (next.sound) playNotificationSound();
    }
    setSaved(false);
    start(async () => {
      await saveNotifPrefs(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-3">
      {ITEMS.map((it) => (
        <div key={it.key} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3.5">
          <span className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
              <it.icon className="h-4.5 w-4.5" />
            </span>
            <span>
              <span className="block text-sm font-medium">{it.label}</span>
              <span className="block text-xs text-text-secondary">{it.desc}</span>
            </span>
          </span>
          <button
            onClick={() => toggle(it.key)}
            role="switch"
            aria-checked={prefs[it.key]}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prefs[it.key] ? "bg-primary" : "bg-surface-2"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[it.key] ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-xs text-text-secondary">
        {pending ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando…</>
        ) : saved ? (
          <><CheckCircle2 className="h-3.5 w-3.5 text-green" /> Preferências salvas</>
        ) : (
          <button onClick={() => playNotificationSound()} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Volume2 className="h-3.5 w-3.5" /> Testar som
          </button>
        )}
      </div>
    </div>
  );
}
