"use client";

import { useState, useTransition } from "react";
import { Check, UserPlus } from "lucide-react";
import { toggleFollow } from "@/lib/community/actions";
import { cn } from "@/lib/utils";

export function FollowButton({
  targetUserId,
  initialFollowing = false,
  className,
}: {
  targetUserId: string;
  initialFollowing?: boolean;
  className?: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, start] = useTransition();

  const onClick = () => {
    const next = !following;
    setFollowing(next); // otimista
    start(async () => {
      const res = await toggleFollow(targetUserId);
      if (res?.error) setFollowing(!next);
      else if (typeof res?.following === "boolean") setFollowing(res.following);
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60",
        following
          ? "border border-border bg-surface text-text-secondary hover:text-foreground"
          : "bg-primary text-white hover:bg-primary/90",
        className,
      )}
    >
      {following ? (
        <>
          <Check className="h-3.5 w-3.5" /> Seguindo
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" /> Seguir
        </>
      )}
    </button>
  );
}
