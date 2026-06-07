"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { STRIPE_PRICE_ID_SUPREMA } from "@/lib/stripe/server";

export interface CreateUserResult {
  error?: string;
  success?: string;
}

export async function createSupremaUser(
  _prev: CreateUserResult,
  formData: FormData,
): Promise<CreateUserResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "E-mail e senha são obrigatórios." };
  if (password.length < 6) return { error: "A senha precisa ter ao menos 6 caracteres." };

  try {
    const admin = createAdminClient();

    // cria o usuário já confirmado
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error || !data.user) {
      return { error: error?.message ?? "Não foi possível criar o usuário." };
    }

    // assinatura Suprema vitalícia (comp)
    const { error: subErr } = await admin.from("subscriptions").upsert(
      {
        user_id: data.user.id,
        status: "active",
        stripe_price_id: STRIPE_PRICE_ID_SUPREMA ?? null,
        current_period_end: "2126-06-06T00:00:00+00:00",
        cancel_at_period_end: false,
        metadata: { comp: true, created_by_admin: me?.email ?? null },
      },
      { onConflict: "user_id" },
    );
    if (subErr) return { error: `Usuário criado, mas falhou a assinatura: ${subErr.message}` };

    revalidatePath("/configuracoes/admin");
    return { success: `Usuário ${email} criado com plano Suprema vitalício.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
