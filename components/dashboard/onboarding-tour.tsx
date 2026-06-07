"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "pytrack-onboarded-v1";

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
      "Sua plataforma completa para dominar todo o ecossistema Python — do básico à carreira. Vamos te mostrar as principais áreas em 30 segundos.",
  },
  {
    icon: LayoutDashboard,
    title: "Início",
    description:
      "Seu painel: nível, XP, gráficos de evolução, atividades recentes e o pomodoro 'Foco com café' para estudar com ritmo.",
    href: "/inicio",
  },
  {
    icon: Users,
    title: "Comunidade",
    description:
      "Uma rede social Python: publique dúvidas, projetos e conquistas, ajude colegas, siga pessoas, veja vagas e suba no ranking.",
    href: "/comunidade",
  },
  {
    icon: BookOpen,
    title: "Conteúdos & Trilhas",
    description:
      "Aprenda por trilhas guiadas com lições em Markdown cobrindo todo o ecossistema: fundamentos, backend, dados, IoT e mais.",
    href: "/minhas-trilhas",
  },
  {
    icon: Code2,
    title: "Exercícios & IDE Python",
    description:
      "Pratique com centenas de exercícios e correção por IA, e rode Python direto no navegador na IDE integrada.",
    href: "/exercicios",
  },
  {
    icon: TrendingUp,
    title: "Evolução",
    description:
      "Acompanhe seu progresso com análises profissionais, mapa de proficiência e histórico de estudo.",
    href: "/evolucao",
  },
  {
    icon: Award,
    title: "Carreira & Especializações",
    description:
      "Roadmaps de especialização (Dados, Backend, IoT...), consultor de carreira com IA, perguntas de entrevista e vagas.",
    href: "/especializacoes",
  },
  {
    icon: Bot,
    title: "Tudo pronto! 🚀",
    description:
      "Explore no seu ritmo. Dica: comece concluindo uma lição em Conteúdos e resolvendo um exercício para ganhar seus primeiros XP.",
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

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
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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

            {/* topo com gradiente */}
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
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                  {step.href && (
                    <Link
                      href={step.href}
                      onClick={finish}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-light hover:underline"
                    >
                      Ir para esta área <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* progresso */}
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

              {/* controles */}
              <div className="mt-5 flex items-center justify-between gap-2">
                <button
                  onClick={finish}
                  className="text-xs font-medium text-text-secondary hover:text-foreground"
                >
                  Pular tutorial
                </button>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <button
                      onClick={() => setI((n) => n - 1)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-foreground"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Anterior
                    </button>
                  )}
                  {isLast ? (
                    <button
                      onClick={finish}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                    >
                      <Check className="h-3.5 w-3.5" /> Começar
                    </button>
                  ) : (
                    <button
                      onClick={() => setI((n) => n + 1)}
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
