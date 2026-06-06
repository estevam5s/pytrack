import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

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
