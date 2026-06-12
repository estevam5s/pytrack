import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, Clock, Home, Layers, Lock } from "lucide-react";
import { getModule } from "@/lib/content/registry";
import { getProgressMap, getContents } from "@/lib/data/queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { moduleTier, canAccess } from "@/lib/trilhas";
import { TIER_LABEL } from "@/lib/billing-access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ModuleLessons } from "@/components/content/module-lessons";
import { LEVEL_LABELS, levelColor } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  const m = getModule(modulo);
  return { title: m ? `${m.title} · PyTrack` : "Módulo · PyTrack" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  const module = getModule(modulo);
  if (!module) notFound();

  const [contents, progressMap] = await Promise.all([
    getContents(),
    getProgressMap(),
  ]);
  const content = contents.find((c) => c.slug === modulo);
  const progress = content ? progressMap[content.id] : undefined;
  const pct = progress?.progress_percentage ?? 0;

  const user = await getCurrentUser();
  const tier = user ? await getUserTier(user.id) : "free";
  const reqTier = moduleTier(module.area, module.slug);
  const locked = !canAccess(tier, reqTier);

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/inicio" className="hover:text-foreground">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/minhas-trilhas" className="hover:text-foreground">
          Trilhas
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{module.title}</span>
      </nav>

      <div className="card-gradient mb-7 rounded-xl border border-border p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className="border-primary/30 bg-primary/10 text-primary">
            {module.partLabel}
          </Badge>
          <Badge className={levelColor(module.level)}>
            {LEVEL_LABELS[module.level]}
          </Badge>
          <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
            {module.area}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {module.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          {module.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" /> {module.lessons.length}{" "}
            lições
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> ~{module.estimatedHours}h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" /> {module.category}
          </span>
        </div>

        {pct > 0 && (
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-text-secondary">
              <span>Seu progresso</span>
              <span>{pct}%</span>
            </div>
            <Progress value={pct} />
          </div>
        )}
      </div>

      {locked ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold">
            Módulo do plano {TIER_LABEL[reqTier]}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Este módulo de <strong>{module.area}</strong> faz parte do plano{" "}
            {TIER_LABEL[reqTier]}. Faça upgrade para desbloquear este e todos os
            outros módulos avançados.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/assinar?upgrade=completo">Fazer upgrade</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-4 text-lg font-semibold">Conteúdo do módulo</h2>
          <ModuleLessons
            moduleSlug={module.slug}
            lessons={module.lessons.map((l) => ({
              slug: l.slug,
              title: l.title,
              order: l.order,
            }))}
          />
        </>
      )}
    </div>
  );
}
