"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Linkedin, Crown, Sparkles, Flame } from "lucide-react";
import { computeXp, levelFromXp, type ActivityCounts } from "@/lib/level";
import { readLocalActivity } from "@/lib/client-progress";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/navigation";
import { SidebarItem } from "./sidebar-item";
import { AdminNav } from "./admin-nav";
import { PWAInstall } from "@/components/pwa-install";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";
import { cn } from "@/lib/utils";

const TIER_BADGE: Record<Tier, string> = {
  free: "border-border bg-surface-2 text-text-secondary",
  essencial: "border-secondary/30 bg-secondary/10 text-secondary",
  completo: "border-primary/30 bg-primary/10 text-primary-light",
  suprema: "border-primary/40 bg-gradient-to-r from-primary/20 to-magenta/10 text-primary-light",
  vitalicio: "border-primary/50 bg-gradient-to-r from-primary/25 to-magenta/15 text-primary-light",
};

export interface SidebarProfile {
  name: string;
  avatar: string | null;
  streak: number;
  serverCounts: { modules: number; books: number; courses: number };
}

export function SidebarContent({
  tier = "free",
  notif = 0,
  notifCount = 0,
  isAdmin = false,
  profile,
  onNavigate,
}: {
  tier?: Tier;
  notif?: number;
  notifCount?: number;
  isAdmin?: boolean;
  profile?: SidebarProfile;
  onNavigate?: () => void;
}) {
  const badgeHref = isAdmin ? "/admin/mensagens" : "/suporte";
  const topTier = tier === "suprema" || tier === "vitalicio";

  // XP/nível computado igual ao header (serverCounts + atividade local)
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });
  useEffect(() => {
    const sync = () => setLocal(readLocalActivity());
    sync();
    const id = setInterval(sync, 5000);
    window.addEventListener("pytrack-progress", sync as EventListener);
    return () => { clearInterval(id); window.removeEventListener("pytrack-progress", sync as EventListener); };
  }, []);
  const counts: ActivityCounts = {
    modules: profile?.serverCounts.modules ?? 0,
    lessons: local.lessons, exercises: local.exercises, questions: local.questions,
    books: profile?.serverCounts.books ?? 0, courses: profile?.serverCounts.courses ?? 0,
  };
  const xp = computeXp(counts);
  const level = levelFromXp(xp);
  const xpGoal = level.next ? level.next.min : xp;
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex h-16 items-center gap-2.5 overflow-hidden border-b border-border px-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="group relative">
          <span className="absolute -inset-1 rounded-xl bg-brand opacity-0 blur transition-opacity duration-300 group-hover:opacity-40" />
          <Image
            src="/new-logo.png"
            alt="PyTrack"
            width={40}
            height={40}
            priority
            className="relative h-10 w-10 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="relative leading-tight">
          <p className="text-sm font-bold tracking-tight text-foreground">PyTrack</p>
          <p className="text-[11px] text-text-secondary">Python Learning</p>
        </div>
      </div>

      {/* badge do plano */}
      <Link
        href="/configuracoes/plano"
        onClick={onNavigate}
        className="mx-3 mt-3 flex items-center justify-between rounded-lg border border-border bg-surface-2/60 px-3 py-2 transition-colors hover:border-primary/40"
      >
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          {topTier ? <Crown className="h-3.5 w-3.5 text-primary-light" /> : <Sparkles className="h-3.5 w-3.5 text-primary-light" />}
          Plano
        </span>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", TIER_BADGE[tier])}>
          {TIER_LABEL[tier]}
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter(
            (i) => i.group === group && (!i.adminOnly || isAdmin) && (!i.userOnly || !isAdmin),
          );
          if (items.length === 0) return null;
          return (
            <div key={group} className="space-y-1">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
                {group}
              </p>
              {items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  tier={tier}
                  badge={item.href === "/notificacoes" ? notifCount : item.href === badgeHref ? notif : 0}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          );
        })}

        {/* Admin colapsável (só para administradores) */}
        {isAdmin && <AdminNav onNavigate={onNavigate} />}
      </nav>

      <div className="space-y-2.5 border-t border-border p-4">
        <div className="[&>button]:w-full [&>button]:justify-center">
          <PWAInstall variant="button" />
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> Ir para o site
        </Link>
        {/* card de perfil com XP + streak */}
        {profile && (
          <Link href="/perfil" onClick={onNavigate} className="block rounded-xl border border-border bg-surface-2/60 p-3 transition-colors hover:border-primary/40">
            <div className="flex items-center gap-2.5">
              {profile.avatar ? (
                <Image src={profile.avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-light">{profile.name.charAt(0).toUpperCase()}</span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{profile.name}</p>
                <p className="text-[11px] text-text-secondary">{level.tier.emoji} {level.tier.name}</p>
              </div>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${level.progressToNext}%` }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-text-secondary">
              <span>{xp.toLocaleString("pt-BR")}{level.next ? ` / ${xpGoal.toLocaleString("pt-BR")}` : ""} XP</span>
              <span className="inline-flex items-center gap-1 text-orange-400"><Flame className="h-3 w-3" /> {profile.streak}d</span>
            </div>
          </Link>
        )}
        <div className="rounded-lg bg-gradient-to-br from-primary/15 to-secondary/10 p-3.5">
          <p className="text-xs font-semibold text-foreground">
            Dica do dia 🐍
          </p>
          <p className="mt-1 text-[11px] leading-snug text-text-secondary">
            Aprenda escolhendo a stack pelo problema, não pela popularidade.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href="https://github.com/PyTrackOrganization"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-text-secondary transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/company/pytrack/about/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-text-secondary transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function DesktopSidebar({
  collapsed,
  tier = "free",
  notif = 0,
  notifCount = 0,
  isAdmin = false,
  profile,
}: {
  collapsed?: boolean;
  tier?: Tier;
  notif?: number;
  notifCount?: number;
  isAdmin?: boolean;
  profile?: SidebarProfile;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:block",
        collapsed && "-translate-x-full",
      )}
    >
      <SidebarContent tier={tier} notif={notif} notifCount={notifCount} isAdmin={isAdmin} profile={profile} />
    </aside>
  );
}
