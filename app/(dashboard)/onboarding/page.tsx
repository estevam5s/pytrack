import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OnboardingGoals } from "@/components/onboarding/onboarding-goals";

export const metadata = { title: "Bem-vindo · PyTrack" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name =
    (user?.user_metadata?.name as string | undefined)?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
          <Sparkles className="h-3.5 w-3.5" /> Bem-vindo(a){name ? `, ${name}` : ""}!
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Qual é o seu <span className="text-gradient">objetivo</span> com Python?
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
          Escolha o caminho que mais combina com você. Vamos te levar direto para
          a trilha ideal — dá para mudar quando quiser.
        </p>
      </div>

      <div className="mt-10">
        <OnboardingGoals />
      </div>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Ainda não sabe?{" "}
        <Link href="/minhas-trilhas" className="font-semibold text-primary-light hover:underline">
          Explorar todas as trilhas
        </Link>
      </p>
    </div>
  );
}
