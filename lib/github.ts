"use server";

import { createClient } from "@/lib/supabase/server";

export interface GithubResult {
  error?: string;
  url?: string;
  success?: string;
}

async function getToken() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { token: null, user: null, supabase };
  const { data } = await supabase
    .from("users_profile")
    .select("github_token")
    .eq("user_id", user.id)
    .maybeSingle();
  return { token: (data?.github_token as string) ?? null, user, supabase };
}

/** Salva o Personal Access Token do GitHub e valida + guarda o username. */
export async function saveGithubToken(token: string): Promise<GithubResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const t = token.trim();
  if (!t) {
    await supabase.from("users_profile").update({ github_token: null, github_username: null }).eq("user_id", user.id);
    return { success: "GitHub desconectado." };
  }
  // valida o token
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${t}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return { error: "Token inválido. Verifique se tem permissão 'repo'." };
  const ghUser = await res.json();
  await supabase
    .from("users_profile")
    .update({ github_token: t, github_username: ghUser.login })
    .eq("user_id", user.id);
  return { success: `Conectado como @${ghUser.login}.` };
}

/** Cria um repositório no GitHub do usuário com os arquivos informados. */
export async function createGithubRepo(input: {
  name: string;
  description: string;
  files: { path: string; content: string }[];
  privateRepo?: boolean;
}): Promise<GithubResult> {
  const { token, user, supabase } = await getToken();
  if (!token) return { error: "Conecte sua conta do GitHub em Configurações → GitHub." };

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  // limpa o token inválido do perfil para que a UI peça reconexão
  const clearInvalidToken = async () => {
    if (user && supabase) {
      await supabase.from("users_profile").update({ github_token: null, github_username: null }).eq("user_id", user.id);
    }
  };

  // 0) valida o token antes (evita criar nada com credencial morta)
  const check = await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } });
  if (check.status === 401) {
    await clearInvalidToken();
    return { error: "Seu token do GitHub expirou ou foi revogado. Reconecte sua conta em Configurações → GitHub (gere um novo token com permissão 'repo')." };
  }
  if (!check.ok) {
    return { error: "Não foi possível validar seu acesso ao GitHub. Tente reconectar em Configurações → GitHub." };
  }

  // 1) cria o repo
  const safeName = input.name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "pytrack-projeto";
  const createRes = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: safeName,
      description: input.description.slice(0, 350),
      private: input.privateRepo ?? false,
      auto_init: true,
    }),
  });
  if (!createRes.ok) {
    if (createRes.status === 401) {
      await clearInvalidToken();
      return { error: "Seu token do GitHub expirou ou foi revogado. Reconecte sua conta em Configurações → GitHub." };
    }
    const err = await createRes.json().catch(() => ({}));
    if (createRes.status === 403) return { error: "Seu token do GitHub não tem permissão para criar repositórios. Gere um novo com o escopo 'repo'." };
    if (createRes.status === 422 && JSON.stringify(err).includes("already exists")) return { error: `Você já tem um repositório chamado "${safeName}". Escolha outro nome.` };
    return { error: err?.message ? `GitHub: ${err.message}` : "Falha ao criar o repositório (o nome pode já existir)." };
  }
  const repo = await createRes.json();
  const owner = repo.owner.login;

  // 2) adiciona os arquivos (Contents API)
  for (const f of input.files) {
    await fetch(`https://api.github.com/repos/${owner}/${safeName}/contents/${encodeURIComponent(f.path)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Adiciona ${f.path} (via PyTrack)`,
        content: Buffer.from(f.content, "utf8").toString("base64"),
      }),
    });
  }

  return { url: repo.html_url, success: "Repositório criado no seu GitHub!" };
}
