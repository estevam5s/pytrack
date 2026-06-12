import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/server";
import { tierOf, TIER_LABEL, type Tier } from "@/lib/billing-access";
import { ADMIN_EMAILS } from "@/lib/admin";
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
  if (!isAdmin(me?.email)) redirect("/inicio");

  const admin = createAdminClient();

  // assinaturas + e-mails
  const { data: subs = [] } = await admin
    .from("subscriptions")
    .select("user_id, status, stripe_price_id, metadata, created_at, current_period_end");

  let emailById = new Map<string, string>();
  let totalUsers = 0;
  let usersList: { id: string; email: string; created_at?: string }[] = [];
  try {
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    emailById = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
    // exclui administradores (são quem mantém a plataforma — não são clientes)
    usersList = users.users
      .filter((u) => !ADMIN_EMAILS.includes((u.email ?? "").toLowerCase()))
      .map((u) => ({ id: u.id, email: u.email ?? "", created_at: u.created_at }));
    totalUsers = usersList.length;
  } catch {
    /* ignore */
  }

  const ACTIVE = new Set(["active", "trialing"]);
  const isCourtesy = (m: Record<string, unknown> | null | undefined) =>
    Boolean(m && (m.comp || m.granted_by));

  // faturamento: ignora administradores e acessos de cortesia (não são receita real)
  const rows = (subs ?? [])
    .filter((s) => {
      const email = (emailById.get(s.user_id) ?? "").toLowerCase();
      if (ADMIN_EMAILS.includes(email)) return false;
      if (isCourtesy(s.metadata as Record<string, unknown> | null)) return false;
      return true;
    })
    .map((s) => {
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
    pendingAvailableOn: string | null;
    chargesTotal: number;
    chargesCount: number;
    byMonth: { mes: string; total: number }[];
    upcoming: { count: number; total: number; nextDate: string | null };
  } | null = null;
  if (stripe) {
    try {
      // a chave restrita pode não ter acesso a balance/charges; usamos
      // payment_intents (receita real coletada), com fallback gracioso.
      let available = 0;
      let pending = 0;
      let pendingAvailableOn: string | null = null;
      try {
        const balance = await stripe.balance.retrieve();
        available = (balance.available ?? []).reduce((a, b) => a + b.amount, 0) / 100;
        pending = (balance.pending ?? []).reduce((a, b) => a + b.amount, 0) / 100;
        // data em que o pendente fica disponível (próximo balance_transaction pendente)
        try {
          const bts = await stripe.balanceTransactions.list({ limit: 20 });
          const pendingTx = bts.data
            .filter((t) => t.status === "pending" && t.available_on)
            .sort((a, b) => a.available_on - b.available_on)[0];
          if (pendingTx) pendingAvailableOn = new Date(pendingTx.available_on * 1000).toISOString();
        } catch {
          /* sem permissão de balance transactions */
        }
      } catch {
        /* sem permissão de balance — segue sem o saldo */
      }

      // próximas cobranças: assinaturas ativas/trial que vão cobrar no fim do ciclo
      const upcomingRows = (subs ?? []).filter((s) =>
        ["active", "trialing", "past_due"].includes(s.status as string),
      );
      const upcomingTotal = upcomingRows.reduce((a, s) => a + monthlyValue(s.stripe_price_id), 0);
      const upcomingNext = upcomingRows
        .map((s) => s.current_period_end as string | null)
        .filter(Boolean)
        .sort()[0] ?? null;
      const pis = await stripe.paymentIntents.list({ limit: 100 });
      const paid = pis.data.filter((p) => p.status === "succeeded");
      const chargesTotal = paid.reduce((a, p) => a + p.amount_received, 0) / 100;
      const cMap = new Map(months.map((m) => [m, 0]));
      for (const p of paid) {
        const k = monthKey(new Date(p.created * 1000));
        if (cMap.has(k)) cMap.set(k, (cMap.get(k) ?? 0) + p.amount_received / 100);
      }
      stripeData = {
        available,
        pending,
        pendingAvailableOn,
        chargesTotal,
        chargesCount: paid.length,
        byMonth: months.map((m) => ({ mes: monthLabel(m), total: Math.round(cMap.get(m) ?? 0) })),
        upcoming: {
          count: upcomingRows.length,
          total: Math.round(upcomingTotal * 100) / 100,
          nextDate: upcomingNext,
        },
      };
    } catch {
      stripeData = null;
    }
  }

  // perfis (avatar, nome, origem do cadastro)
  const { data: profiles = [] } = await admin
    .from("users_profile")
    .select("user_id, name, avatar_url, signup_source");
  const profById = new Map(
    (profiles ?? []).map((p) => [p.user_id, p]),
  );

  // tabela com TODOS os usuários (inclui gratuitos) para gerenciar/excluir
  const subByUser = new Map((subs ?? []).map((s) => [s.user_id, s]));
  const customers = usersList
    .map((u) => {
      const s = subByUser.get(u.id);
      const p = profById.get(u.id);
      const tier = tierOf((s ?? null) as never);
      return {
        userId: u.id,
        email: u.email || u.id.slice(0, 8),
        name: (p?.name as string) ?? null,
        avatarUrl: (p?.avatar_url as string) ?? null,
        tier,
        status: (s?.status as string) ?? "—",
        since: (u.created_at as string) ?? new Date().toISOString(),
        periodEnd: (s?.current_period_end as string) ?? null,
        monthly: monthlyValue(s?.stripe_price_id),
        active: s ? ACTIVE.has(s.status as string) : false,
        isAdminUser: ADMIN_EMAILS.includes((u.email || "").toLowerCase()),
      };
    })
    .sort((a, b) => new Date(b.since).getTime() - new Date(a.since).getTime());

  // origem dos cadastros (analytics de aquisição) — exclui admins
  const sourceCount: Record<string, number> = {};
  for (const p of profiles ?? []) {
    const email = (emailById.get(p.user_id) ?? "").toLowerCase();
    if (ADMIN_EMAILS.includes(email)) continue;
    const src = (p.signup_source as string) || "Não informado";
    sourceCount[src] = (sourceCount[src] ?? 0) + 1;
  }
  const sources = Object.entries(sourceCount)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

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
      sources={sources}
    />
  );
}
