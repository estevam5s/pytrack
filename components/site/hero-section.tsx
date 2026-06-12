"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/site/site-button";
import { GradientText } from "./gradient-text";
import { CodeShowcase } from "./code-showcase";
import { SIGNUP_URL } from "@/lib/site-links";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export interface HeroStats {
  trilhas: string;
  modulos: string;
  exercicios: string;
  projetos: string;
}

export function HeroSection({ stats }: { stats?: HeroStats }) {
  const s = stats ?? { trilhas: "17", modulos: "80+", exercicios: "5.2k+", projetos: "1.3k+" };
  return (
    <section className="relative overflow-hidden">
      {/* fundo limpo estilo nodejs: grade sutil + brilho discreto (aurora global atrás) */}
      <div className="absolute inset-0 bg-grid opacity-30 radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-14">
        <div>
          <motion.span
            {...fade(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light"
          >
            <Sparkles className="h-3.5 w-3.5" /> Plataforma 100% Python · com IA
          </motion.span>

          <motion.h1
            {...fade(0.08)}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Do primeiro <code className="rounded-lg bg-surface-2 px-2 py-0.5 text-3xl text-primary-light sm:text-4xl">print()</code> à{" "}
            <GradientText>carreira profissional em Python</GradientText>
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            Aprenda com <strong className="text-foreground">trilhas guiadas</strong>,
            pratique com <strong className="text-foreground">exercícios corrigidos por IA</strong>,
            rode Python no navegador e construa um portfólio real. Backend, Dados,
            IA, DevOps, IoT e mais — tudo em um só lugar.
          </motion.p>

          {/* selos de confiança */}
          <motion.div {...fade(0.2)} className="mt-5 flex flex-wrap items-center gap-2">
            {["7 dias grátis", "Sem cartão", "Cancele quando quiser", "Reembolso garantido"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2/60 px-2.5 py-1 text-xs text-text-secondary">
                <Check className="h-3 w-3 text-green" /> {b}
              </span>
            ))}
          </motion.div>

          <motion.div {...fade(0.24)} className="mt-7 flex flex-wrap gap-3">
            <Button href={SIGNUP_URL} variant="primary" size="lg">
              Começar grátis <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/precos" variant="outline" size="lg">
              <PlayCircle className="h-4 w-4" /> Ver planos
            </Button>
          </motion.div>

          <motion.div
            {...fade(0.32)}
            className="mt-10 grid max-w-md grid-cols-4 gap-3"
          >
            {[
              [s.trilhas, "trilhas"],
              [s.modulos, "módulos"],
              [s.exercicios, "exercícios"],
              [s.projetos, "projetos"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl border border-border bg-surface-2/40 p-3 text-center">
                <span className="block text-lg font-bold text-gradient sm:text-xl">{n}</span>
                <span className="text-xs text-text-secondary">{l}</span>
              </div>
            ))}
          </motion.div>

          {/* prova social: avatares */}
          <motion.div {...fade(0.4)} className="mt-6">
            <div className="inline-flex items-center rounded-full border border-border bg-surface-2/60 p-1 pr-3 shadow-sm">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=faces",
                ].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-surface"
                  />
                ))}
              </div>
              <p className="ml-3 text-xs text-text-secondary">
                Junte-se a <strong className="font-semibold text-foreground">milhares</strong> de devs aprendendo Python.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <CodeShowcase />
        </motion.div>
      </div>
    </section>
  );
}
