"use client";

import Image from "next/image";
import { ExternalLink, PanelLeftClose } from "lucide-react";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3011";
import { useUIStore } from "@/store/ui";
import { SidebarItem } from "./sidebar-item";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <Image
          src="/logo.png"
          alt="PyTrack"
          width={40}
          height={40}
          priority
          className="h-10 w-10 rounded-lg object-contain"
        />
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-foreground">
            PyTrack
          </p>
          <p className="text-[11px] text-text-secondary">Python Learning</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto hidden rounded-md p-1.5 text-text-secondary transition-colors hover:bg-card hover:text-foreground lg:inline-flex"
          aria-label="Esconder menu"
          title="Esconder menu"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
              {group}
            </p>
            {NAV_ITEMS.filter((i) => i.group === group).map((item) => (
              <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-2.5 border-t border-border p-4">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> Ir para o site
        </a>
        <div className="rounded-lg bg-gradient-to-br from-primary/15 to-secondary/10 p-3.5">
          <p className="text-xs font-semibold text-foreground">
            Dica do dia 🐍
          </p>
          <p className="mt-1 text-[11px] leading-snug text-text-secondary">
            Aprenda escolhendo a stack pelo problema, não pela popularidade.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DesktopSidebar({ collapsed }: { collapsed?: boolean }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:block",
        collapsed && "-translate-x-full",
      )}
    >
      <SidebarContent />
    </aside>
  );
}
