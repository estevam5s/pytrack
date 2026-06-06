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
  redirect("/inicio");
}

export async function signUp(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: traduzir(error.message) };

  revalidatePath("/", "layout");
  redirect("/assinar");
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
