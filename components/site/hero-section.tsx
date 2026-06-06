"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/site/site-button";
import { GradientText } from "./gradient-text";
import { DashboardMockup } from "./dashboard-mockup";
import { SIGNUP_URL } from "@/lib/site-links";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* fundo */}
      <div className="absolute inset-0 bg-grid radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span
            {...fade(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light"
          >
            <Sparkles className="h-3.5 w-3.5" /> Sua jornada Python começa aqui
          </motion.span>

          <motion.h1
            {...fade(0.08)}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Domine Python do básico à carreira profissional em{" "}
            <GradientText>Python, Dados, IoT e Engenharia</GradientText>
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            Uma plataforma completa para aprender Python com trilhas guiadas,
            exercícios, projetos reais, materiais, livros, cursos e
            acompanhamento de evolução em um dashboard profissional.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <Button href={SIGNUP_URL} variant="primary" size="lg">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#como-funciona" variant="outline" size="lg">
              <PlayCircle className="h-4 w-4" /> Ver como funciona
            </Button>
          </motion.div>

          <motion.div
            {...fade(0.32)}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-text-secondary"
          >
            {[
              ["74", "módulos"],
              ["2.4k+", "exercícios"],
              ["1.3k+", "projetos"],
              ["8", "trilhas"],
            ].map(([n, l]) => (
              <div key={l}>
                <span className="text-xl font-bold text-foreground">{n}</span>{" "}
                {l}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="glow-primary animate-float">
            <DashboardMockup />
          </div>
          {/* cards flutuantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-6 top-10 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl md:block"
          >
            <span className="text-green">●</span> +120 XP hoje
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -right-4 bottom-12 hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-xl md:block"
          >
            🐍 Nível Avançado desbloqueado
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
