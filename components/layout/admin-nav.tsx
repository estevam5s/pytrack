"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ADMIN_NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith("/admin");
  const [open, setOpen] = useState(inAdmin);
  const Hub = ADMIN_NAV.hub.icon;

  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">
        Administração
      </p>
      {/* botão Admin (toggle) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          inAdmin
            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-foreground"
            : "text-text-secondary hover:bg-card hover:text-foreground",
        )}
      >
        <Hub className={cn("h-[18px] w-[18px] transition-transform group-hover:scale-110", inAdmin ? "text-primary-light" : "")} />
        <span>{ADMIN_NAV.hub.title}</span>
        <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 space-y-0.5 border-l border-border pl-2">
              <Link
                href={ADMIN_NAV.hub.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  pathname === "/admin"
                    ? "bg-primary/10 font-medium text-primary-light"
                    : "text-text-secondary hover:bg-card hover:text-foreground",
                )}
              >
                Painel
              </Link>
              {ADMIN_NAV.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary-light"
                        : "text-text-secondary hover:bg-card hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
