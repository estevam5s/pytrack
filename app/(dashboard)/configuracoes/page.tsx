import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  CreditCard,
  Database,
  Gift,
  Info,
  Palette,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  UserCog,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Configurações · PyTrack" };
export const dynamic = "force-dynamic";

const SECTIONS = [
  { href: "/configuracoes/conta", label: "Conta", desc: "E-mail, dados da conta e plano atual.", icon: UserCircle, accent: "text-primary-light bg-primary/10" },
  { href: "/configuracoes/perfil", label: "Perfil", desc: "Nome, avatar e informações públicas.", icon: UserCog, accent: "text-blue bg-blue/10" },
  { href: "/configuracoes/plano", label: "Plano e cobrança", desc: "Upgrade, downgrade, reembolso e faturas.", icon: CreditCard, accent: "text-green bg-green/10" },
  { href: "/configuracoes/seguranca", label: "Segurança (2FA)", desc: "Autenticador (2FA) e conta do GitHub.", icon: ShieldCheck, accent: "text-green bg-green/10" },
  { href: "/configuracoes/ia", label: "IA & Modelos", desc: "Use sua própria IA (OpenRouter, Claude, Gemini…).", icon: Bot, accent: "text-primary-light bg-primary/10" },
  { href: "/configuracoes/indicacoes", label: "Indique e ganhe", desc: "Convide amigos e ganhe meses grátis.", icon: Gift, accent: "text-magenta bg-magenta/10" },
  { href: "/configuracoes/aparencia", label: "Aparência", desc: "Tema claro/escuro e preferências.", icon: Palette, accent: "text-blue bg-blue/10" },
  { href: "/configuracoes/plataforma", label: "Plataforma", desc: "Preferências gerais da plataforma.", icon: Database, accent: "text-green bg-green/10" },
  { href: "/configuracoes/dados", label: "Dados e privacidade", desc: "Seus dados, exportação e exclusão.", icon: ShieldAlert, accent: "text-magenta bg-magenta/10" },
  { href: "/configuracoes/sobre", label: "Sobre", desc: "Sobre a plataforma e ajuda.", icon: Info, accent: "text-text-secondary bg-surface-2" },
];

const TIER_BADGE: Record<Tier, string> = {
  free: "border-border bg-surface-2 text-text-secondary",
  essencial: "border-secondary/30 bg-secondary/10 text-secondary",
  completo: "border-primary/30 bg-primary/10 text-primary-light",
  suprema: "border-primary/40 bg-primary/10 text-primary-light",
  vitalicio: "border-primary/50 bg-gradient-to-r from-primary/20 to-magenta/10 text-primary-light",
};

function SectionGrid({ items }: { items: typeof SECTIONS }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <Link key={s.href} href={s.href} className="card card-hover group flex items-start gap-3 p-5">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.accent)}>
            <s.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-semibold">
              {s.label}
              <ArrowRight className="h-3.5 w-3.5 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
            <p className="text-sm text-text-secondary">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function ConfiguracoesHomePage() {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const [{ data: profile }, tier] = await Promise.all([
    supabase.from("users_profile").select("name, avatar_url").eq("user_id", user?.id ?? "").maybeSingle(),
    user ? getUserTier(user.id) : Promise.resolve("free" as Tier),
  ]);
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="space-y-7">
      {/* cabeçalho do usuário */}
      <Card className="overflow-hidden border-primary/20">
        <div className="relative bg-gradient-to-br from-primary/15 via-surface to-surface p-6">
          <div className="pointer-events-none absolute inset-0 bg-grid radial-fade opacity-40" />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="" width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary-light">
                  {(profile?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-lg font-bold">{profile?.name ?? "Sua conta"}</p>
                <p className="text-sm text-text-secondary">{user?.email}</p>
                <p className="mt-0.5 text-xs text-text-secondary">Membro desde {memberSince}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", TIER_BADGE[tier])}>
                Plano {TIER_LABEL[tier]}
              </span>
              <Link href="/configuracoes/plano" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-light hover:underline">
                Gerenciar plano <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* seções */}
      <SectionGrid items={SECTIONS} />
    </div>
  );
}
