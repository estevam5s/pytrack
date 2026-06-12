import { redirect } from "next/navigation";
import { Receipt, Percent, Banknote, CreditCard, Server, Bot, Mail, BarChart3, Bug, Calculator, Landmark } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { stripe } from "@/lib/stripe/server";
import { fmtBRL } from "@/lib/billing-stats";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Taxas e custos · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminTaxasPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  // receita real da Stripe. balanceTransactions tem a taxa exata; se a chave
  // não tiver permissão, caímos para payment_intents (taxa estimada).
  let stripeFees = 0;
  let stripeGross = 0;
  let stripeNet = 0;
  let txCount = 0;
  let payoutTotal = 0;
  let feesEstimated = false;
  if (stripe) {
    try {
      const bts = await stripe.balanceTransactions.list({ limit: 100 });
      for (const t of bts.data) {
        if (t.type === "charge" || t.type === "payment") {
          stripeGross += t.amount / 100;
          stripeFees += t.fee / 100;
          stripeNet += t.net / 100;
          txCount += 1;
        }
        if (t.type === "payout") payoutTotal += Math.abs(t.amount) / 100;
      }
    } catch {
      try {
        const pis = await stripe.paymentIntents.list({ limit: 100 });
        const paid = pis.data.filter((p) => p.status === "succeeded");
        for (const p of paid) {
          const amt = p.amount_received / 100;
          stripeGross += amt;
          stripeFees += amt * 0.0399 + 0.39; // estimativa da taxa Stripe BR
          txCount += 1;
        }
        stripeNet = stripeGross - stripeFees;
        feesEstimated = true;
      } catch {
        /* sem dados */
      }
    }
  }

  const feePct = stripeGross > 0 ? (stripeFees / stripeGross) * 100 : 0;

  // tabela de custos/taxas dos provedores (referência)
  const PROVIDERS = [
    {
      icon: CreditCard,
      name: "Stripe",
      desc: "Processamento de pagamentos",
      items: [
        ["Cartão nacional", "~3.99% + R$0,39 por transação"],
        ["Pix", "~1.19% por transação"],
        ["Boleto", "~R$3,45 por boleto pago"],
        ["Disputa/chargeback", "R$25,00 por disputa"],
        ["Internacional", "+2% sobre a transação"],
      ],
    },
    {
      icon: Server,
      name: "Supabase",
      desc: "Banco de dados, auth e storage",
      items: [
        ["Plano Free", "R$0 (até 500MB DB, 1GB storage)"],
        ["Plano Pro", "US$25/mês (8GB DB, 100GB storage)"],
        ["Banco extra", "US$0,125/GB/mês"],
        ["Storage extra", "US$0,021/GB/mês"],
        ["Egress (saída)", "US$0,09/GB após franquia"],
      ],
    },
    {
      icon: Bot,
      name: "IA (Nvidia / OpenRouter)",
      desc: "Modelos de IA",
      items: [
        ["Nvidia NIM", "Gratuito (free tier) / pago por uso"],
        ["OpenRouter (fallback)", "Modelos :free gratuitos"],
        ["Custo por 1M tokens", "Varia por modelo (US$0–15)"],
      ],
    },
    {
      icon: Server,
      name: "Vercel",
      desc: "Hospedagem",
      items: [
        ["Plano Hobby", "R$0 (uso pessoal)"],
        ["Plano Pro", "US$20/mês por membro"],
        ["Bandwidth extra", "US$0,15/GB"],
        ["Edge functions", "incluídas no plano"],
      ],
    },
    {
      icon: Mail,
      name: "Resend",
      desc: "E-mails transacionais",
      items: [
        ["Plano Free", "R$0 (3.000 e-mails/mês · 100/dia)"],
        ["Plano Pro", "US$20/mês (50.000 e-mails)"],
        ["E-mail extra", "US$0,001 por e-mail"],
        ["Domínio verificado", "Gratuito (SPF/DKIM/DMARC)"],
      ],
    },
    {
      icon: BarChart3,
      name: "Google (Analytics, Ads, Console)",
      desc: "Métricas, SEO e anúncios",
      items: [
        ["Google Analytics 4", "Gratuito"],
        ["Search Console", "Gratuito (indexação/SEO)"],
        ["Google Ads", "Por orçamento (CPC ~R$0,50–3,00)"],
        ["Tag Manager", "Gratuito"],
      ],
    },
    {
      icon: Bug,
      name: "Sentry.io",
      desc: "Monitoramento de erros",
      items: [
        ["Plano Developer", "R$0 (5.000 erros/mês)"],
        ["Plano Team", "US$26/mês (50.000 erros)"],
        ["Performance/Tracing", "incluído por plano"],
        ["Session Replay", "add-on por uso"],
      ],
    },
  ];

  // ——— infraestrutura: custo mensal estimado ———
  const INFRA = [
    { name: "Supabase Pro", usd: 25, when: "ao passar de ~1.000 usuários" },
    { name: "Vercel Pro", usd: 20, when: "ao passar dos limites do Hobby" },
    { name: "Resend Pro", usd: 20, when: "acima de 3.000 e-mails/mês" },
    { name: "Sentry Team", usd: 26, when: "acima de 5.000 erros/mês" },
    { name: "Servidor do Bot", usd: 7, when: "para não hibernar" },
  ];
  const USD = 5.4; // câmbio de referência
  const infraUsd = INFRA.reduce((s, i) => s + i.usd, 0);

  // ——— impostos/contabilidade: estimativa pela receita anualizada ———
  const annualized = stripeGross * 12; // estimativa simples (recente × 12)
  const taxModel = annualized <= 81000
    ? { label: "MEI", tax: "DAS fixo ~R$76/mês", rate: 0 }
    : { label: "ME · Simples Nacional", tax: "~6% sobre o faturamento (Anexo III/V)", rate: 0.06 };
  const estTaxMonthly = annualized <= 81000 ? 76 : (stripeGross * 0.06);

  return (
    <div>
      <PageHeader
        title="Taxas e custos"
        description="Taxas reais cobradas pela Stripe e tabela de custos dos provedores (Supabase, IA, Vercel)."
      />

      {/* KPIs reais da Stripe */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue"><Banknote className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{fmtBRL(stripeGross)}</p>
          <p className="text-xs text-text-secondary">Bruto recebido (recente)</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400"><Percent className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold text-red-400">{fmtBRL(stripeFees)}</p>
          <p className="text-xs text-text-secondary">Taxas Stripe ({feePct.toFixed(1)}%)</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green"><Receipt className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold text-green">{fmtBRL(stripeNet)}</p>
          <p className="text-xs text-text-secondary">Líquido ({txCount} transações)</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Banknote className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{fmtBRL(payoutTotal)}</p>
          <p className="text-xs text-text-secondary">Saques (payouts)</p>
        </CardContent></Card>
      </div>

      {/* tabela de provedores */}
      <div className="grid gap-4 lg:grid-cols-2">
        {PROVIDERS.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <p.icon className="h-4 w-4 text-primary" /> {p.name}
                <span className="text-xs font-normal text-text-secondary">· {p.desc}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border text-sm">
                {p.items.map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-text-secondary">{k}</span>
                    <span className="text-right font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* infraestrutura + impostos */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Custo de infraestrutura (escala)</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              {INFRA.map((i) => (
                <li key={i.name} className="flex items-center justify-between gap-3 py-2">
                  <span><span className="font-medium">{i.name}</span> <span className="text-text-secondary">· {i.when}</span></span>
                  <span className="text-right font-medium">US${i.usd}/mês</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 py-2 font-bold">
                <span>Total estimado (tudo ativo)</span>
                <span className="text-primary-light">US${infraUsd} (~{fmtBRL(infraUsd * USD)})/mês</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /> Impostos & contabilidade</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-text-secondary">Faturamento anualizado (estimativa)</p>
              <p className="text-2xl font-bold">{fmtBRL(annualized)}</p>
              <p className="mt-1 text-xs text-text-secondary">Enquadramento sugerido: <strong className="text-foreground">{taxModel.label}</strong></p>
            </div>
            <ul className="divide-y divide-border text-sm">
              <li className="flex items-center justify-between gap-3 py-2"><span className="text-text-secondary">Regime</span><span className="font-medium">{taxModel.label}</span></li>
              <li className="flex items-center justify-between gap-3 py-2"><span className="text-text-secondary">Imposto</span><span className="text-right font-medium">{taxModel.tax}</span></li>
              <li className="flex items-center justify-between gap-3 py-2"><span className="text-text-secondary">Estimativa mensal</span><span className="font-medium text-red-400">{fmtBRL(estTaxMonthly)}</span></li>
              <li className="flex items-center justify-between gap-3 py-2"><span className="text-text-secondary">Contador</span><span className="text-right font-medium">~R$100–250/mês</span></li>
              <li className="flex items-center justify-between gap-3 py-2"><span className="text-text-secondary">Nota fiscal</span><span className="text-right font-medium">emitir por venda (NFS-e)</span></li>
            </ul>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-text-secondary"><Calculator className="mt-0.5 h-3 w-3 shrink-0" /> Estimativa de referência. Valide com um contador. MEI até R$81 mil/ano; acima, Simples Nacional.</p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-xs text-text-secondary">
        {feesEstimated
          ? "* Receita real da Stripe (payment_intents). As taxas são estimadas — para os valores exatos, dê à chave restrita as permissões de leitura de Balance e Balance transactions. "
          : "* As taxas da Stripe acima são valores reais das últimas transações. "}
        Os custos dos provedores e impostos são de referência (consulte cada serviço e um contador para valores atualizados).
      </p>
    </div>
  );
}
