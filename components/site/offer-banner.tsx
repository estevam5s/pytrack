"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Tag } from "lucide-react";

interface Offer { badge: string; title: string; description: string | null; discount_pct: number; promo_code: string | null; ends_at: string | null }

export function OfferBanner({ offer }: { offer: Offer }) {
  const [closed, setClosed] = useState(false);
  const [left, setLeft] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("pytrack-offer-closed")) setClosed(true);
    if (!offer.ends_at) return;
    const end = new Date(offer.ends_at).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) { setLeft("encerrada"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offer.ends_at]);

  if (closed) return null;

  return (
    <div className="relative z-30 bg-gradient-to-r from-primary via-primary-light to-[#D946EF] text-white">
      <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold"><Tag className="h-4 w-4" /> {offer.badge}</span>
        <span>{offer.description || offer.title} — <strong>{offer.discount_pct}% OFF</strong></span>
        {offer.promo_code && <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-xs">{offer.promo_code}</span>}
        {offer.ends_at && left && <span className="rounded bg-black/20 px-2 py-0.5 text-xs">termina em {left}</span>}
        <Link href="/assinar" className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary hover:bg-white/90">Aproveitar →</Link>
      </div>
      <button onClick={() => { sessionStorage.setItem("pytrack-offer-closed", "1"); setClosed(true); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
    </div>
  );
}
