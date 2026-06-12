"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck, Heart, MessageSquare, UserPlus, AtSign, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface CNotif { id: string; type: string; message: string | null; post_id: string | null; read: boolean; created_at: string }
type Tab = "all" | "unread";

function icon(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("like") || t.includes("react")) return Heart;
  if (t.includes("comment") || t.includes("reply")) return MessageSquare;
  if (t.includes("follow") || t.includes("connect")) return UserPlus;
  if (t.includes("mention")) return AtSign;
  return Info;
}
function ago(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "agora"; if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24); return d < 7 ? `${d}d` : new Date(iso).toLocaleDateString("pt-BR");
}

export function CommunityNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CNotif[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("community_notifications").select("id, type, message, post_id, read, created_at").order("created_at", { ascending: false }).limit(30);
    setItems((data ?? []) as CNotif[]);
  }
  useEffect(() => { if (open) load(); }, [open]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = items.filter((n) => !n.read).length;
  const shown = tab === "unread" ? items.filter((n) => !n.read) : items;

  async function markAll() {
    const supabase = createClient();
    await supabase.from("community_notifications").update({ read: true }).eq("read", false);
    setItems((p) => p.map((n) => ({ ...n, read: true })));
  }
  async function markOne(id: string) {
    const supabase = createClient();
    await supabase.from("community_notifications").update({ read: true }).eq("id", id);
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative flex w-[76px] flex-col items-center" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex flex-col items-center gap-0.5 py-1.5 text-[11px] text-text-secondary hover:text-foreground">
        <span className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
        </span>
        Avisos
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[340px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-border bg-card text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-3.5">
            <h3 className="text-sm font-bold">Avisos da Rede</h3>
            <button onClick={markAll} title="Marcar todas como lidas" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-2 hover:text-foreground"><CheckCheck className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-1 border-b border-border px-3 py-2">
            {([["all", "Todas", items.length], ["unread", "Não lidas", unread]] as [Tab, string, number][]).map(([k, l, n]) => (
              <button key={k} onClick={() => setTab(k)} className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium", tab === k ? "bg-primary/15 text-primary-light" : "text-text-secondary hover:bg-surface-2")}>
                {l} <span className={cn("rounded-full px-1.5 text-[10px] font-bold", tab === k ? "bg-primary/25" : "bg-surface-2")}>{n}</span>
              </button>
            ))}
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {shown.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 py-12 text-center">
                <div className="rounded-full bg-surface-2 p-4"><BellOff className="h-6 w-6 text-text-secondary" /></div>
                <p className="text-sm font-medium text-text-secondary">{tab === "unread" ? "Tudo em dia!" : "Sem avisos ainda."}</p>
              </div>
            ) : (
              <div className="divide-y divide-dashed divide-border/60">
                {shown.map((n) => {
                  const Icon = icon(n.type);
                  return (
                    <Link key={n.id} href={n.post_id ? `/comunidade/post/${n.post_id}` : "/comunidade/notificacoes"} onClick={() => { markOne(n.id); setOpen(false); }} className={cn("flex gap-3 p-3.5 transition-colors hover:bg-surface-2", !n.read && "bg-primary/[0.06]")}>
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", !n.read ? "bg-primary/15 text-primary-light" : "bg-surface-2 text-text-secondary")}><Icon className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug">{n.message || "Nova interação"}</p>
                        <p className="mt-1 text-[11px] text-text-secondary/70">{ago(n.created_at)}</p>
                      </div>
                      {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <Link href="/comunidade/notificacoes" onClick={() => setOpen(false)} className="block border-t border-border p-3 text-center text-xs font-semibold text-primary-light hover:bg-surface-2">Ver todos os avisos</Link>
        </div>
      )}
    </div>
  );
}
