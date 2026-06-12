"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { hashKey } from "@/lib/api-keys-util";
import { revalidatePath } from "next/cache";

/** Cria uma nova API key (apenas planos Completo+). Retorna a chave em texto UMA vez. */
export async function createApiKey(name: string): Promise<{ key?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const tier = await getUserTier(user.id);
  if (!tierAtLeast(tier, "suprema")) {
    return { error: "A API está disponível a partir do plano Suprema (R$46)." };
  }

  // pytk_live_<32 hex>
  const raw = `pytk_live_${randomBytes(24).toString("hex")}`;
  const prefix = raw.slice(0, 16);
  const admin = createAdminClient();
  const { error } = await admin.from("api_keys").insert({
    user_id: user.id,
    name: name.slice(0, 60) || "Minha chave",
    key_prefix: prefix,
    key_hash: hashKey(raw),
  });
  if (error) return { error: error.message };
  revalidatePath("/configuracoes/api");
  return { key: raw };
}

export async function revokeApiKey(id: string): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const admin = createAdminClient();
  await admin.from("api_keys").update({ revoked: true }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/configuracoes/api");
  return { ok: true };
}
