"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn, signUp, type AuthResult } from "@/app/auth/actions";
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

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthResult, FormData>(action, {});

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/logo.png"
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
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />
        </div>

        {state.error && (
          <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton label={mode === "login" ? "Entrar" : "Cadastrar"} />
      </form>

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
