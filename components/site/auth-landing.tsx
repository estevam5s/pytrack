import Link from "next/link";
import { ArrowRight, Check, Terminal } from "lucide-react";
import { Button } from "@/components/site/site-button";
import { GradientText } from "./gradient-text";
import { LOGIN_URL, SIGNUP_URL, BRAND } from "@/lib/site-links";

const PERKS = [
  "Acesso a todas as trilhas Python",
  "Exercícios com feedback de IA",
  "Milhares de projetos práticos",
  "Dashboard de evolução com XP e níveis",
];

export function AuthLanding({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
      <div className="container relative grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
              <Terminal className="h-5 w-5 text-background" />
            </span>
            <span className="text-lg font-bold">{BRAND.name}</span>
          </Link>
          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {isSignup ? (
              <>
                Crie sua conta e comece a <GradientText>dominar Python</GradientText>
              </>
            ) : (
              <>
                Bem-vindo de volta à sua <GradientText>jornada Python</GradientText>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-md text-text-secondary">
            {isSignup
              ? "Em segundos você acessa o dashboard completo com trilhas, exercícios, projetos e acompanhamento de evolução."
              : "Entre para continuar de onde parou e acompanhar sua evolução no ecossistema Python."}
          </p>
          <ul className="mt-7 space-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-text-secondary">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green/15 text-green">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="border-gradient rounded-3xl p-8">
            <h2 className="text-xl font-bold">
              {isSignup ? "Criar conta gratuita" : "Entrar na plataforma"}
            </h2>
            <p className="mt-1.5 text-sm text-text-secondary">
              {isSignup
                ? "O cadastro e o login acontecem na plataforma, com segurança."
                : "Acesse o dashboard com seu e-mail e senha."}
            </p>

            <Button
              href={isSignup ? SIGNUP_URL : LOGIN_URL}
             
              variant="gradient"
              size="lg"
              className="mt-6 w-full"
            >
              {isSignup ? "Criar minha conta" : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs text-text-secondary">
              <span className="h-px flex-1 bg-border" /> ou{" "}
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              href={isSignup ? LOGIN_URL : SIGNUP_URL}
             
              variant="outline"
              className="w-full"
            >
              {isSignup ? "Já tenho conta — Entrar" : "Criar uma conta"}
            </Button>

            <p className="mt-6 text-center text-xs text-text-secondary">
              {isSignup ? (
                <>
                  Ao criar a conta, você acessa a{" "}
                  <Link href="/" className="text-primary-light hover:underline">
                    plataforma PyTrack
                  </Link>
                  .
                </>
              ) : (
                <>
                  Novo por aqui?{" "}
                  <Link
                    href="/cadastro"
                    className="text-primary-light hover:underline"
                  >
                    Crie sua conta
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
