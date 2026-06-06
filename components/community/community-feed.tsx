"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CreatePostCard } from "./create-post-card";
import { PostCard } from "./post-card";
import { CommunitySearch } from "./community-search";
import type { CommunityPostWithAuthor, CommunityProfile } from "@/types/community";

export function CommunityFeed({
  posts,
  currentUserId,
  myProfile,
  followingIds,
  filterLabel,
  showComposer,
}: {
  posts: CommunityPostWithAuthor[];
  currentUserId: string | null;
  myProfile: CommunityProfile | null;
  followingIds: string[];
  filterLabel: string;
  showComposer: boolean;
}) {
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);
  const following = new Set(followingIds);
  const mountTs = useRef(Date.now());

  // realtime: novos posts de outros usuários
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel("community-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          const row = payload.new as { user_id: string; created_at: string };
          if (row.user_id === currentUserId) return;
          if (new Date(row.created_at).getTime() < mountTs.current) return;
          setNewCount((n) => n + 1);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [currentUserId]);

  return (
    <div className="space-y-4">
      <div className="lg:hidden">
        <CommunitySearch />
      </div>

      {showComposer && <CreatePostCard profile={myProfile} />}

      {newCount > 0 && (
        <button
          onClick={() => {
            setNewCount(0);
            mountTs.current = Date.now();
            router.refresh();
          }}
          className="mx-auto flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary-light transition-colors hover:bg-primary/20"
        >
          <ArrowUp className="h-3.5 w-3.5" /> {newCount} nova(s) publicação(ões) — atualizar
        </button>
      )}

      {!showComposer && (
        <h2 className="px-1 text-sm font-semibold text-text-secondary">
          {filterLabel}
        </h2>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <Inbox className="h-10 w-10 text-text-secondary" />
          <p className="mt-3 font-medium">Nada por aqui ainda</p>
          <p className="mt-1 text-sm text-text-secondary">
            Seja o primeiro a publicar nesta seção da comunidade.
          </p>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            currentUserId={currentUserId}
            myProfile={myProfile}
            isFollowingAuthor={following.has(p.user_id)}
          />
        ))
      )}
    </div>
  );
}
