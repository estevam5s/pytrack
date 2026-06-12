"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Loader2, UserPlus, UserCheck, UserMinus } from "lucide-react";
import {
  requestConnection,
  acceptConnection,
  removeConnection,
} from "@/lib/community/connections";
import { toggleFollow } from "@/lib/community/actions";

export function ProfileActions({
  targetUserId,
  connectionId,
  connectionStatus,
  isRequester,
  isFollowing,
}: {
  targetUserId: string;
  connectionId: string | null;
  connectionStatus: string | null;
  isRequester: boolean;
  isFollowing: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [following, setFollowing] = useState(isFollowing);

  const run = (fn: () => Promise<unknown>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap gap-2">
      {/* Conectar */}
      {connectionStatus === "accepted" ? (
        <button
          onClick={() => run(() => removeConnection(targetUserId))}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-foreground"
        >
          <UserCheck className="h-4 w-4 text-green" /> Conectado
        </button>
      ) : connectionStatus === "pending" ? (
        isRequester ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary">
            <Clock className="h-4 w-4" /> Pendente
          </span>
        ) : (
          <button
            onClick={() => connectionId && run(() => acceptConnection(connectionId))}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Check className="h-4 w-4" /> Aceitar
          </button>
        )
      ) : (
        <button
          onClick={() => run(() => requestConnection(targetUserId))}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Conectar
        </button>
      )}

      {/* Seguir */}
      <button
        onClick={() =>
          start(async () => {
            await toggleFollow(targetUserId);
            setFollowing((f) => !f);
            router.refresh();
          })
        }
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-foreground"
      >
        {following ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        {following ? "Seguindo" : "Seguir"}
      </button>
    </div>
  );
}
