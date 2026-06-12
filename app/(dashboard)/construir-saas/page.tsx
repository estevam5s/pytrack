import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { SaasWizard } from "@/components/saas/saas-wizard";
import { SaasRoadmap } from "@/components/saas/saas-roadmap";
import { SaasCliCard } from "@/components/saas/saas-cli-card";

export const metadata = { title: "Construa seu SaaS · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ConstruirSaasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier as never, "suprema" as never)) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Projeto final exclusivo do plano Suprema</h1>
        <p className="mt-2 text-text-secondary">"Construa o seu SaaS" é o projeto final da PyTrack: escolha sua stack Python e construa um SaaS completo, do zero ao deploy, com um plano guiado. Disponível no plano <strong className="text-foreground">Suprema</strong> (R$46/mês).</p>
        <Link href="/assinar?upgrade=suprema" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Suprema</Link>
      </div>
    );
  }

  const { data: project } = await supabase.from("saas_projects").select("name, idea, stack, steps_done, repo_url").eq("user_id", user.id).maybeSingle();

  return (
    <div>
      <PageHeader
        title="Construa o seu SaaS"
        description="O projeto final da PyTrack: escolha sua stack Python, gere um plano de construção sob medida e desenvolva seu SaaS do zero ao deploy."
      />
      {project ? (
        <SaasRoadmap project={project as never} />
      ) : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <Rocket className="h-6 w-6 shrink-0 text-primary-light" />
            <p className="text-sm text-text-secondary">Responda algumas perguntas e a PyTrack monta um <strong className="text-foreground">roadmap completo</strong> — fundação, dados, auth, núcleo, interface, pagamentos, IA, segurança e deploy — adaptado às suas escolhas.</p>
          </div>
          <SaasWizard />
        </>
      )}
      <SaasCliCard canUse={tierAtLeast(tier as never, "completo" as never)} />
    </div>
  );
}
