import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Map,
} from "lucide-react";

export const metadata = {
  title: "Página não encontrada (404) · PyTrack",
};

const SUGGESTIONS = [
  { href: "/", label: "Página inicial", desc: "Conheça a plataforma", icon: Home },
  { href: "/trilhas", label: "Trilhas", desc: "16 caminhos em Python", icon: Map },
  { href: "/precos", label: "Planos e preços", desc: "Do grátis ao vitalício", icon: Compass },
  { href: "/inicio", label: "Meu dashboard", desc: "Continuar estudando", icon: LayoutDashboard },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

      <div className="relative w-full max-w-2xl">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-2.5">
          <Image src="/new-logo.png" alt="PyTrack" width={40} height={40} className="h-10 w-10 rounded-lg object-contain" />
          <span className="text-lg font-bold">PyTrack</span>
        </Link>

        <p className="text-7xl font-black tracking-tight text-gradient sm:text-8xl">404</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Esta página não existe (ou foi movida)
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
          O endereço que você tentou acessar não foi encontrado. Pode ter sido
          digitado errado, removido ou nunca ter existido. Veja abaixo para onde
          ir — seu progresso continua salvo.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" /> Ir para a página inicial
          </Link>
          <Link
            href="/inicio"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            <LayoutDashboard className="h-4 w-4" /> Ir para o dashboard
          </Link>
        </div>

        {/* sugestões */}
        <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary/40 hover:bg-surface-2"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
                <s.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{s.label}</span>
                <span className="block text-xs text-text-secondary">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <LifeBuoy className="h-4 w-4" />
          Acha que isto é um erro?{" "}
          <Link href="/suporte" className="font-semibold text-primary-light hover:underline">
            Fale com o suporte
          </Link>
        </p>
      </div>
    </main>
  );
}
