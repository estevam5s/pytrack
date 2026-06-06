import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCommunityStats,
  getFeed,
  getFollowingIds,
  getMyCommunityProfile,
  getOnlineUsers,
  getRanking,
  getRecentJobs,
  getSuggestions,
  getUnanswered,
} from "@/lib/community/queries";
import { FEED_FILTERS } from "@/lib/community/levels";
import { CommunityFeed } from "@/components/community/community-feed";
import {
  CommunitySidebar,
  MobileFilterBar,
} from "@/components/community/community-sidebar";
import { CommunityRightPanel } from "@/components/community/right-panel";
import { CommunitySearch } from "@/components/community/community-search";
import { CreateJobDialog } from "@/components/community/create-job-dialog";

export const metadata = { title: "Comunidade · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ComunidadePage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { filtro = "feed", q } = await searchParams;

  const [
    myProfile,
    posts,
    ranking,
    online,
    jobs,
    unanswered,
    suggestions,
    stats,
    followingIds,
  ] = await Promise.all([
    getMyCommunityProfile(),
    getFeed(filtro, q),
    getRanking(),
    getOnlineUsers(),
    getRecentJobs(),
    getUnanswered(),
    getSuggestions(),
    getCommunityStats(),
    getFollowingIds(),
  ]);

  const filterLabel =
    q && q.trim()
      ? `Resultados para "${q}"`
      : FEED_FILTERS.find((f) => f.key === filtro)?.label ?? "Feed geral";
  const showComposer = !q && filtro !== "salvos";

  return (
    <div>
      {/* topo */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comunidade</h1>
          <p className="text-sm text-text-secondary">
            Aprenda junto, compartilhe e evolua no ecossistema Python.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden w-64 md:block">
            <CommunitySearch />
          </div>
          <CreateJobDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_300px]">
        {/* esquerda */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-20">
            <CommunitySidebar />
          </div>
        </aside>

        {/* centro */}
        <div className="min-w-0">
          <div className="mb-3">
            <MobileFilterBar />
          </div>
          <CommunityFeed
            posts={posts}
            currentUserId={user.id}
            myProfile={myProfile}
            followingIds={Array.from(followingIds)}
            filterLabel={filterLabel}
            showComposer={showComposer}
          />
        </div>

        {/* direita */}
        <aside className="hidden xl:block">
          <div className="xl:sticky xl:top-20">
            <CommunityRightPanel
              ranking={ranking}
              online={online}
              jobs={jobs}
              unanswered={unanswered}
              suggestions={suggestions}
              stats={stats}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
