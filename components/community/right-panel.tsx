import Link from "next/link";
import { Briefcase, Crown, HelpCircle, Trophy, UserPlus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityAvatar, LevelBadge } from "./badges";
import { FollowButton } from "./follow-button";
import { JobCard } from "./job-card";
import { compact } from "@/lib/community/format";
import type {
  CommunityJob,
  CommunityPostWithAuthor,
  CommunityProfile,
} from "@/types/community";

const medal = ["text-warning", "text-text-secondary", "text-[#cd7f32]"];

export function CommunityRightPanel({
  ranking,
  online,
  jobs,
  unanswered,
  suggestions,
  stats,
}: {
  ranking: CommunityProfile[];
  online: CommunityProfile[];
  jobs: CommunityJob[];
  unanswered: CommunityPostWithAuthor[];
  suggestions: CommunityProfile[];
  stats: { members: number; posts: number; jobs: number };
}) {
  return (
    <div className="space-y-4">
      {/* estatísticas */}
      <Card>
        <CardContent className="grid grid-cols-3 gap-2 p-4 text-center">
          {[
            ["Membros", stats.members],
            ["Posts", stats.posts],
            ["Vagas", stats.jobs],
          ].map(([l, v]) => (
            <div key={l as string}>
              <p className="text-lg font-bold">{compact(v as number)}</p>
              <p className="text-[11px] text-text-secondary">{l as string}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ranking */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-warning" /> Ranking de membros
          </p>
          <div className="space-y-2.5">
            {ranking.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <span className={`w-4 text-center text-xs font-bold ${medal[i] ?? "text-text-secondary"}`}>
                  {i < 3 ? <Crown className="mx-auto h-3.5 w-3.5" /> : i + 1}
                </span>
                <CommunityAvatar profile={p} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{p.display_name}</p>
                  <LevelBadge level={p.level} />
                </div>
                <span className="text-xs font-semibold text-primary-light">
                  {compact(p.xp)} XP
                </span>
              </div>
            ))}
            {ranking.length === 0 && (
              <p className="text-xs text-text-secondary">Sem membros ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* online */}
      {online.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
              <Users className="h-4 w-4 text-secondary" /> Online agora
            </p>
            <div className="flex flex-wrap gap-2">
              {online.map((p) => (
                <CommunityAvatar key={p.id} profile={{ ...p, is_online: true }} size={34} showOnline />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* vagas recentes */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
            <Briefcase className="h-4 w-4 text-secondary" /> Vagas recentes
          </p>
          <div className="space-y-2">
            {jobs.length ? (
              jobs.map((j) => <JobCard key={j.id} job={j} />)
            ) : (
              <p className="text-xs text-text-secondary">Nenhuma vaga publicada ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* dúvidas sem resposta */}
      {unanswered.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
              <HelpCircle className="h-4 w-4 text-blue" /> Dúvidas sem resposta
            </p>
            <div className="space-y-2">
              {unanswered.map((p) => (
                <Link
                  key={p.id}
                  href="/comunidade?filtro=duvida"
                  className="block rounded-lg border border-border bg-surface p-2.5 text-xs text-text-secondary transition-colors hover:text-foreground"
                >
                  <span className="line-clamp-2">{p.title || p.content}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* sugestões de conexão */}
      {suggestions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
              <UserPlus className="h-4 w-4 text-primary-light" /> Sugestões de conexão
            </p>
            <div className="space-y-3">
              {suggestions.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <CommunityAvatar profile={p} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{p.display_name}</p>
                    <p className="truncate text-[11px] text-text-secondary">
                      {p.headline || p.level}
                    </p>
                  </div>
                  <FollowButton targetUserId={p.user_id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
