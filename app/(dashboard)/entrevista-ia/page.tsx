import { redirect } from "next/navigation";
import { Crown, MessageSquareText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { InterviewAI } from "@/components/dashboard/interview-ai";
import Link from "next/link";

export const metadata = { title: "Entrevista com IA · PyTrack" };
export const dynamic = "force-dynamic";

export default async function EntrevistaIaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const tier = await getUserTier(user.id);

  // exclusivo do plano Suprema (R$46) ou superior
  if (!tierAtLeast(tier, "suprema")) {
    return (
      <div>
        <PageHeader title="Preparação para entrevista com IA" description="Simule entrevistas reais com um entrevistador de IA." />
        <Card className="border-primary/30">
          <CardContent className="p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
              <Crown className="h-7 w-7" />
            </span>
            <p className="mt-4 text-lg font-bold">Recurso exclusivo do plano Suprema</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              A simulação de entrevista com IA está disponível no plano <strong>Suprema (R$46/mês)</strong>.
              Pratique entrevistas técnicas realistas, receba feedback e dicas personalizadas.
            </p>
            <Link href="/assinar" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">
              <Crown className="h-4 w-4" /> Fazer upgrade para Suprema
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // pré-preenche com o perfil do usuário (headline + skills)
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("users_profile")
    .select("headline, skills, goal, current_level")
    .eq("user_id", user.id)
    .maybeSingle();
  const exp = [
    profile?.headline,
    profile?.goal,
    (profile?.skills as string[] | null)?.length ? `Habilidades: ${(profile?.skills as string[]).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div>
      <PageHeader
        title="Preparação para entrevista com IA"
        description="Um entrevistador de IA conduz uma simulação realista, faz perguntas, dá feedback e dicas com base no seu perfil."
      />
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
        <MessageSquareText className="h-4 w-4 text-primary-light" />
        <span className="text-text-secondary">
          Responda como em uma entrevista real. A IA adapta as perguntas ao seu nível e à vaga-alvo, e ao final dá uma avaliação.
        </span>
      </div>
      <InterviewAI defaultExperience={exp} />
    </div>
  );
}
