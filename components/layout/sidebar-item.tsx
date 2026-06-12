"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";
import {
  requiredTierForPath,
  tierAtLeast,
  type Tier,
} from "@/lib/billing-access";

export function SidebarItem({
  item,
  tier = "free",
  badge = 0,
  onNavigate,
}: {
  item: NavItem;
  tier?: Tier;
  badge?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    item.href === "/inicio"
      ? pathname === "/inicio"
      : pathname.startsWith(item.href);
  const Icon = item.icon;

  const required = requiredTierForPath(item.href);
  const locked = !tierAtLeast(tier, required);
  // rota bloqueada leva direto para a tela de upgrade
  const href = locked ? `/assinar?upgrade=${required}` : item.href;

  // abre em nova aba (ex.: Comunidade — experiência standalone estilo LinkedIn)
  const openNewTab = item.newTab && !locked;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      target={openNewTab ? "_blank" : undefined}
      rel={openNewTab ? "noopener noreferrer" : undefined}
      title={
        locked
          ? `Disponível no plano ${required === "completo" ? "Completo" : "Essencial"}`
          : undefined
      }
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "border border-primary/40 bg-gradient-to-r from-primary/15 to-primary/[0.04] text-foreground shadow-sm"
          : "border border-transparent text-text-secondary hover:translate-x-0.5 hover:bg-card hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-all duration-200 group-hover:scale-110",
          active ? "text-primary-light" : "text-text-secondary group-hover:text-primary-light",
        )}
      />
      <span className={cn("truncate", locked && "text-text-secondary/80")}>
        {item.title}
      </span>
      {badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-red-500/40">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {locked && badge === 0 && (
        <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-text-secondary/60" />
      )}
      {active && badge === 0 && !locked && (
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-primary-light" />
      )}
    </Link>
  );
}
