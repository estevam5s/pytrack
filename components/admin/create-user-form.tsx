"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { createSupremaUser, type CreateUserResult } from "@/app/(dashboard)/configuracoes/admin/actions";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <UserPlus className="h-4 w-4" />
      {pending ? "Criando..." : "Criar usuário Suprema"}
    </button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useActionState<CreateUserResult, FormData>(
    createSupremaUser,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {state.success}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <Input id="name" name="name" placeholder="Nome do usuário" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <Input id="email" name="email" type="email" placeholder="email@exemplo.com" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Senha</label>
          <Input id="password" name="password" type="text" placeholder="mín. 6 caracteres" required />
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
