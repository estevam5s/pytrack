"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, CornerDownRight, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createComment, markSolution } from "@/lib/community/actions";
import { CommunityAvatar, LevelBadge } from "./badges";
import { timeAgo } from "@/lib/community/format";
import { cn } from "@/lib/utils";
import type { CommunityComment, CommunityProfile } from "@/types/community";

type C = CommunityComment & { author: CommunityProfile | null };

export function CommentSection({
  postId,
  postOwnerId,
  currentUserId,
  myProfile,
}: {
  postId: string;
  postOwnerId: string;
  currentUserId: string | null;
  myProfile: CommunityProfile | null;
}) {
  const [comments, setComments] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "active")
      .order("created_at", { ascending: true });
    if (!data) {
      setComments([]);
      setLoading(false);
      return;
    }
    const ids = Array.from(new Set(data.map((c) => c.user_id)));
    const { data: profs } = await supabase
      .from("community_profiles")
      .select("*")
      .in("user_id", ids);
    const map = new Map((profs ?? []).map((p) => [p.user_id, p as CommunityProfile]));
    setComments(data.map((c) => ({ ...(c as C), author: map.get(c.user_id) ?? null })));
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    load();
    const supabase = createClient();
    const ch = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_comments", filter: `post_id=eq.${postId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [postId, load]);

  const tops = comments.filter((c) => !c.parent_comment_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_comment_id === id);
  const isOwner = currentUserId === postOwnerId;

  return (
    <div className="border-t border-border bg-surface/40 px-4 py-3">
      {currentUserId && (
        <CommentForm postId={postId} myProfile={myProfile} onDone={load} />
      )}

      {loading ? (
        <p className="py-3 text-center text-xs text-text-secondary">
          <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> carregando…
        </p>
      ) : tops.length === 0 ? (
        <p className="py-3 text-center text-xs text-text-secondary">
          Seja o primeiro a comentar 💬
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {tops.map((c) => (
            <div key={c.id}>
              <CommentItem
                c={c}
                canMarkSolution={isOwner}
                onReply={() => setReplyTo(replyTo === c.id ? null : c.id)}
              />
              {repliesOf(c.id).length > 0 && (
                <div className="ml-9 mt-2 space-y-2 border-l border-border pl-3">
                  {repliesOf(c.id).map((r) => (
                    <CommentItem key={r.id} c={r} compact />
                  ))}
                </div>
              )}
              {replyTo === c.id && currentUserId && (
                <div className="ml-9 mt-2">
                  <CommentForm
                    postId={postId}
                    parentId={c.id}
                    myProfile={myProfile}
                    onDone={() => {
                      setReplyTo(null);
                      load();
                    }}
                    small
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  c,
  canMarkSolution = false,
  onReply,
  compact = false,
}: {
  c: C;
  canMarkSolution?: boolean;
  onReply?: () => void;
  compact?: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2.5">
      <CommunityAvatar profile={c.author} size={compact ? 28 : 32} />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "rounded-xl border border-border bg-card px-3 py-2",
            c.is_solution && "border-secondary/40 bg-secondary/5",
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold">
              {c.author?.display_name ?? "Estudante"}
            </span>
            {c.author && <LevelBadge level={c.author.level} />}
            <span className="text-[10px] text-text-secondary">· {timeAgo(c.created_at)}</span>
            {c.is_solution && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/15 px-1.5 text-[10px] font-medium text-secondary">
                <CheckCircle2 className="h-3 w-3" /> Solução
              </span>
            )}
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
            {c.content}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 pl-1 text-[11px] text-text-secondary">
          {onReply && (
            <button onClick={onReply} className="inline-flex items-center gap-1 hover:text-foreground">
              <CornerDownRight className="h-3 w-3" /> Responder
            </button>
          )}
          {canMarkSolution && !c.is_solution && (
            <button
              disabled={pending}
              onClick={() => start(async () => void (await markSolution(c.id, true)))}
              className="inline-flex items-center gap-1 text-secondary hover:underline"
            >
              <CheckCircle2 className="h-3 w-3" /> Marcar como solução
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentForm({
  postId,
  parentId,
  myProfile,
  onDone,
  small,
}: {
  postId: string;
  parentId?: string;
  myProfile: CommunityProfile | null;
  onDone: () => void;
  small?: boolean;
}) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const ref = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!value.trim()) return;
    start(async () => {
      const res = await createComment({ postId, content: value, parentId });
      if (!res?.error) {
        setValue("");
        onDone();
      }
    });
  };

  return (
    <div className={cn("flex items-center gap-2", small ? "" : "mt-1")}>
      {!small && <CommunityAvatar profile={myProfile} size={30} />}
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={parentId ? "Escreva uma resposta…" : "Escreva um comentário…"}
        className="min-w-0 flex-1 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm outline-none placeholder:text-text-secondary focus:border-primary/40"
      />
      <button
        onClick={submit}
        disabled={pending || !value.trim()}
        className="rounded-full bg-primary p-1.5 text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </div>
  );
}
