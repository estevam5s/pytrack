import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DownloadStats {
  android: number;
  desktop: number; // soma windows + macos + linux
  extension: number; // instalações no Marketplace do VS Code
}

async function fetchVscodeInstalls(): Promise<number> {
  try {
    const res = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json;api-version=7.2-preview.1" },
      body: JSON.stringify({
        filters: [{ criteria: [{ filterType: 7, value: "EstevamSouza.pytrack" }] }],
        flags: 256, // IncludeStatistics
      }),
      // a Marketplace pode ser lenta; não bloquear muito
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    const stats = data?.results?.[0]?.extensions?.[0]?.statistics ?? [];
    const installs = stats.find((s: { statisticName: string }) => s.statisticName === "install")?.value;
    return Math.round(installs ?? 0);
  } catch {
    return 0;
  }
}

async function fetchDownloadStats(): Promise<DownloadStats> {
  const admin = createAdminClient();
  const [{ data: rows }, extension] = await Promise.all([
    admin.from("app_releases").select("platform, download_count").eq("is_published", true),
    fetchVscodeInstalls(),
  ]);
  const map: Record<string, number> = {};
  for (const r of rows ?? []) map[r.platform as string] = (r.download_count as number) ?? 0;
  return {
    android: map.android ?? 0,
    desktop: (map.windows ?? 0) + (map.macos ?? 0) + (map.linux ?? 0),
    extension,
  };
}

// cache curto (5 min) — números crescem aos poucos
export const getDownloadStats = unstable_cache(fetchDownloadStats, ["download-stats"], {
  revalidate: 300,
  tags: ["download-stats"],
});

export function fmtDownloads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
