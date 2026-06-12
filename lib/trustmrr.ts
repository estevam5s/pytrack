import "server-only";

const BASE = "https://trustmrr.com/api/v1";
const SLUG = "pytrack";

export interface TrustMrrData {
  name: string;
  slug: string;
  url: string;
  icon?: string;
  description?: string;
  website?: string;
  country?: string;
  foundedDate?: string;
  category?: string;
  paymentProvider?: string;
  targetAudience?: string;
  revenue?: { last30Days?: number; mrr?: number; total?: number };
  customers?: number;
  activeSubscriptions?: number;
  profitMarginLast30Days?: number;
  growth30d?: number;
  growthMRR30d?: number;
  rank?: number;
  visitorsLast30Days?: number;
  revenuePerVisitor?: number | null;
  isMerchantOfRecord?: boolean;
  xHandle?: string;
  xFollowerCount?: number | null;
  techStack?: { slug: string; category: string }[];
  marketingChannels?: unknown[];
  cofounders?: unknown[];
}

/** Busca os dados verificados da PyTrack no TrustMRR. Cache de 5 min. */
export async function getTrustMrr(): Promise<TrustMrrData | null> {
  const key = process.env.TRUSTMRR_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}/startups/${SLUG}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as TrustMrrData | null;
  } catch {
    return null;
  }
}
