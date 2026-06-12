"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";
import { DesktopSidebar, type SidebarProfile } from "./sidebar";
import type { Tier } from "@/lib/billing-access";
import { cn } from "@/lib/utils";

export function DashboardShell({
  children,
  tier = "free",
  notif = 0,
  notifCount = 0,
  isAdmin = false,
  profile,
}: {
  children: React.ReactNode;
  tier?: Tier;
  notif?: number;
  notifCount?: number;
  isAdmin?: boolean;
  profile?: SidebarProfile;
}) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUIStore((s) => s.setSidebarCollapsed);

  // restaura a preferência salva
  useEffect(() => {
    try {
      if (localStorage.getItem("pytrack-sidebar-collapsed") === "1")
        setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, [setCollapsed]);

  return (
    <>
      <DesktopSidebar collapsed={collapsed} tier={tier} notif={notif} notifCount={notifCount} isAdmin={isAdmin} profile={profile} />
      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          collapsed ? "lg:pl-0" : "lg:pl-64",
        )}
      >
        {children}
      </div>
    </>
  );
}
