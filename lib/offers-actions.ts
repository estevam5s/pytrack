"use server";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && isAdmin(user.email);
}

// Cliente Stripe com apiVersion estável: a versão "dahlia" (2026) removeu o
// parâmetro `coupon` do promotion_codes.create. 2024-06-20 ainda o aceita.
function stableStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as never });
}

export async function createOffer(input: {
  title: string; description: string; discountPct: number; durationMonths: number;
  plan: string; badge: string; days: number;
}) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  if (!input.title.trim() || input.discountPct < 1 || input.discountPct > 100) return { error: "Dados inválidos." };

  const admin = createAdminClient();
  let couponId: string | null = null;
  let promoCode: string | null = null;

  // cria cupom + código promocional na Stripe
  try {
    const stripe = stableStripe();
    const coupon = await stripe.coupons.create({
      percent_off: input.discountPct,
      duration: input.durationMonths > 1 ? "repeating" : "once",
      duration_in_months: input.durationMonths > 1 ? input.durationMonths : undefined,
      name: input.title.slice(0, 40),
    });
    couponId = coupon.id;
    const code = `PYTRACK${input.discountPct}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const promoParams: Record<string, unknown> = { coupon: coupon.id, code };
    if (input.days > 0) promoParams.expires_at = Math.floor((Date.now() + input.days * 86400000) / 1000);
    const promo = await stripe.promotionCodes.create(promoParams as never);
    promoCode = promo.code;
  } catch (e) {
    return { error: `Stripe: ${(e as Error).message}` };
  }

  const endsAt = input.days > 0 ? new Date(Date.now() + input.days * 86400000).toISOString() : null;
  // desativa outras ofertas (só 1 ativa por vez)
  await admin.from("offers").update({ active: false }).eq("active", true);
  const { error } = await admin.from("offers").insert({
    title: input.title.trim(), description: input.description.trim(), discount_pct: input.discountPct,
    duration_months: input.durationMonths, stripe_coupon_id: couponId, promo_code: promoCode,
    plan: input.plan, badge: input.badge, active: true, ends_at: endsAt,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/ofertas");
  revalidatePath("/");
  return { ok: true, promoCode };
}

export async function toggleOffer(id: string, active: boolean) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const admin = createAdminClient();
  if (active) await admin.from("offers").update({ active: false }).eq("active", true);
  await admin.from("offers").update({ active }).eq("id", id);
  revalidatePath("/admin/ofertas"); revalidatePath("/");
  return { ok: true };
}

export async function deleteOffer(id: string) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const admin = createAdminClient();
  const { data: o } = await admin.from("offers").select("stripe_coupon_id").eq("id", id).maybeSingle();
  if (o?.stripe_coupon_id) {
    try { await stableStripe().coupons.del(o.stripe_coupon_id as string); } catch { /* ok */ }
  }
  await admin.from("offers").delete().eq("id", id);
  revalidatePath("/admin/ofertas"); revalidatePath("/");
  return { ok: true };
}

export async function getOffers() {
  const admin = createAdminClient();
  const { data } = await admin.from("offers").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

// oferta ativa e vigente (para banner + checkout)
export async function getActiveOffer() {
  const admin = createAdminClient();
  const { data } = await admin.from("offers").select("*").eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!data) return null;
  if (data.ends_at && new Date(data.ends_at as string) < new Date()) return null;
  return data;
}
