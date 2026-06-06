import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Github,
  Heart,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
import { BRAND, NAV_LINKS, SIGNUP_URL, LOGIN_URL } from "@/lib/site-links";
import { Button } from "@/components/site/site-button";
import { Reveal } from "./reveal";

const COLS = [
  {
    title: "Trilhas",
    links: [
      { label: "Fundamentos", href: "/trilhas" },
      { label: "Backend", href: "/trilhas" },
      { label: "Análise de Dados", href: "/trilhas" },
      { label: "Engenharia de Dados", href: "/trilhas" },
      { label: "IoT", href: "/trilhas" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Conteúdos", href: "/recursos" },
      { label: "Exercícios", href: "/recursos" },
      { label: "Projetos", href: "/#projetos" },
      { label: "Carreira", href: "/#carreira" },
      { label: "Preços", href: "/precos" },
    ],
  },
  {
    title: "Plataforma",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Entrar", href: LOGIN_URL },
      { label: "Criar conta", href: SIGNUP_URL },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "/sobre" },
      { label: "Privacidade", href: "/sobre" },
    ],
  },
];

const SOCIALS = [
  { Icon: Github, label: "GitHub" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-border bg-surface">
      {/* linha de gradiente no topo */}
      <div className="absolute inset-x-0 top-0 h-px bg-brand" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      {/* faixa CTA / newsletter */}
      <div className="container relative pt-14">
        <Reveal className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-2 to-surface p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Comece a dominar Python{" "}
                <span className="text-gradient">hoje mesmo</span>
              </h3>
              <p className="mt-2 max-w-md text-sm text-text-secondary">
                Junte-se a quem está evoluindo com trilhas, exercícios e projetos
                reais — de graça para começar.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
              <div className="flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-4 sm:w-64">
                <Mail className="h-4 w-4 text-text-secondary" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
                />
              </div>
              <Button href={SIGNUP_URL} variant="gradient" size="lg" className="shrink-0">
                Começar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* colunas */}
      <div className="container relative py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <Reveal className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={40}
                height={40}
                className="h-9 w-9 rounded-lg object-contain"
              />
              <span className="text-lg font-bold">{BRAND.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              A plataforma completa para dominar todo o ecossistema Python — do
              básico à carreira profissional.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </Reveal>

          {COLS.map((col, i) => (
            <Reveal key={col.title} delay={0.05 + i * 0.05}>
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-foreground"
                    >
                      <span className="h-px w-0 bg-primary-light transition-all duration-200 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-text-secondary sm:flex-row">
          <p className="inline-flex items-center gap-1.5">
            © {new Date().getFullYear()} {BRAND.name}. Feito com{" "}
            <Heart className="h-3.5 w-3.5 fill-magenta text-magenta" /> e Python.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {NAV_LINKS.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
