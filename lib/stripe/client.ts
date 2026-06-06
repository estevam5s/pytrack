"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let promise: Promise<Stripe | null> | null = null;

export function getStripe() {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!pk) return Promise.resolve(null);
  if (!promise) promise = loadStripe(pk);
  return promise;
}
