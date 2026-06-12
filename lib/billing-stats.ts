// Valores mensais (MRR) e únicos por price_id. Puro (sem server-only).

export const PRICE_MONTHLY: Record<string, number> = {
  price_1TfPAnCB6Dz1wPei2nOAIofK: 10, // Essencial mensal
  price_1TfQ0ACB6Dz1wPei7hdTfaQS: 8, // Essencial anual (96/12)
  price_1TfQedCB6Dz1wPeiXWheSFrk: 19, // Completo mensal
  price_1TfQeeCB6Dz1wPeiv5tsuwdx: 15.17, // Completo anual (182/12)
  price_1TfUEdCB6Dz1wPeiyag2DQIn: 46, // Suprema mensal
  price_1TfUEeCB6Dz1wPeiNGrINbKd: 36.83, // Suprema anual (442/12)
};

export const PRICE_ONETIME: Record<string, number> = {
  price_1TfV9dCB6Dz1wPeibUtTjFbZ: 697, // Vitalício
};

export function monthlyValue(priceId?: string | null): number {
  return priceId ? (PRICE_MONTHLY[priceId] ?? 0) : 0;
}

export function oneTimeValue(priceId?: string | null): number {
  return priceId ? (PRICE_ONETIME[priceId] ?? 0) : 0;
}

export function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

/** Rótulo YYYY-MM e nome curto do mês. */
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export function monthLabel(key: string): string {
  const [, m] = key.split("-");
  return MESES[Number(m) - 1] ?? key;
}

/** Últimos N meses como chaves YYYY-MM (mais antigo → mais novo). */
export function lastMonths(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(monthKey(d));
  }
  return out;
}
