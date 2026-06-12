"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Registra uma visita por sessão (sessionStorage) sem incomodar o usuário.
export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const KEY = "pytrack-visit-tracked";
    if (sessionStorage.getItem(KEY)) return;
    let session = localStorage.getItem("pytrack-session");
    if (!session) { session = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("pytrack-session", session); }
    sessionStorage.setItem(KEY, "1");
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null, session }),
    }).catch(() => {});
  }, [pathname]);
  return null;
}
