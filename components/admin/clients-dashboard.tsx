"use client";

import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
  DollarSign,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtBRL } from "@/lib/billing-stats";
import { TIER_LABEL, type Tier } from "@/lib/billing-access";
import { ClientRowActions } from "@/components/admin/client-row-actions";
import { cn } from "@/lib/utils";

interface Props {
  kpis: {
    mrr: number;
    arr: number;
    oneTimeRevenue: number;
    activeSubs: number;
    totalCustomers: number;
    totalUsers: number;
    new30d: number;
    avgTicket: number;
  };
  monthly: { mes: string; novos: number; mrr: number; acumulado: number }[];
  planDistribution: { tier: Tier; label: string; count: number }[];
  stripe: {
    available: number;
    pending: number;
    chargesTotal: number;
    chargesCount: number;
    byMonth: { mes: string; total: number }[];
  } | null;
  customers: {
    userId: string;
    email: string;
    tier: Tier;
    status: string;
    since: string;
    periodEnd: string | null;
    monthly: number;
    active: boolean;
    isAdminUser: boolean;
  }[];
}

const TIER_COLOR: Record<Tier, string> = {
  free: "#8A8A93",
  essencial: "#29E0A9",
  completo: "#9956F6",
  suprema: "#E254FF",
  vitalicio: "#F5A623",
};

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    let raf = 0;
    const from = ref.current;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * eased;
      setVal(v);
      ref.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function Kpi({
  icon: Icon,
  label,
  value,
  money = false,
  accent = "text-primary-light",
  bg = "bg-primary/10",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  money?: boolean;
  accent?: string;
  bg?: string;
}) {
  const v = useCountUp(value);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg, accent)}>
          <Icon className="h-5 w-5" />
        </span>
        <TrendingUp className="h-4 w-4 text-text-secondary/40" />
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums">
        {money ? fmtBRL(v) : Math.round(v).toLocaleString("pt-BR")}
      </p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <p className="mb-4 text-sm font-semibold">{title}</p>
      <div className="h-64 w-full min-w-0">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  background: "rgb(var(--surface))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 12,
  fontSize: 12,
};

function exportCSV(customers: Props["customers"]) {
  const header = ["Email", "Plano", "Status", "Desde", "Proximo ciclo", "Valor/mes (R$)"];
  const lines = customers.map((c) => [
    c.email,
    TIER_LABEL[c.tier],
    c.status,
    new Date(c.since).toLocaleDateString("pt-BR"),
    c.periodEnd ? new Date(c.periodEnd).toLocaleDateString("pt-BR") : "",
    String(c.monthly ?? 0).replace(".", ","),
  ]);
  const csv = [header, ...lines]
    .map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clientes-pytrack-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ClientsDashboard({ kpis, monthly, planDistribution, stripe, customers }: Props) {
  const [q, setQ] = useState("");
  const filtered = q.trim()
    ? customers.filter((c) => c.email.toLowerCase().includes(q.trim().toLowerCase()))
    : customers;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <DollarSign className="h-6 w-6 text-green" /> Gestão de clientes & receita
        </h1>
        <p className="text-sm text-text-secondary">
          Painel financeiro e de clientes — MRR, assinaturas, planos e dados da Stripe em tempo real.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={TrendingUp} label="MRR (receita recorrente/mês)" value={kpis.mrr} money accent="text-green" bg="bg-green/10" />
        <Kpi icon={Banknote} label="ARR (projeção anual)" value={kpis.arr} money />
        <Kpi icon={Crown} label="Receita vitalícia (única)" value={kpis.oneTimeRevenue} money accent="text-magenta" bg="bg-magenta/10" />
        <Kpi icon={Receipt} label="Ticket médio (mês)" value={kpis.avgTicket} money accent="text-blue" bg="bg-blue/10" />
        <Kpi icon={CreditCard} label="Assinaturas ativas" value={kpis.activeSubs} accent="text-green" bg="bg-green/10" />
        <Kpi icon={Users} label="Clientes (com plano)" value={kpis.totalCustomers} />
        <Kpi icon={Users} label="Usuários totais" value={kpis.totalUsers} accent="text-blue" bg="bg-blue/10" />
        <Kpi icon={TrendingUp} label="Novos (30 dias)" value={kpis.new30d} accent="text-magenta" bg="bg-magenta/10" />
      </div>

      {/* Stripe */}
      {stripe && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-[#635BFF]/10 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#635BFF] px-2 py-1 text-xs font-bold text-white">Stripe</span>
              <span className="text-sm font-semibold">Carteira & recebimentos</span>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-light hover:underline"
            >
              Abrir Stripe <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary"><Wallet className="h-3.5 w-3.5" /> Saldo disponível</p>
              <p className="mt-1 text-xl font-bold text-green">{fmtBRL(stripe.available)}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary"><Wallet className="h-3.5 w-3.5" /> Pendente</p>
              <p className="mt-1 text-xl font-bold">{fmtBRL(stripe.pending)}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary"><Banknote className="h-3.5 w-3.5" /> Recebido (recente)</p>
              <p className="mt-1 text-xl font-bold">{fmtBRL(stripe.chargesTotal)}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary"><Receipt className="h-3.5 w-3.5" /> Pagamentos</p>
              <p className="mt-1 text-xl font-bold">{stripe.chargesCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Evolução do MRR acumulado">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#29E0A9" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#29E0A9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number | string) => fmtBRL(Number(v))} />
              <Area type="monotone" dataKey="acumulado" name="MRR" stroke="#29E0A9" strokeWidth={2} fill="url(#mrrGrad)" animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Novos clientes por mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--surface-2))" }} />
              <Bar dataKey="novos" name="Novos" fill="#9956F6" radius={[6, 6, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {stripe && (
          <ChartCard title="Receita recebida (Stripe) por mês">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stripe.byMonth} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgb(var(--text-secondary))" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number | string) => fmtBRL(Number(v))} />
                <Area type="monotone" dataKey="total" name="Recebido" stroke="#635BFF" strokeWidth={2} fill="url(#recGrad)" animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <ChartCard title="Distribuição por plano (ativos)">
          {planDistribution.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-text-secondary">
              Sem assinaturas ativas ainda.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} animationDuration={900}>
                  {planDistribution.map((p) => (
                    <Cell key={p.tier} fill={TIER_COLOR[p.tier]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Tabela de clientes */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">Clientes ({filtered.length})</p>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por e-mail…"
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs outline-none focus:border-primary sm:w-56"
            />
            <button
              onClick={() => exportCSV(filtered)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface-2 text-left text-xs text-text-secondary">
              <tr>
                <th className="p-3 font-medium">Cliente</th>
                <th className="p-3 font-medium">Plano</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Desde</th>
                <th className="p-3 font-medium">Próx. ciclo</th>
                <th className="p-3 text-right font-medium">Valor/mês</th>
                <th className="p-3 text-right font-medium">Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.userId + i} className={cn("border-t border-border", i % 2 && "bg-surface/40")}>
                  <td className="max-w-[220px] truncate p-3">{c.email}</td>
                  <td className="p-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: TIER_COLOR[c.tier] + "22", color: TIER_COLOR[c.tier] }}
                    >
                      {TIER_LABEL[c.tier]}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={cn("text-xs", c.active ? "text-green" : "text-text-secondary")}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-text-secondary">{new Date(c.since).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3 text-text-secondary">{c.periodEnd ? new Date(c.periodEnd).toLocaleDateString("pt-BR") : "—"}</td>
                  <td className="p-3 text-right tabular-nums">{c.monthly ? fmtBRL(c.monthly) : "—"}</td>
                  <td className="p-3">
                    <ClientRowActions
                      userId={c.userId}
                      email={c.email}
                      tier={c.tier}
                      isAdminUser={c.isAdminUser}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-text-secondary">
                    Nenhum cliente ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
