"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

// nº máximo de contas permitidas por IP (anti-abuso do freemium de 7 dias).
// Configurável via env MAX_ACCOUNTS_PER_IP (padrão 2).
const MAX_ACCOUNTS_PER_IP = Number(process.env.MAX_ACCOUNTS_PER_IP ?? 2);

async function getClientIp(): Promise<string | null> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return h.get("x-real-ip") ?? null;
  } catch {
    return null;
  }
}

export interface AuthResult {
  error?: string;
}

export async function signIn(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  // anti-brute-force (Hydra etc.): limita por e-mail E por IP.
  // Por IP pega ataques que variam o e-mail; por e-mail pega força bruta de senha.
  const loginIp = await getClientIp();
  if (!(await rateLimit(`login:${email}`, 8, 60))) {
    return { error: "Muitas tentativas. Aguarde um minuto e tente novamente." };
  }
  if (loginIp && !(await rateLimit(`loginip:${loginIp}`, 30, 60))) {
    return { error: "Muitas tentativas a partir desta rede. Aguarde um momento." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traduzir(error.message) };

  revalidatePath("/", "layout");

  // se o usuário tem 2FA, exige o código — exceto em dispositivo confiável (30 dias)
  let needsMfa = false;
  try {
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsMfa = aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2";
    if (needsMfa) {
      const { cookies } = await import("next/headers");
      const { isTrustedDevice, TRUST_COOKIE } = await import("@/lib/trusted-device");
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      const token = (await cookies()).get(TRUST_COOKIE)?.value;
      if (token && u && (await isTrustedDevice(token, u.id))) needsMfa = false;
    }
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
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  const ref = String(formData.get("ref") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "").trim() || null;
  const consent = formData.get("consent");

  if (!consent) {
    return { error: "Você precisa aceitar os Termos de Uso e a Política de Privacidade." };
  }

  // formato de e-mail
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return { error: "Informe um e-mail válido." };
  }
  // domínio descartável (validação básica de e-mail "verdadeiro")
  const domain = (email.split("@")[1] ?? "").toLowerCase();
  const disposable = ["mailinator.com", "10minutemail.com", "tempmail.com", "guerrillamail.com", "yopmail.com", "trashmail.com", "throwaway.email", "temp-mail.org", "getnada.com", "sharklasers.com", "maildrop.cc", "fakeinbox.com", "tempmailo.com", "mintemail.com", "dispostable.com"];
  if (disposable.includes(domain)) {
    return { error: "Use um e-mail permanente (e-mails descartáveis não são aceitos)." };
  }

  // provedores conhecidos passam direto; outros domínios passam pela checagem de MX (e-mail real)
  const trusted = ["gmail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "yahoo.com.br", "icloud.com", "proton.me", "protonmail.com", "uol.com.br", "bol.com.br", "terra.com.br", "globo.com"];
  const isStudent = /\.(edu|ac)(\.[a-z]{2})?$/.test(domain) || domain.endsWith(".edu.br");
  if (!trusted.includes(domain) && !isStudent) {
    try {
      const { resolveMx } = await import("node:dns/promises");
      const mx = await resolveMx(domain);
      if (!mx || mx.length === 0) {
        return { error: "Não encontramos um servidor de e-mail neste domínio. Use um e-mail válido." };
      }
    } catch {
      return { error: "Este e-mail parece não existir. Use um e-mail válido (Gmail, Outlook, etc.)." };
    }
  }
  // confirmação de senha
  if (password !== password2) {
    return { error: "As senhas não coincidem." };
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter ao menos 8 caracteres." };
  }

  // anti-spam: 5 cadastros por 10 min por e-mail
  if (!(await rateLimit(`signup:${email}`, 5, 600))) {
    return { error: "Muitas tentativas de cadastro. Tente novamente em alguns minutos." };
  }

  // anti-abuso: limita contas por IP (evita criar várias contas p/ burlar o trial)
  const ip = await getClientIp();
  if (ip) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      const { count } = await admin
        .from("signup_ips")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip);
      if ((count ?? 0) >= MAX_ACCOUNTS_PER_IP) {
        return {
          error:
            "Detectamos muitas contas criadas a partir desta rede. Se precisa de ajuda, fale com o suporte.",
        };
      }
    } catch {
      /* não bloqueia se a checagem falhar */
    }
  }

  // e-mail já em uso?
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (list.users.some((u) => (u.email ?? "").toLowerCase() === email)) {
      return { error: "Este e-mail já está cadastrado. Tente fazer login." };
    }
  } catch {
    /* se falhar, segue (o Supabase também valida unicidade) */
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br"}/auth/callback?next=/onboarding`,
    },
  });

  if (error) return { error: traduzir(error.message) };

  // registra o IP do cadastro (anti-abuso)
  if (ip && data.user) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      await admin.from("signup_ips").insert({ user_id: data.user.id, email, ip });
    } catch {
      /* ignore */
    }
  }

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

  // salva de onde o usuário veio (analytics de aquisição)
  if (source && data.user) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      await admin
        .from("users_profile")
        .update({ signup_source: source })
        .eq("user_id", data.user.id);
    } catch {
      /* ignore */
    }
  }

  revalidatePath("/", "layout");
  // exige confirmação de e-mail antes de acessar o dashboard
  redirect(`/auth/verificar-email?email=${encodeURIComponent(email)}`);
}

export async function resendConfirmation(email: string): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br"}/auth/callback?next=/onboarding`,
    },
  });
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
