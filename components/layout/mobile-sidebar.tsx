"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/ui";
import { SidebarContent } from "./sidebar";
import type { Tier } from "@/lib/billing-access";

export function MobileSidebar({ tier = "free", notif = 0 }: { tier?: Tier; notif?: number }) {
  const { mobileSidebarOpen, setMobileSidebar } = useUIStore();

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebar(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface"
          >
            <button
              onClick={() => setMobileSidebar(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-text-secondary hover:bg-card hover:text-foreground"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent tier={tier} notif={notif} onNavigate={() => setMobileSidebar(false)} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
