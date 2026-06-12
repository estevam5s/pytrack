"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createTrustToken, TRUST_COOKIE, TRUST_DAYS } from "@/lib/trusted-device";

/** Marca este dispositivo como confiável por 30 dias (não pede 2FA de novo). */
export async function trustThisDevice(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const token = await createTrustToken(user.id);
  const jar = await cookies();
  jar.set(TRUST_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: TRUST_DAYS * 86400,
  });
}
