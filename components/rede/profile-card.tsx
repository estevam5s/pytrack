import Link from "next/link";
import Image from "next/image";
import { Bookmark, Users, TrendingUp, Sparkles } from "lucide-react";

interface Props {
  me: { id: string; name: string; avatar: string | null; headline: string | null; cover: string | null };
  xp: number;
  connections: number;
  followers: number;
}

// Card de perfil estilo LinkedIn (coluna esquerda do feed).
export function RedeProfileCard({ me, xp, connections, followers }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="h-14 bg-gradient-to-r from-primary/40 to-secondary/40 bg-cover bg-center"
        style={me.cover ? { backgroundImage: `url(${me.cover})` } : undefined}
      />
      <div className="px-4 pb-4">
        <Link href={`/comunidade/perfil/${me.id}`} className="block">
          {me.avatar ? (
            <Image src={me.avatar} alt="" width={64} height={64} className="-mt-8 h-16 w-16 rounded-full border-4 border-card object-cover" style={{ height: 64, width: 64 }} />
          ) : (
            <span className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-primary/15 text-xl font-bold text-primary-light">
              {me.name.charAt(0).toUpperCase()}
            </span>
          )}
          <p className="mt-2 font-bold leading-tight hover:underline">{me.name}</p>
          {me.headline && <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">{me.headline}</p>}
        </Link>

        <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
          <Link href={`/comunidade/perfil/${me.id}`} className="flex items-center justify-between rounded px-1 py-0.5 text-text-secondary hover:bg-surface-2">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Conexões</span>
            <span className="font-semibold text-primary-light">{connections}</span>
          </Link>
          <div className="flex items-center justify-between px-1 text-text-secondary">
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Seguidores</span>
            <span className="font-semibold">{followers}</span>
          </div>
          <div className="flex items-center justify-between px-1 text-text-secondary">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary-light" /> XP</span>
            <span className="font-semibold">{xp}</span>
          </div>
        </div>
      </div>

      <Link href="/comunidade?filtro=salvos" className="flex items-center gap-2 border-t border-border px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-surface-2">
        <Bookmark className="h-3.5 w-3.5" /> Itens salvos
      </Link>
    </div>
  );
}
