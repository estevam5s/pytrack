import Link from "next/link";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";

const PERKS = [
  "Trilhas guiadas do básico à carreira",
  "Exercícios com correção por IA",
  "IDE Python no navegador",
  "Comunidade e vagas do ecossistema",
];

const STATS = [
  ["74", "módulos"],
  ["2.4k+", "exercícios"],
  ["1.3k+", "projetos"],
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* painel de marca */}
      <aside className="relative hidden overflow-hidden bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-0 h-[420px] w-[520px] rounded-full bg-primary/20 blur-[130px]" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <Image
            src="/new-logo.png"
            alt="PyTrack"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-contain"
          />
          <span className="text-lg font-bold">PyTrack</span>
        </Link>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            <Sparkles className="h-3.5 w-3.5" /> Plataforma 100% Python
          </span>
          <h2 className="mt-5 max-w-md text-4xl font-bold leading-tight tracking-tight">
            Domine Python do básico à{" "}
            <span className="text-gradient">carreira profissional</span>
          </h2>
          <ul className="mt-7 space-y-3">
            {PERKS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2.5 text-sm text-text-secondary"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green/15 text-green">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex gap-8">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <p className="text-2xl font-bold text-gradient">{n}</p>
              <p className="text-xs text-text-secondary">{l}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* área do formulário */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
        <Link
          href="/"
          className="absolute left-4 top-4 text-sm text-text-secondary transition-colors hover:text-foreground lg:hidden"
        >
          ← Voltar ao site
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
