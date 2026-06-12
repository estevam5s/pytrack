import Link from "next/link";
import { Trophy } from "lucide-react";

interface Entry { user_id: string; name: string; avatar: string | null; xp: number; count: number }

export function XpRanking({ title, entries, unit }: { title: string; entries: Entry[]; unit: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h3 className="mb-1 flex items-center gap-2 font-bold"><Trophy className="h-5 w-5 text-[#d4af37]" /> {title}</h3>
      <p className="mb-3 text-xs text-text-secondary">XP ganho apenas com {unit}</p>
      {entries.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-secondary">Seja o primeiro do ranking!</p>
      ) : (
        <div className="space-y-1">
          {entries.map((e, i) => (
            <Link key={e.user_id} href={`/comunidade/perfil/${e.user_id}`} target="_blank" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
              <span className="w-5 text-center text-xs font-bold text-text-secondary">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
              {e.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary-light">{e.name.charAt(0)}</span>}
              <span className="min-w-0 flex-1 truncate text-sm">{e.name}</span>
              <span className="shrink-0 text-xs font-semibold text-[#d4af37]">↗ {e.xp}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
