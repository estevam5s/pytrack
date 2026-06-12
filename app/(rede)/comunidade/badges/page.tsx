import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Lock, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { evaluateMyBadges, getBadgeRanking } from "@/lib/badges";
import { TIER_COLOR, type BadgeTier } from "@/lib/badges-defs";

export const metadata = { title: "Conquistas · PyTrack Rede" };
export const dynamic = "force-dynamic";

const CATEGORIES = ["Trilhas", "Tecnologias", "Exercícios", "XP", "Social", "Conquistas"] as const;

export default async function BadgesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // avalia (concede novas) e retorna todas com status + ranking
  const [{ badges }, ranking] = await Promise.all([evaluateMyBadges(), getBadgeRanking(10)]);
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><Trophy className="h-6 w-6 text-[#d4af37]" /> Conquistas</h1>
          <p className="text-sm text-text-secondary">Desbloqueie badges concluindo trilhas, dominando tecnologias e evoluindo.</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
          <p className="text-xl font-bold text-[#d4af37]">{earned}<span className="text-text-secondary">/{badges.length}</span></p>
          <p className="text-[10px] text-text-secondary">conquistadas</p>
        </div>
      </div>

      {/* barra de progresso geral */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f0d97a]" style={{ width: `${Math.round((earned / badges.length) * 100)}%` }} />
      </div>

      {/* ranking de conquistas */}
      {ranking.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Crown className="h-5 w-5 text-[#d4af37]" /> Ranking de conquistas</h2>
          <div className="space-y-1.5">
            {ranking.map((r, i) => (
              <Link key={r.user_id} href={`/comunidade/perfil/${r.user_id}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
                <span className="w-5 text-center text-sm font-bold text-text-secondary">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
                {r.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary-light">{r.name.charAt(0)}</span>}
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.name}</span>
                {r.diamonds > 0 && <span className="text-xs text-[#5eead4]">💎 {r.diamonds}</span>}
                <span className="rounded-full bg-[#d4af37]/15 px-2 py-0.5 text-xs font-bold text-[#d4af37]">{r.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {CATEGORIES.map((cat) => {
        const list = badges.filter((b) => b.category === cat);
        if (!list.length) return null;
        const got = list.filter((b) => b.earned).length;
        return (
          <div key={cat} className="mb-6">
            <p className="mb-2 text-sm font-bold">{cat} <span className="text-text-secondary">· {got}/{list.length}</span></p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((b) => {
                const color = TIER_COLOR[b.tier as BadgeTier];
                return (
                  <div key={b.id} className={`rounded-xl border p-4 text-center transition-all ${b.earned ? "border-border bg-card" : "border-border/50 bg-card/40 opacity-60"}`}>
                    <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl" style={{ background: b.earned ? `${color}22` : "transparent", border: `2px solid ${b.earned ? color : "#3f3f46"}` }}>
                      {b.earned ? b.emoji : <Lock className="h-5 w-5 text-text-secondary" />}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-tight">{b.name}</p>
                    <p className="mt-0.5 text-[10px] text-text-secondary line-clamp-2">{b.description}</p>
                    <span className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase" style={{ color, background: `${color}1a` }}>{b.tier}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
