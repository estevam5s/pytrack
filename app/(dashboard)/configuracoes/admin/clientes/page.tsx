import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/server";
import { tierOf, TIER_LABEL, type Tier } from "@/lib/billing-access";
import {
  monthlyValue,
  oneTimeValue,
  monthKey,
  monthLabel,
  lastMonths,
} from "@/lib/billing-stats";
import { ClientsDashboard } from "@/components/admin/clients-dashboard";

export const metadata = { title: "Clientes · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/configuracoes");

  const admin = createAdminClient();

  // assinaturas + e-mails
  const { data: subs = [] } = await admin
    .from("subscriptions")
    .select("user_id, status, stripe_price_id, metadata, created_at, current_period_end");

  let emailById = new Map<string, string>();
  let totalUsers = 0;
  try {
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    emailById = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
    totalUsers = users.users.length;
  } catch {
    /* ignore */
  }

  const ACTIVE = new Set(["active", "trialing"]);
  const rows = (subs ?? []).map((s) => {
    const tier = tierOf(s as never);
    const monthly = monthlyValue(s.stripe_price_id);
    return {
      email: emailById.get(s.user_id) ?? s.user_id.slice(0, 8),
      tier,
      status: s.status as string,
      since: s.created_at as string,
      periodEnd: (s.current_period_end as string) ?? null,
      monthly,
      active: ACTIVE.has(s.status as string),
      oneTime: oneTimeValue(s.stripe_price_id),
    };
  });

  // KPIs
  const activeRows = rows.filter((r) => r.active);
  const mrr = activeRows.reduce((a, r) => a + r.monthly, 0);
  const oneTimeRevenue = rows.reduce((a, r) => a + r.oneTime, 0);
  const now = Date.now();
  const new30d = rows.filter(
    (r) => now - new Date(r.since).getTime() < 30 * 86400000,
  ).length;
  const recurringActive = activeRows.filter((r) => r.monthly > 0).length;
  const avgTicket = recurringActive ? mrr / recurringActive : 0;

  // distribuição por plano (assinaturas ativas)
  const dist: Record<string, number> = {};
  for (const r of activeRows) dist[r.tier] = (dist[r.tier] ?? 0) + 1;
  const planDistribution = (Object.keys(dist) as Tier[]).map((t) => ({
    tier: t,
    label: TIER_LABEL[t],
    count: dist[t],
  }));

  // evolução mensal (12 meses): novos clientes + MRR adicionado
  const months = lastMonths(12);
  const byMonth = new Map(months.map((m) => [m, { novos: 0, mrr: 0 }]));
  for (const r of rows) {
    const k = monthKey(new Date(r.since));
    const bucket = byMonth.get(k);
    if (bucket) {
      bucket.novos += 1;
      bucket.mrr += r.monthly;
    }
  }
  let cumulative = 0;
  const monthly = months.map((m) => {
    const b = byMonth.get(m)!;
    cumulative += b.mrr;
    return { mes: monthLabel(m), novos: b.novos, mrr: Math.round(b.mrr), acumulado: Math.round(cumulative) };
  });

  // Stripe (saldo + receita real recente)
  let stripeData: {
    available: number;
    pending: number;
    chargesTotal: number;
    chargesCount: number;
    byMonth: { mes: string; total: number }[];
  } | null = null;
  if (stripe) {
    try {
      const balance = await stripe.balance.retrieve();
      const available = (balance.available ?? []).reduce((a, b) => a + b.amount, 0) / 100;
      const pending = (balance.pending ?? []).reduce((a, b) => a + b.amount, 0) / 100;
      const charges = await stripe.charges.list({ limit: 100 });
      const paid = charges.data.filter((c) => c.paid && c.status === "succeeded");
      const chargesTotal = paid.reduce((a, c) => a + c.amount, 0) / 100;
      const cMap = new Map(months.map((m) => [m, 0]));
      for (const c of paid) {
        const k = monthKey(new Date(c.created * 1000));
        if (cMap.has(k)) cMap.set(k, (cMap.get(k) ?? 0) + c.amount / 100);
      }
      stripeData = {
        available,
        pending,
        chargesTotal,
        chargesCount: paid.length,
        byMonth: months.map((m) => ({ mes: monthLabel(m), total: Math.round(cMap.get(m) ?? 0) })),
      };
    } catch {
      stripeData = null;
    }
  }

  const customers = [...rows].sort(
    (a, b) => new Date(b.since).getTime() - new Date(a.since).getTime(),
  );

  return (
    <ClientsDashboard
      kpis={{
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12),
        oneTimeRevenue,
        activeSubs: activeRows.length,
        totalCustomers: rows.length,
        totalUsers,
        new30d,
        avgTicket: Math.round(avgTicket * 100) / 100,
      }}
      monthly={monthly}
      planDistribution={planDistribution}
      stripe={stripeData}
      customers={customers}
    />
  );
}
