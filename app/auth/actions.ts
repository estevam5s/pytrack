"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthResult {
  error?: string;
}

export async function signIn(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traduzir(error.message) };

  revalidatePath("/", "layout");

  // se o usuário tem 2FA, exige o código antes de liberar o acesso
  let needsMfa = false;
  try {
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsMfa = aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2";
  } catch {
    /* ignora a checagem se falhar */
  }

  redirect(needsMfa ? "/auth/mfa" : "/inicio");
}

export async function signUp(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ref = String(formData.get("ref") ?? "").trim().toLowerCase();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: traduzir(error.message) };

  // registra a indicação, se houver
  if (ref && data.user) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      const { data: referrer } = await admin
        .from("community_profiles")
        .select("user_id")
        .eq("referral_code", ref)
        .maybeSingle();
      if (referrer && referrer.user_id !== data.user.id) {
        await admin.from("referrals").insert({
          referrer_user_id: referrer.user_id,
          referred_user_id: data.user.id,
          referred_email: email,
          status: "pending",
        });
      }
    } catch {
      /* não bloqueia o cadastro se a indicação falhar */
    }
  }

  revalidatePath("/", "layout");
  redirect("/inicio");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

function traduzir(message: string): string {
  if (/Invalid login credentials/i.test(message))
    return "E-mail ou senha inválidos.";
  if (/User already registered/i.test(message))
    return "Este e-mail já está cadastrado.";
  if (/Password should be at least/i.test(message))
    return "A senha deve ter pelo menos 6 caracteres.";
  if (/email/i.test(message) && /valid/i.test(message))
    return "Informe um e-mail válido.";
  return message;
}
