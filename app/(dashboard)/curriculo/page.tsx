import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Crown, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeList } from "@/components/resume/resume-list";

export const metadata = { title: "Currículo · PyTrack" };
export const dynamic = "force-dynamic";

export default async function CurriculoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const tier = await getUserTier(user.id);

  if (!tierAtLeast(tier, "completo")) {
    return (
      <div>
        <PageHeader title="Gerador de currículo" description="Monte um currículo profissional e exporte em PDF, Word e TXT." />
        <Card className="border-primary/30">
          <CardContent className="p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light"><FileText className="h-7 w-7" /></span>
            <p className="mt-4 text-lg font-bold">Recurso do plano Completo</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              O gerador de currículo profissional está disponível no plano <strong>Completo (R$19/mês)</strong>.
              Modelos avançados, edição completa e exportação em PDF, Word e TXT.
            </p>
            <Link href="/assinar" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Fazer upgrade</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: resumes = [] } = await supabase
    .from("resumes")
    .select("id, title, template, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const isSuprema = tierAtLeast(tier, "suprema");

  return (
    <div>
      <PageHeader
        title="Gerador de currículo"
        description="Crie, edite e gerencie currículos profissionais. Exporte em PDF, Word (DOC/DOCX) e TXT."
      />
      {isSuprema && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary-light">
          <Crown className="h-3.5 w-3.5" /> Você tem acesso a todos os modelos premium (Suprema)
        </div>
      )}
      <ResumeList resumes={resumes ?? []} isSuprema={isSuprema} />
    </div>
  );
}
