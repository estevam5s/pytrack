import Link from "next/link";
import { Github, Linkedin, Terminal, Twitter, Youtube } from "lucide-react";
import { BRAND, NAV_LINKS, SIGNUP_URL } from "@/lib/constants";

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
      { label: "Projetos", href: "/projetos" },
      { label: "Carreira", href: "/carreira" },
      { label: "Preços", href: "/precos" },
    ],
  },
  {
    title: "Plataforma",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Entrar", href: SIGNUP_URL },
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

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
                <Terminal className="h-5 w-5 text-background" />
              </span>
              <span className="text-lg font-bold">{BRAND.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              A plataforma completa para dominar todo o ecossistema Python — do
              básico à carreira profissional.
            </p>
            <div className="mt-5 flex gap-2">
              {[Github, Linkedin, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-white"
                  aria-label="rede social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-secondary transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-text-secondary sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            {NAV_LINKS.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
