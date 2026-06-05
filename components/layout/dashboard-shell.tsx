"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";
import { DesktopSidebar } from "./sidebar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
      <DesktopSidebar collapsed={collapsed} />
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
