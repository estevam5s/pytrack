"use client";

import { useState } from "react";
import { AI_PROVIDERS, providerOf } from "@/lib/ai-providers";

export function ModelIcon({ modelId, size = 28 }: { modelId: string; size?: number }) {
  const prov = providerOf(modelId);
  const info = AI_PROVIDERS[prov];
  const [failed, setFailed] = useState(false);

  if (!info || failed) {
    const letter = (prov[0] ?? "?").toUpperCase();
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-lg bg-surface-2 font-bold text-text-secondary"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        {letter}
      </span>
    );
  }

  return (
    <span className="flex shrink-0 items-center justify-center rounded-lg bg-white/90 p-1" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${info.slug}/${info.color}`}
        alt={info.label}
        width={size * 0.7}
        height={size * 0.7}
        onError={() => setFailed(true)}
        style={{ display: "block" }}
      />
    </span>
  );
}
