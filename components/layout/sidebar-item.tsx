"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
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

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={
        locked
          ? `Disponível no plano ${required === "completo" ? "Completo" : "Essencial"}`
          : undefined
      }
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary/10 text-foreground"
          : "text-text-secondary hover:bg-card hover:text-foreground",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active ? "text-primary" : "text-text-secondary group-hover:text-foreground",
        )}
      />
      <span className={cn("truncate", locked && "text-text-secondary/80")}>
        {item.title}
      </span>
      {badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {locked && badge === 0 && (
        <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-text-secondary/60" />
      )}
    </Link>
  );
}
