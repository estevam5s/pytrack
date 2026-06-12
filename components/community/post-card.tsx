"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge, CommunityAvatar, LevelBadge } from "./badges";
import { CommentSection } from "./comment-section";
import { ReportDialog } from "./report-dialog";
import { FollowButton } from "./follow-button";
import { timeAgo, compact } from "@/lib/community/format";
import { toggleLike, toggleSave, deletePost, sharePost } from "@/lib/community/actions";
import { cn } from "@/lib/utils";
import type { CommunityPostWithAuthor, CommunityProfile } from "@/types/community";

export function PostCard({
  post,
  currentUserId,
  myProfile,
  isFollowingAuthor = false,
}: {
  post: CommunityPostWithAuthor;
  currentUserId: string | null;
  myProfile: CommunityProfile | null;
  isFollowingAuthor?: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.saved);
  const [shares, setShares] = useState(post.shares_count);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [, start] = useTransition();

  if (deleted) return null;
  const isOwn = currentUserId === post.user_id;

  const onLike = () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    start(async () => {
      const res = await toggleLike(post.id);
      if (res?.error) {
        setLiked(!next);
        setLikes((n) => n + (next ? -1 : 1));
      }
    });
  };

  const onSave = () => {
    const next = !saved;
    setSaved(next);
    start(async () => {
      const res = await toggleSave(post.id);
      if (res?.error) setSaved(!next);
    });
  };

  const onShare = () => {
    setShares((n) => n + 1);
    start(async () => {
      await sharePost(post.id);
    });
  };

  const onDelete = () => {
    setMenuOpen(false);
    setDeleted(true);
    start(async () => {
      const res = await deletePost(post.id);
      if (res?.error) {
        setDeleted(false);
      } else router.refresh();
    });
  };

  const a = post.author;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* header */}
        <div className="flex items-start gap-3 p-4 pb-2">
          <Link href={`/comunidade/perfil/${post.user_id}`} className="shrink-0">
            <CommunityAvatar profile={a} size={42} showOnline />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={`/comunidade/perfil/${post.user_id}`}
                className="truncate text-sm font-semibold hover:underline"
              >
                {a?.display_name ?? "Estudante Python"}
              </Link>
              {a && <LevelBadge level={a.level} />}
              {!isOwn && currentUserId && a && (
                <FollowButton
                  targetUserId={post.user_id}
                  initialFollowing={isFollowingAuthor}
                  className="ml-1"
                />
              )}
            </div>
            <p className="truncate text-xs text-text-secondary">
              {a?.headline || a?.current_track || "Estudante de Python"} ·{" "}
              {timeAgo(post.created_at)}
            </p>
          </div>
          <CategoryBadge category={post.category} />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-md p-1 text-text-secondary hover:bg-surface hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-xl">
                  {isOwn ? (
                    <button
                      onClick={onDelete}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10"
                    >
                      <Trash2 className="h-4 w-4" /> Excluir
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setReportOpen(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface hover:text-foreground"
                    >
                      <Flag className="h-4 w-4" /> Denunciar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* conteúdo (renderiza Markdown em preview) */}
        <div className="px-4 pb-3">
          {post.title && <h3 className="mb-1 font-semibold">{post.title}</h3>}
          <div className="chat-md break-words text-sm text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {post.image_urls.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-1.5 overflow-hidden rounded-xl",
                post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {post.image_urls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="max-h-80 w-full rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-primary-light"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ações */}
        <div className="flex items-center gap-1 border-t border-border px-2 py-1">
          <ActionBtn active={liked} onClick={onLike} icon={Heart} label={compact(likes)} activeClass="text-danger" fill={liked} />
          <ActionBtn onClick={() => setShowComments((s) => !s)} icon={MessageCircle} label={compact(post.comments_count)} />
          <ActionBtn onClick={onShare} icon={Share2} label={compact(shares)} />
          <ActionBtn active={saved} onClick={onSave} icon={Bookmark} label="" activeClass="text-primary-light" fill={saved} className="ml-auto" />
        </div>

        {showComments && (
          <CommentSection
            postId={post.id}
            postOwnerId={post.user_id}
            currentUserId={currentUserId}
            myProfile={myProfile}
          />
        )}
      </CardContent>

      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} postId={post.id} />
    </Card>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  active,
  activeClass,
  fill,
  className,
}: {
  icon: typeof Heart;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface hover:text-foreground",
        active && activeClass,
        className,
      )}
    >
      <Icon className={cn("h-4 w-4", fill && "fill-current")} />
      {label}
    </button>
  );
}
