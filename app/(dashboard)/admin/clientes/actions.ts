"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin, ADMIN_EMAILS } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  STRIPE_PRICE_ID,
  STRIPE_PRICE_ID_COMPLETO,
  STRIPE_PRICE_ID_SUPREMA,
  STRIPE_PRICE_ID_VITALICIO,
} from "@/lib/stripe/server";
import type { Tier } from "@/lib/billing-access";

export interface ClientActionResult {
  error?: string;
  success?: string;
}

const PRICE_BY_TIER: Record<string, string | undefined> = {
  essencial: STRIPE_PRICE_ID,
  completo: STRIPE_PRICE_ID_COMPLETO,
  suprema: STRIPE_PRICE_ID_SUPREMA,
  vitalicio: STRIPE_PRICE_ID_VITALICIO,
};

/** Define/concede o plano de um cliente (cortesia, sem cobrança). */
export async function setUserPlan(
  _prev: ClientActionResult,
  formData: FormData,
): Promise<ClientActionResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const userId = String(formData.get("user_id") ?? "");
  const tier = String(formData.get("tier") ?? "") as Tier;
  if (!userId || !tier) return { error: "Dados inválidos." };

  try {
    const admin = createAdminClient();

    if (tier === "free") {
      await admin.from("subscriptions").delete().eq("user_id", userId);
      revalidatePath("/admin/clientes");
      return { success: "Plano removido (usuário agora é gratuito)." };
    }

    const priceId = PRICE_BY_TIER[tier];
    const metadata: Record<string, unknown> = { granted_by: me?.email ?? "admin" };
    if (tier === "vitalicio") metadata.lifetime = true;

    const { error } = await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        status: "active",
        stripe_price_id: priceId ?? null,
        current_period_end: "2126-06-06T00:00:00+00:00",
        cancel_at_period_end: false,
        metadata,
      },
      { onConflict: "user_id" },
    );
    if (error) return { error: error.message };

    revalidatePath("/admin/clientes");
    return { success: `Plano atualizado para ${tier}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao atualizar o plano." };
  }
}

/** Exclui um usuário (e suas assinaturas, em cascata). */
export async function deleteUser(
  _prev: ClientActionResult,
  formData: FormData,
): Promise<ClientActionResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const userId = String(formData.get("user_id") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase();
  if (!userId) return { error: "Usuário inválido." };
  if (ADMIN_EMAILS.includes(email)) return { error: "Não é possível excluir um administrador." };

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };
    revalidatePath("/admin/clientes");
    return { success: "Usuário excluído." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao excluir o usuário." };
  }
}
