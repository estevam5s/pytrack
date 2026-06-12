import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getCommunityStats, getFeed, getFollowingIds, getMyCommunityProfile,
  getOnlineUsers, getRanking, getRecentJobs, getSuggestions, getUnanswered,
} from "@/lib/community/queries";
import { FEED_FILTERS } from "@/lib/community/levels";
import { CommunityFeed } from "@/components/community/community-feed";
import { MobileFilterBar } from "@/components/community/community-sidebar";
import { CommunityRightPanel } from "@/components/community/right-panel";
import { RedeProfileCard } from "@/components/rede/profile-card";
import { RedeOnboarding } from "@/components/rede/onboarding";

export const metadata = { title: "Comunidade · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function RedeFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { filtro = "feed", q } = await searchParams;

  const [myProfile, posts, ranking, online, jobs, unanswered, suggestions, stats, followingIds] =
    await Promise.all([
      getMyCommunityProfile(), getFeed(filtro, q), getRanking(), getOnlineUsers(),
      getRecentJobs(), getUnanswered(), getSuggestions(), getCommunityStats(), getFollowingIds(),
    ]);

  // dados do card de perfil (cover + contadores)
  const admin = createAdminClient();
  const [{ data: up }, { count: connections }, { count: followers }] = await Promise.all([
    admin.from("users_profile").select("name, avatar_url, cover_url, headline, xp").eq("user_id", user.id).maybeSingle(),
    admin.from("community_connections").select("id", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
    admin.from("community_follows").select("id", { count: "exact", head: true }).eq("following_id", user.id),
  ]);

  const me = {
    id: user.id,
    name: (up?.name as string) ?? "Estudante Python",
    avatar: (up?.avatar_url as string) ?? null,
    cover: (up?.cover_url as string) ?? null,
    headline: (up?.headline as string) ?? null,
  };

  const filterLabel = q?.trim()
    ? `Resultados para "${q}"`
    : FEED_FILTERS.find((f) => f.key === filtro)?.label ?? "Feed geral";
  const showComposer = !q && filtro !== "salvos";

  return (
    <>
    <RedeOnboarding name={me.name.split(" ")[0]} />
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[225px_minmax(0,1fr)_300px]">
      {/* esquerda — card de perfil */}
      <aside className="hidden lg:block">
        <div className="lg:sticky lg:top-20 space-y-3">
          <RedeProfileCard me={me} xp={(up?.xp as number) ?? 0} connections={connections ?? 0} followers={followers ?? 0} />
        </div>
      </aside>

      {/* centro — feed */}
      <div className="min-w-0">
        <div className="mb-3 lg:hidden"><MobileFilterBar /></div>
        <CommunityFeed
          posts={posts}
          currentUserId={user.id}
          myProfile={myProfile}
          followingIds={Array.from(followingIds)}
          filterLabel={filterLabel}
          showComposer={showComposer}
        />
      </div>

      {/* direita — sugestões/ranking */}
      <aside className="hidden xl:block">
        <div className="xl:sticky xl:top-20">
          <CommunityRightPanel ranking={ranking} online={online} jobs={jobs} unanswered={unanswered} suggestions={suggestions} stats={stats} />
        </div>
      </aside>
    </div>
    </>
  );
}
