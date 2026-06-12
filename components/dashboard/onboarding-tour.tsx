"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Check,
  Code2,
  LayoutDashboard,
  Rocket,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { completeTutorial } from "./onboarding-actions";
import { cn } from "@/lib/utils";

interface Step {
  icon: typeof Rocket;
  title: string;
  description: string;
  href?: string;
}

const STEPS: Step[] = [
  {
    icon: Rocket,
    title: "Bem-vindo à PyTrack! 🐍",
    description:
      "Sua plataforma completa para dominar o ecossistema Python — do básico à carreira. Em alguns passos, vamos te levar por cada área. Ao avançar, abrimos a tela correspondente para você já conhecer.",
  },
  {
    icon: LayoutDashboard,
    title: "Início — seu painel",
    description:
      "Aqui ficam seu nível, XP, progresso, atividades recentes e o pomodoro para estudar com ritmo. É a sua base.",
    href: "/inicio",
  },
  {
    icon: BookOpen,
    title: "Trilhas de aprendizado",
    description:
      "16 trilhas guiadas (Backend, Dados, IA, DevOps, IoT e mais), com lições do básico ao avançado. Escolha a que combina com seu objetivo.",
    href: "/minhas-trilhas",
  },
  {
    icon: Code2,
    title: "Exercícios & IDE Python",
    description:
      "Pratique com milhares de exercícios corrigidos por IA e rode Python direto no navegador, sem instalar nada.",
    href: "/exercicios",
  },
  {
    icon: Users,
    title: "Comunidade",
    description:
      "Uma rede social Python: publique dúvidas, projetos e conquistas, conecte-se e siga pessoas, e suba no ranking. (Disponível no plano Completo.)",
    href: "/comunidade",
  },
  {
    icon: TrendingUp,
    title: "Evolução",
    description:
      "Acompanhe seu progresso com gráficos, mapa de proficiência por área e histórico de estudo.",
    href: "/evolucao",
  },
  {
    icon: Award,
    title: "Carreira",
    description:
      "Roadmaps de especialização, consultor de carreira com IA, vagas e perguntas de entrevista para você chegar ao mercado.",
    href: "/minha-carreira",
  },
  {
    icon: Settings,
    title: "Conta & Segurança",
    description:
      "Em Configurações você gerencia o plano, ativa 2FA, conecta o GitHub, escolhe sua própria IA e personaliza tudo.",
    href: "/configuracoes",
  },
  {
    icon: Bot,
    title: "Tudo pronto! 🚀",
    description:
      "Explore no seu ritmo. Dica: comece uma trilha e resolva um exercício para ganhar seus primeiros XP. Bons estudos!",
  },
];

const DONE_KEY = "pytrack-tutorial-done";

export function OnboardingTour({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  // Só abre se o servidor pedir E o localStorage não marcar como concluído.
  // (evita reaparecer ao navegar/recarregar antes do flag do banco propagar)
  useEffect(() => {
    try {
      if (initialOpen && localStorage.getItem(DONE_KEY) !== "1") setOpen(true);
    } catch {
      if (initialOpen) setOpen(true);
    }
  }, [initialOpen]);

  const finish = () => {
    setOpen(false);
    try { localStorage.setItem(DONE_KEY, "1"); } catch { /* ignore */ }
    completeTutorial().catch(() => {});
  };

  // Apenas avança/volta o passo (sem navegar — navegar remontava o overlay e
  // travava o tutorial no início).
  const goTo = (idx: number) => setI(idx);

  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;
  const Icon = step?.icon ?? Rocket;

  return (
    <AnimatePresence>
      {open && step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card"
          >
            <button
              onClick={finish}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-text-secondary hover:bg-surface hover:text-foreground"
              aria-label="Pular tutorial"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-surface to-surface">
              <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-50" />
              <motion.div
                key={i}
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary-light"
              >
                <Icon className="h-8 w-8" />
              </motion.div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                    Passo {i + 1} de {STEPS.length}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-center gap-1.5">
                {STEPS.map((_, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === i ? "w-5 bg-primary" : "w-1.5 bg-border",
                    )}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <button
                  onClick={finish}
                  className="text-xs font-medium text-text-secondary hover:text-foreground"
                >
                  Pular
                </button>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <button
                      onClick={() => goTo(i - 1)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-foreground"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Anterior
                    </button>
                  )}
                  {isLast ? (
                    <button
                      onClick={finish}
                      className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Começar a estudar
                    </button>
                  ) : (
                    <button
                      onClick={() => goTo(i + 1)}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                    >
                      Próximo <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
