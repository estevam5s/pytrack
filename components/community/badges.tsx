import { CATEGORY_MAP, levelDef } from "@/lib/community/levels";
import { cn, initials } from "@/lib/utils";
import type { CommunityPostCategory, CommunityProfile } from "@/types/community";

export function LevelBadge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  const def = levelDef(level);
  const Icon = def.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium",
        def.color,
        className,
      )}
    >
      <Icon className="h-3 w-3" /> {def.name}
    </span>
  );
}

export function CategoryBadge({
  category,
  className,
}: {
  category: CommunityPostCategory;
  className?: string;
}) {
  const def = CATEGORY_MAP[category];
  if (!def) return null;
  const Icon = def.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        def.color,
        className,
      )}
    >
      <Icon className="h-3 w-3" /> {def.label}
    </span>
  );
}

export function CommunityAvatar({
  profile,
  size = 40,
  showOnline = false,
}: {
  profile: Pick<
    CommunityProfile,
    "display_name" | "avatar_url" | "username" | "is_online"
  > | null;
  size?: number;
  showOnline?: boolean;
}) {
  const name = profile?.display_name ?? profile?.username ?? "PyTracker";
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(name)
        )}
      </span>
      {showOnline && profile?.is_online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-secondary" />
      )}
    </span>
  );
}
