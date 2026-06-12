import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Send, MessageSquare, Code2, Trophy, User, CreditCard, Sparkles, ShieldCheck,
  ArrowRight, Bot, Upload, CheckCircle2, Target, Trash2, BookOpen,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Bot do Telegram",
  description: "Use a PyTrack pelo Telegram: gerencie seu plano, resolva exercícios com correção por IA, veja trilhas, projetos e ranking — direto no chat com o @PyTrack_SaaS_Bot.",
};

const BOT_URL = "https://t.me/PyTrack_SaaS_Bot";

const FEATURES = [
  { icon: User, title: "Perfil & Plano", desc: "Veja XP, nível e assinatura; faça upgrade num toque." },
  { icon: Code2, title: "Exercícios com IA", desc: "Escolha um exercício, envie seu .py e a IA corrige na hora." },
  { icon: Target, title: "Desafio do dia", desc: "Um exercício novo todo dia para manter o ritmo." },
  { icon: Trophy, title: "Ranking & Conquistas", desc: "Acompanhe o top da comunidade e seus exercícios concluídos." },
  { icon: BookOpen, title: "Trilhas & Projetos", desc: "Liste as 17 trilhas e projetos para o portfólio." },
  { icon: Sparkles, title: "Menu profissional", desc: "Interface limpa por botões, com /limpar para zerar o histórico." },
];

const STEPS = [
  { icon: Send, title: "Abra o bot", desc: "Toque em \"Abrir no Telegram\" e dê /start." },
  { icon: ShieldCheck, title: "Faça login", desc: "Use /login com sua conta PyTrack — o bot identifica seu plano." },
  { icon: Target, title: "Escolha um exercício", desc: "/exercicios ou /desafio e selecione um." },
  { icon: Upload, title: "Envie sua solução", desc: "Mande o arquivo .py com o código." },
  { icon: CheckCircle2, title: "Receba a correção", desc: "A IA dá nota, feedback e marca como concluído (+XP)." },
];

export default function BotPage() {
  return (
    <>
      <PageHero
        badge="Telegram · @PyTrack_SaaS_Bot"
        title="A PyTrack no seu"
        highlight="Telegram"
        description="Um bot completo e poderoso: gerencie seu plano, resolva exercícios com correção por IA, veja trilhas, projetos e ranking — tudo pelo chat."
      />

      <section className="container max-w-5xl py-12">
        {/* cartão do bot */}
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-8 text-center sm:flex-row sm:text-left">
            <Image src="/bot-logo.jpg" alt="PyTrack Bot" width={96} height={96} className="rounded-3xl" />
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Bot className="h-5 w-5 text-primary-light" />
                <h2 className="text-2xl font-bold">PyTrack Bot</h2>
                <span className="rounded-full bg-[#2CA5E0]/15 px-2 py-0.5 text-xs font-medium text-[#2CA5E0]">@PyTrack_SaaS_Bot</span>
              </div>
              <p className="mt-2 text-text-secondary">
                Bot oficial da PyTrack. Faça login com sua conta e gerencie tudo pelo Telegram — com a mesma IA que corrige seus exercícios na plataforma.
              </p>
            </div>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2CA5E0] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
              <Send className="h-4 w-4" /> Abrir no Telegram
            </a>
          </div>
        </Reveal>

        {/* recursos */}
        <h3 className="mb-4 mt-12 text-xl font-bold">O que o bot faz</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><f.icon className="h-5 w-5" /></span>
                <p className="mt-3 font-semibold">{f.title}</p>
                <p className="text-sm text-text-secondary">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* como usar */}
        <h3 className="mb-4 mt-12 text-xl font-bold">Como resolver um exercício pelo bot</h3>
        <div className="grid gap-3 sm:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface p-4 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-light"><s.icon className="h-5 w-5" /></span>
                <p className="mt-2 text-xs font-bold text-primary-light">Passo {i + 1}</p>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-text-secondary">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* comandos */}
        <h3 className="mb-4 mt-12 text-xl font-bold">Comandos</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4 text-primary-light" /> Usuário</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["/menu", "/login", "/perfil", "/plano", "/exercicios", "/desafio", "/conquistas", "/trilhas", "/projetos", "/ranking", "/limpar", "/suporte"].map((c) => (
                <code key={c} className="rounded bg-surface-2 px-2 py-1 text-text-secondary">{c}</code>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary-light" /> Administrador</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["/admin", "/stats", "/usuarios", "/usuario", "/plano_set", "/broadcast"].map((c) => (
                <code key={c} className="rounded bg-surface-2 px-2 py-1 text-text-secondary">{c}</code>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-secondary">Comandos exclusivos para gerenciar usuários, planos e avisos.</p>
          </div>
        </div>

        {/* privacidade + cta */}
        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Trash2 className="h-4 w-4" /> A senha enviada no login é apagada automaticamente. Tokens renovados com segurança.
            </div>
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
              Começar no Telegram <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/docs/apps" className="text-xs text-text-secondary hover:text-foreground">Ver documentação completa →</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
