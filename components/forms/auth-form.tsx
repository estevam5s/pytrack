"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { signIn, signUp, type AuthResult } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

export function AuthForm({
  mode,
  referralCode,
}: {
  mode: "login" | "register";
  referralCode?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthResult, FormData>(action, {});
  const [showPw, setShowPw] = useState(false);
  const [ghLoading, setGhLoading] = useState(false);

  const signInWithGithub = async () => {
    setGhLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/inicio`,
      },
    });
    if (error) setGhLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/new-logo.png"
          alt="PyTrack"
          width={56}
          height={56}
          priority
          className="mb-4 h-14 w-14 rounded-xl object-contain"
        />
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {mode === "login"
            ? "Entre para continuar sua jornada Python."
            : "Comece a dominar o ecossistema Python hoje."}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {mode === "register" && referralCode && (
          <input type="hidden" name="ref" value={referralCode} />
        )}
        {mode === "register" && referralCode && (
          <div className="rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-xs text-secondary">
            🎁 Você foi convidado! Crie sua conta para começar.
          </div>
        )}
        {mode === "register" && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input id="name" name="name" placeholder="Seu nome" required />
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "register" && (
            <p className="text-xs text-text-secondary">Mínimo de 6 caracteres.</p>
          )}
        </div>

        {state.error && (
          <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton label={mode === "login" ? "Entrar" : "Cadastrar"} />
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-secondary">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={signInWithGithub}
        disabled={ghLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#24292e] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {ghLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        {ghLoading
          ? "Redirecionando…"
          : mode === "login"
            ? "Entrar com GitHub"
            : "Cadastrar com GitHub"}
      </button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {mode === "login" ? (
          <>
            Não tem conta?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
