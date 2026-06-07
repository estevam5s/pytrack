import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
export const STRIPE_PRICE_ID_ANNUAL = process.env.STRIPE_PRICE_ID_ANNUAL;
export const STRIPE_PRICE_ID_COMPLETO = process.env.STRIPE_PRICE_ID_COMPLETO;
export const STRIPE_PRICE_ID_COMPLETO_ANNUAL =
  process.env.STRIPE_PRICE_ID_COMPLETO_ANNUAL;
export const STRIPE_PRICE_ID_SUPREMA = process.env.STRIPE_PRICE_ID_SUPREMA;
export const STRIPE_PRICE_ID_SUPREMA_ANNUAL =
  process.env.STRIPE_PRICE_ID_SUPREMA_ANNUAL;
export const STRIPE_PRICE_ID_VITALICIO = process.env.STRIPE_PRICE_ID_VITALICIO;

/** Planos de pagamento único (one-time, mode=payment). */
export function isLifetimePlan(plan?: string): boolean {
  return plan === "vitalicio";
}

/** Mapa de plano -> price id (para o checkout). */
export function priceForPlan(plan?: string): string | undefined {
  switch (plan) {
    case "vitalicio":
      return STRIPE_PRICE_ID_VITALICIO ?? undefined;
    case "suprema_monthly":
      return STRIPE_PRICE_ID_SUPREMA ?? undefined;
    case "suprema_annual":
      return STRIPE_PRICE_ID_SUPREMA_ANNUAL ?? undefined;
    case "completo_monthly":
      return STRIPE_PRICE_ID_COMPLETO ?? undefined;
    case "completo_annual":
      return STRIPE_PRICE_ID_COMPLETO_ANNUAL ?? undefined;
    case "essencial_annual":
      return STRIPE_PRICE_ID_ANNUAL ?? undefined;
    case "essencial_monthly":
    default:
      return STRIPE_PRICE_ID ?? undefined;
  }
}
export const STRIPE_TRIAL_DAYS = Number(process.env.STRIPE_TRIAL_DAYS ?? 0) || 0;
export const STRIPE_REFERRAL_COUPON = process.env.STRIPE_REFERRAL_COUPON;

/** Billing só é considerado ativo quando há chave + price configurados. */
export const billingEnabled = Boolean(key && STRIPE_PRICE_ID);

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe não configurado (defina STRIPE_SECRET_KEY).");
  }
  return stripe;
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
