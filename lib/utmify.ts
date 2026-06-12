import "server-only";

// Integração com a Utmify — envia os pedidos (vendas) para aparecerem no painel
// da Utmify com o faturamento. Doc: https://api.utmify.com.br
const UTMIFY_URL = "https://api.utmify.com.br/api-credentials/orders";

interface UtmifyTracking {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

interface UtmifyOrderInput {
  orderId: string;
  status: "paid" | "waiting_payment" | "refunded" | "chargedback";
  paymentMethod?: "credit_card" | "pix" | "boleto" | "free_price";
  priceInCents: number;
  gatewayFeeInCents?: number;
  productName: string;
  productId: string;
  customer: { name?: string | null; email: string | null; phone?: string | null; document?: string | null; ip?: string | null };
  tracking?: UtmifyTracking;
  createdAt?: Date;
  approvedAt?: Date | null;
  refundedAt?: Date | null;
  isTest?: boolean;
}

// formato exigido: "YYYY-MM-DD HH:mm:ss" em UTC
function fmt(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export async function sendUtmifyOrder(o: UtmifyOrderInput): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token) return { ok: false, error: "UTMIFY_API_TOKEN ausente" };

  const created = o.createdAt ?? new Date();
  const payload = {
    orderId: o.orderId,
    platform: "PyTrack",
    paymentMethod: o.paymentMethod ?? "credit_card",
    status: o.status,
    createdAt: fmt(created),
    approvedDate: o.status === "paid" ? fmt(o.approvedAt ?? created) : null,
    refundedAt: o.refundedAt ? fmt(o.refundedAt) : null,
    customer: {
      name: o.customer.name ?? o.customer.email ?? "Cliente",
      email: o.customer.email,
      phone: o.customer.phone ?? null,
      document: o.customer.document ?? null,
      country: "BR",
      ip: o.customer.ip || "0.0.0.0", // a Utmify exige um IP
    },
    products: [{
      id: o.productId,
      name: o.productName,
      planId: o.productId,
      planName: o.productName,
      quantity: 1,
      priceInCents: o.priceInCents,
    }],
    trackingParameters: {
      src: o.tracking?.src ?? null,
      sck: o.tracking?.sck ?? null,
      utm_source: o.tracking?.utm_source ?? null,
      utm_campaign: o.tracking?.utm_campaign ?? null,
      utm_medium: o.tracking?.utm_medium ?? null,
      utm_content: o.tracking?.utm_content ?? null,
      utm_term: o.tracking?.utm_term ?? null,
    },
    commission: {
      totalPriceInCents: o.priceInCents,
      gatewayFeeInCents: o.gatewayFeeInCents ?? 0,
      userCommissionInCents: o.priceInCents - (o.gatewayFeeInCents ?? 0),
      currency: "BRL",
    },
    isTest: o.isTest ?? false,
  };

  try {
    const res = await fetch(UTMIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-token": token },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `Utmify ${res.status}: ${await res.text().catch(() => "")}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "erro" };
  }
}
