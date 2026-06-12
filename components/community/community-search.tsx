"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function CommunitySearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const go = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value.trim()) sp.set("q", value.trim());
    else sp.delete("q");
    router.push(`/comunidade?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      <Search className="h-4 w-4 shrink-0 text-text-secondary" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go(q)}
        placeholder="Pesquisar posts, pessoas, vagas..."
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary"
      />
      {q && (
        <button onClick={() => { setQ(""); go(""); }} className="text-text-secondary hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
