// Token de "dispositivo confiável" para o 2FA (lembrar por 30 dias).
// Formato: <userId>.<expMs>.<sig>, onde sig = HMAC-SHA256(userId.expMs, SECRET).
// Compatível com Edge runtime (Web Crypto).

const SECRET =
  process.env.MFA_TRUST_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE ||
  "pytrack-mfa-fallback-secret";

export const TRUST_DAYS = 30;
export const TRUST_COOKIE = "pytrack_td";

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Gera o token para o usuário (válido por TRUST_DAYS). */
export async function createTrustToken(userId: string): Promise<string> {
  const exp = Date.now() + TRUST_DAYS * 86400000;
  const payload = `${userId}.${exp}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Valida o token: assinatura correta, não expirado e pertence ao usuário. */
export async function isTrustedDevice(token: string, userId: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [uid, expStr, sig] = parts;
    if (uid !== userId) return false;
    const exp = Number(expStr);
    if (!exp || Date.now() > exp) return false;
    const expected = await hmac(`${uid}.${expStr}`);
    // comparação constante simples
    if (expected.length !== sig.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}
