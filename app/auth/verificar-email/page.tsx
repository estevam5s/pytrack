import Link from "next/link";
import Image from "next/image";
import { MailCheck } from "lucide-react";
import { ResendButton } from "@/components/forms/resend-button";

export const metadata = { title: "Confirme seu e-mail · PyTrack" };

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-50" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <Image src="/new-logo.png" alt="PyTrack" width={44} height={44} className="mx-auto h-11 w-11 rounded-lg object-contain" />
        <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Confirme seu e-mail</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Enviamos um link de confirmação para{" "}
          <strong className="text-foreground">{email ?? "seu e-mail"}</strong>.
          Você precisa confirmar antes de acessar o dashboard.
        </p>
        <div className="mt-5 rounded-lg border border-border bg-surface-2 p-3 text-left text-xs text-text-secondary">
          <p className="font-semibold text-foreground">Não recebeu?</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>Verifique a caixa de spam/promoções.</li>
            <li>Confirme se digitou o e-mail corretamente.</li>
            <li>Reenvie o link abaixo.</li>
          </ul>
        </div>

        <div className="mt-5 space-y-2">
          {email && <ResendButton email={email} />}
          <Link
            href="/auth/login"
            className="block w-full rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-semibold transition-colors hover:text-foreground"
          >
            Já confirmei — fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
