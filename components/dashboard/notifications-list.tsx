"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, CreditCard, Users, LifeBuoy, Trophy, Sparkles, MessageSquare,
  Trash2, CheckCheck, Filter, X, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteNotification, clearAllNotifications } from "@/lib/notifications/actions";

interface Notif {
  id: string; type: string; title: string; body: string | null; link: string | null; is_read: boolean; created_at: string;
}

const ICON: Record<string, typeof Bell> = {
  plan: CreditCard, community: Users, support: LifeBuoy, level: Trophy,
  success: Sparkles, message: MessageSquare, system: Bell, info: Bell,
};
const COLOR: Record<string, string> = {
  success: "text-green bg-green/10", message: "text-blue-400 bg-blue-400/10",
  plan: "text-[#d4af37] bg-[#d4af37]/10", level: "text-[#d4af37] bg-[#d4af37]/10",
  community: "text-primary-light bg-primary/10", support: "text-secondary bg-secondary/10",
};

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "Não lidas" },
  { key: "message", label: "Mensagens" },
  { key: "success", label: "Conquistas" },
  { key: "plan", label: "Plano" },
];

function dateGroup(iso: string): string {
  const d = new Date(iso); const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff < 7) return "Esta semana";
  if (diff < 30) return "Este mês";
  return "Mais antigas";
}

export function NotificationsList({ items }: { items: Notif[] }) {
  const router = useRouter();
  const [list, setList] = useState(items);
  const [filter, setFilter] = useState("all");
  const [clearing, setClearing] = useState(false);

  const filtered = list.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.is_read : n.type === filter,
  );

  // agrupa por período
  const groups = new Map<string, Notif[]>();
  for (const n of filtered) {
    const g = dateGroup(n.created_at);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(n);
  }

  async function onDelete(id: string) {
    setList((p) => p.filter((n) => n.id !== id));
    await deleteNotification(id);
  }
  async function onClearAll() {
    if (!confirm("Excluir todas as notificações?")) return;
    setClearing(true);
    setList([]);
    await clearAllNotifications();
    setClearing(false);
    router.refresh();
  }

  return (
    <div>
      {/* barra de filtros + ações */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const count = f.key === "all" ? list.length : f.key === "unread" ? list.filter((n) => !n.is_read).length : list.filter((n) => n.type === f.key).length;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors", filter === f.key ? "bg-primary text-white" : "border border-border text-text-secondary hover:text-foreground")}>
                {f.label}{count > 0 && <span className={cn("rounded-full px-1 text-[9px]", filter === f.key ? "bg-white/20" : "bg-surface-2")}>{count}</span>}
              </button>
            );
          })}
        </div>
        {list.length > 0 && (
          <button onClick={onClearAll} disabled={clearing} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-red-400/40 hover:text-red-400">
            {clearing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Limpar tudo
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-secondary">
          <Filter className="mx-auto mb-2 h-7 w-7 opacity-40" />
          <p className="text-sm">Nenhuma notificação {filter !== "all" ? "neste filtro" : ""}.</p>
        </div>
      ) : (
        [...groups.entries()].map(([group, ns]) => (
          <div key={group} className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">{group}</p>
            <div className="space-y-2">
              {ns.map((n) => {
                const Icon = ICON[n.type] ?? Bell;
                const color = COLOR[n.type] ?? "text-primary-light bg-primary/10";
                const body = (
                  <div className={cn("flex items-start gap-3 rounded-xl border bg-surface p-4 transition-colors", n.is_read ? "border-border" : "border-primary/30 bg-primary/[0.03]", n.link && "hover:border-primary/40")}>
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", color)}><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{n.title}</p>
                      {n.body && <p className="text-sm text-text-secondary">{n.body}</p>}
                      <p className="mt-1 text-xs text-text-secondary/70">{new Date(n.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                    {!n.is_read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />}
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(n.id); }} className="shrink-0 rounded p-1 text-text-secondary opacity-60 hover:bg-surface-2 hover:text-red-400 hover:opacity-100" aria-label="Excluir">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
                return n.link ? <Link key={n.id} href={n.link}>{body}</Link> : <div key={n.id}>{body}</div>;
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
