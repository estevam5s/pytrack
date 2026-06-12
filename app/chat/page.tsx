import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { AiChatInterface } from "@/components/chat/ai-chat-interface";

export const metadata = { title: "Assistente IA · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/chat");

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "suprema" as never)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Assistente IA exclusivo do plano Suprema</h1>
        <p className="mt-2 max-w-md text-text-secondary">O Assistente IA da PyTrack — um chat completo estilo ChatGPT, com histórico de conversas — está disponível no plano <strong className="text-foreground">Suprema (R$46/mês)</strong>.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/inicio" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold">Voltar</Link>
          <Link href="/assinar?upgrade=suprema" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white"><Crown className="h-4 w-4" /> Assinar Suprema</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <Link href="/inicio" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Painel</Link>
        <span className="text-sm font-bold">🐍 PyTrack IA</span>
      </header>
      <div className="flex-1 p-3 sm:p-4">
        <AiChatInterface />
      </div>
    </div>
  );
}
