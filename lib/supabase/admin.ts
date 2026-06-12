import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service role — ignora RLS.
 * USAR SOMENTE NO SERVIDOR (webhooks, jobs). Nunca no client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin não configurado (SERVICE_ROLE ausente).");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
