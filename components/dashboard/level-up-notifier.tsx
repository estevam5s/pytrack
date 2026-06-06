"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";
import { computeXp, levelFromXp, type ActivityCounts } from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";

const KEY = "pytrack-level-index";

export function LevelUpNotifier({
  serverCounts,
}: {
  serverCounts: { modules: number; books: number; courses: number };
}) {
  const [tier, setTier] = useState<{ name: string; emoji: string } | null>(
    null,
  );

  useEffect(() => {
    const check = () => {
      const local = readLocalActivity();
      const counts: ActivityCounts = {
        modules: serverCounts.modules,
        lessons: local.lessons,
        exercises: local.exercises,
        questions: local.questions,
        books: serverCounts.books,
        courses: serverCounts.courses,
      };
      const info = levelFromXp(computeXp(counts));

      let stored: number | null = null;
      try {
        const r = localStorage.getItem(KEY);
        stored = r === null ? null : parseInt(r, 10);
      } catch {
        /* ignore */
      }

      // primeira visita: registra o nível atual sem notificar
      if (stored === null || Number.isNaN(stored)) {
        try {
          localStorage.setItem(KEY, String(info.index));
        } catch {
          /* ignore */
        }
        return;
      }

      if (info.index > stored) {
        try {
          localStorage.setItem(KEY, String(info.index));
        } catch {
          /* ignore */
        }
        setTier({ name: info.tier.name, emoji: info.tier.emoji });
      } else if (info.index < stored) {
        // progresso resetado — atualiza silenciosamente
        try {
          localStorage.setItem(KEY, String(info.index));
        } catch {
          /* ignore */
        }
      }
    };

    check();
    window.addEventListener("focus", check);
    window.addEventListener("pytrack-progress", check as EventListener);
    const id = setInterval(check, 5000);
    return () => {
      window.removeEventListener("focus", check);
      window.removeEventListener("pytrack-progress", check as EventListener);
      clearInterval(id);
    };
  }, [serverCounts]);

  useEffect(() => {
    if (!tier) return;
    const t = setTimeout(() => setTier(null), 7000);
    return () => clearTimeout(t);
  }, [tier]);

  return (
    <AnimatePresence>
      {tier && (
        <motion.div
          initial={{ opacity: 0, y: -90, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -90, x: "-50%" }}
          transition={{ type: "spring", damping: 20, stiffness: 240 }}
          className="fixed left-1/2 top-4 z-[100] w-[min(92vw,430px)]"
          role="status"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-4 shadow-2xl">
            <div className="pointer-events-none absolute inset-0 bg-brand opacity-[0.12]" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl"
              >
                {tier.emoji}
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-light">
                  <PartyPopper className="h-3.5 w-3.5" /> Você subiu de nível!
                </p>
                <p className="text-lg font-bold leading-tight">
                  Agora você é{" "}
                  <span className="text-gradient">{tier.name}</span>
                </p>
                <p className="text-xs text-text-secondary">
                  Continue evoluindo e desbloqueie o próximo nível 🚀
                </p>
              </div>
              <button
                onClick={() => setTier(null)}
                aria-label="Fechar"
                className="shrink-0 self-start rounded-lg p-1 text-text-secondary hover:bg-surface hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
