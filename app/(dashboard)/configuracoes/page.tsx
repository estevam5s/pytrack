import Link from "next/link";
import {
  Database,
  Info,
  Palette,
  ShieldAlert,
  UserCog,
  UserCircle,
  Calendar,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/forms/profile-form";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import {
  ClearLocalButton,
  ExportDataButton,
  ResetProgressButton,
  ThemeToggle,
} from "@/components/dashboard/settings-actions";

export const metadata = { title: "Configurações · PyTrack" };

const NAV = [
  { id: "conta", label: "Conta", icon: UserCircle },
  { id: "perfil", label: "Perfil", icon: UserCog },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "plataforma", label: "Plataforma", icon: Database },
  { id: "dados", label: "Dados e privacidade", icon: ShieldAlert },
  { id: "sobre", label: "Sobre", icon: Info },
];

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile();

  const head = (table: string) =>
    supabase.from(table).select("id", { count: "exact", head: true });
  const [contents, exercises, questions, projects, books, stack] =
    await Promise.all([
      head("contents"),
      head("practice_exercises"),
      head("interview_questions"),
      head("projects"),
      head("books"),
      head("stack_items"),
    ]);

  const supabaseProject = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .replace("https://", "")
    .split(".")[0];

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const platformStats = [
    { label: "Módulos", value: contents.count ?? 0 },
    { label: "Exercícios", value: exercises.count ?? 0 },
    { label: "Perguntas", value: questions.count ?? 0 },
    { label: "Projetos", value: projects.count ?? 0 },
    { label: "Livros", value: books.count ?? 0 },
    { label: "Tecnologias", value: stack.count ?? 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, perfil, aparência e seus dados na plataforma."
      />

      <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
        {/* Nav lateral */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-foreground"
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {/* Conta */}
          <Card id="conta" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                {user && (
                  <AvatarUpload
                    userId={user.id}
                    url={profile?.avatar_url ?? null}
                    name={profile?.name ?? null}
                    size={72}
                  />
                )}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <h2 className="text-lg font-bold">
                      {profile?.name ?? "Estudante Python"}
                    </h2>
                    <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                      Plano Gratuito
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1 text-sm text-text-secondary sm:flex-row sm:gap-4">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {user?.email}
                    </span>
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Desde {memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Perfil */}
          <Card id="perfil" className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-primary" /> Perfil e objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialName={profile?.name ?? ""}
                initialGoal={profile?.goal ?? ""}
                initialLevel={profile?.current_level ?? "basico"}
              />
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card id="aparencia" className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" /> Aparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-text-secondary">
                Escolha o tema da plataforma. O modo escuro é o padrão
                recomendado para reduzir o cansaço visual.
              </p>
              <ThemeToggle />
            </CardContent>
          </Card>

          {/* Plataforma */}
          <Card id="plataforma" className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> Plataforma e Supabase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
                  <span className="text-text-secondary">Projeto</span>
                  <span className="font-mono text-xs">{supabaseProject}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
                  <span className="text-text-secondary">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-secondary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Conectado
                  </span>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Conteúdo disponível
                </p>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {platformStats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-border bg-surface/60 p-3 text-center"
                    >
                      <p className="text-lg font-bold leading-none">
                        {s.value.toLocaleString("pt-BR")}
                      </p>
                      <p className="mt-1 text-[10px] text-text-secondary">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados e privacidade */}
          <Card id="dados" className="scroll-mt-20 border-danger/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-danger" /> Dados e privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4">
                <div>
                  <p className="text-sm font-medium">Exportar meus dados</p>
                  <p className="text-xs text-text-secondary">
                    Baixe seu perfil e progresso em JSON.
                  </p>
                </div>
                <ExportDataButton />
              </div>
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4">
                <div>
                  <p className="text-sm font-medium">Limpar progresso local</p>
                  <p className="text-xs text-text-secondary">
                    Remove lições, exercícios e perguntas marcados neste
                    navegador.
                  </p>
                </div>
                <ClearLocalButton />
              </div>
              <div className="flex items-start justify-between gap-4 rounded-lg border border-danger/30 bg-danger/5 p-4">
                <div>
                  <p className="text-sm font-medium text-danger">
                    Resetar todo o progresso
                  </p>
                  <p className="text-xs text-text-secondary">
                    Apaga seu progresso de módulos no banco. Não pode ser
                    desfeito.
                  </p>
                </div>
                <ResetProgressButton />
              </div>
            </CardContent>
          </Card>

          {/* Sobre */}
          <Card id="sobre" className="scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Sobre o PyTrack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-text-secondary">
              <p>
                Plataforma de aprendizado de todo o ecossistema Python — trilhas,
                exercícios com IA, perguntas de entrevista, projetos e consultor
                de carreira.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Tailwind", "Supabase", "OpenRouter"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
              <p className="text-xs">
                Versão 1.0 ·{" "}
                <Link href="/" className="text-primary hover:underline">
                  Voltar ao início
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
