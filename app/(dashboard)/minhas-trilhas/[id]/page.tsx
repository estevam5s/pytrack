import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { getContents, getProgressMap } from "@/lib/data/queries";
import { TrilhaOverall, ModuleStatusIcon, ModulePctLabel } from "@/components/dashboard/trilha-progress";
import { MODULES } from "@/lib/content/registry";
import { CertificateButton } from "@/components/certificate/certificate-button";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  TRILHAS,
  getTrilha,
  moduleInTrilha,
  moduleTier,
  canAccess,
} from "@/lib/trilhas";
import { TIER_LABEL } from "@/lib/billing-access";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return TRILHAS.map((t) => ({ id: t.id }));
}

export const dynamic = "force-dynamic";

export default async function TrilhaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trilha = getTrilha(id);
  if (!trilha) notFound();

  const user = await getCurrentUser();
  const [tier, contents, progress] = await Promise.all([
    user ? getUserTier(user.id) : Promise.resolve("free" as const),
    getContents(),
    getProgressMap(),
  ]);
  const slugProgress = new Map<string, number>();
  for (const c of contents)
    if (c.slug) slugProgress.set(c.slug, progress[c.id]?.progress_percentage ?? 0);

  const mods = MODULES.filter((m) => moduleInTrilha(trilha, m.area, m.slug)).sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const overall = mods.length
    ? Math.round(mods.reduce((s, m) => s + (slugProgress.get(m.slug) ?? 0), 0) / mods.length)
    : 0;
  const trilhaUnlocked = canAccess(tier, trilha.tier);
  const Icon = trilha.icon;

  // certificado já emitido para esta trilha?
  let existingCert: { credential_code: string } | null = null;
  if (user && overall >= 100) {
    const admin = createAdminClient();
    const { data } = await admin.from("certificates").select("credential_code").eq("user_id", user.id).eq("trilha_id", trilha.id).maybeSingle();
    existingCert = data as { credential_code: string } | null;
  }

  const firstAccessible = mods.find(
    (m) => canAccess(tier, moduleTier(m.area, m.slug)),
  );

  // agrupa por área (melhora a leitura, especialmente na Trilha Completa)
  const areaOrder: string[] = [];
  const byArea = new Map<string, typeof mods>();
  for (const m of mods) {
    if (!byArea.has(m.area)) {
      byArea.set(m.area, []);
      areaOrder.push(m.area);
    }
    byArea.get(m.area)!.push(m);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/minhas-trilhas" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Todas as trilhas
      </Link>

      {/* header */}
      <div className="card-gradient mt-4 overflow-hidden rounded-2xl border border-border p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br", trilha.accent)}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Trilha {trilha.tier === "free" ? "Grátis" : TIER_LABEL[trilha.tier]}
              </span>
              <h1 className="text-2xl font-bold">{trilha.title}</h1>
              <p className="text-sm text-text-secondary">{trilha.goal}</p>
            </div>
          </div>
          {trilhaUnlocked && firstAccessible && (
            <Button asChild>
              <Link href={`/conteudos/${firstAccessible.slug}`}>
                {overall > 0 ? "Continuar" : "Começar"} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4" /> {trilha.adModules} módulos</span>
          <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {trilha.adLessons} aulas</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~{trilha.adHours}h</span>
        </div>

        {trilhaUnlocked && (
          <TrilhaOverall serverFallback={overall} modules={mods.map((m) => ({ slug: m.slug, total: m.lessons.length, serverPct: slugProgress.get(m.slug) ?? 0 }))} />
        )}
      </div>

      {/* certificado — quando a trilha está 100% concluída */}
      {trilhaUnlocked && overall >= 100 && (
        <div className="mt-4">
          <CertificateButton trilhaId={trilha.id} existingCode={existingCert?.credential_code ?? null} />
        </div>
      )}

      {/* currículo (tópicos da trilha) */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          O que você vai aprender
        </p>
        <div className="flex flex-wrap gap-1.5">
          {trilha.topics.map((tp) => (
            <span key={tp} className="rounded-md bg-surface-2 px-2.5 py-1 text-xs text-text-secondary">
              {tp}
            </span>
          ))}
        </div>
      </div>

      {!trilhaUnlocked && (
        <Card className="mt-4 border-primary/30">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary">
              Esta trilha faz parte do plano{" "}
              <strong className="text-foreground">{TIER_LABEL[trilha.tier]}</strong>.
              Faça upgrade para desbloquear todos os módulos.
            </p>
            <Button asChild>
              <Link href="/assinar?upgrade=completo">Fazer upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* módulos agrupados por área */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Conteúdo da trilha · {mods.length} módulos
      </h2>
      <div className="space-y-7">
        {areaOrder.map((area) => (
          <section key={area}>
            <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
              {area}
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-normal text-text-secondary">
                {byArea.get(area)!.length}
              </span>
            </h3>
            <div className="space-y-2.5">
              {byArea.get(area)!.map((m) => {
                const mTier = moduleTier(m.area, m.slug);
                const accessible = canAccess(tier, mTier);
                const prog = slugProgress.get(m.slug) ?? 0;
                const done = prog >= 100;
                return (
                  <div key={m.slug} className="card flex items-center gap-4 p-4">
                    <ModuleStatusIcon slug={m.slug} total={m.lessons.length} serverPct={prog} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{m.title}</p>
                      <p className="text-xs text-text-secondary">
                        {m.lessons.length} lições
                        <ModulePctLabel slug={m.slug} total={m.lessons.length} serverPct={prog} accessible={accessible} />
                      </p>
                    </div>
                    {accessible ? (
                      <Link
                        href={`/conteudos/${m.slug}`}
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-light hover:underline"
                      >
                        {done ? "Revisar" : prog > 0 ? "Continuar" : "Estudar"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/assinar?upgrade=completo"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary hover:text-foreground"
                      >
                        <Lock className="h-3 w-3" /> {TIER_LABEL[mTier]}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
