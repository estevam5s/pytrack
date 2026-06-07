# 🔐 Segurança — PyTrack

Auditoria baseada no **OWASP Top 10 (2021)** e em práticas do **OWASP ASVS**. Documenta controles, status e ações.

> Esta é uma auto-avaliação contínua, não um pentest formal. Recomenda-se um teste de invasão independente antes de escalar.

---

## OWASP Top 10 — status

| # | Risco | Controles na PyTrack | Status |
|---|-------|----------------------|--------|
| A01 | **Broken Access Control** | RLS em todas as tabelas (usuário só lê o próprio); gating por plano no middleware (`tierAtLeast`); rotas admin checam `isAdmin`; `service_role` só no servidor | ✅ |
| A02 | **Cryptographic Failures** | HTTPS (Vercel); senhas com hash (Supabase Auth); segredos só no servidor; sem dados sensíveis no cliente | ✅ |
| A03 | **Injection** | Supabase client (queries parametrizadas, sem SQL cru); React escapa saída (XSS); markdown sanitizado pelo renderer | ✅ |
| A04 | **Insecure Design** | Fail-open consciente no billing; freemium/trial; 2FA opcional; rate limiting; separação server/client | ✅ |
| A05 | **Security Misconfiguration** | `poweredByHeader: false`; env por ambiente na Vercel; `.env` gitignored; RLS habilitado por padrão | ✅ |
| A06 | **Vulnerable Components** | Next 15, deps atualizadas; `npm audit` no CI recomendado; Dependabot sugerido | ⚠️ ativar Dependabot |
| A07 | **Identification & Auth Failures** | Supabase Auth; **2FA (TOTP)**; rate limit em login/cadastro; OAuth GitHub; verificação de e-mail | ✅ |
| A08 | **Software & Data Integrity** | Webhook Stripe com verificação de **assinatura** + deduplicação; CI antes do deploy | ✅ |
| A09 | **Logging & Monitoring Failures** | `lib/logger.ts` + `/api/log` + `global-error.tsx`; logs na Vercel; webhook opcional (Logtail/Sentry) | ✅ (ver MONITORING.md) |
| A10 | **SSRF** | Sem fetch de URLs arbitrárias do usuário no servidor; provedores de IA via base URLs controladas | ✅ |

---

## Áreas específicas (ASVS)

### Autenticação & Sessão
- Senhas via Supabase Auth (hash). **2FA TOTP** disponível e exigível no login (AAL2).
- Rate limit: login 8/min, cadastro 5/10min (anti-brute-force).
- Sessões via cookies httpOnly gerenciados pelo `@supabase/ssr`.

### Autorização
- **RLS** em todas as tabelas; políticas `select/insert/update` restritas a `auth.uid()`.
- Operações privilegiadas (webhook, admin, criação de usuários) usam `service_role` **apenas no servidor**.
- Gating por plano no middleware (rotas) + por tier no conteúdo.

### XSS / Injection
- React escapa por padrão. Markdown renderizado com `react-markdown` (sem `dangerouslySetInnerHTML` de conteúdo do usuário).
- Sem concatenação de SQL — tudo via cliente Supabase parametrizado.

### Upload de arquivos
- Apps/binários: upload via **signed URL** direto ao Storage (bucket dedicado), só admin gera a URL.
- Avatares/materiais: buckets com políticas; tipos validados no input.

### Webhooks & APIs
- Stripe webhook: `constructEvent` (assinatura) + dedupe via `payment_events`.
- APIs internas autenticam por sessão; rate limiting nas ações sensíveis.

### Dados pessoais (LGPD)
- Exportação e exclusão de conta self-service; consentimento via Termos/Privacidade.

---

## Pendências recomendadas
- [ ] Ativar **Dependabot** + `npm audit` no CI.
- [ ] Adicionar **Content-Security-Policy** (headers) — avaliar impacto no Pyodide/CDNs.
- [ ] **Códigos de recuperação** para o 2FA.
- [ ] Pentest externo antes de escalar.
- [ ] Criptografar em repouso as chaves de IA do usuário (hoje em coluna protegida por RLS).

---

## 🔑 Rotação de secrets (AÇÃO NECESSÁRIA)

Chaves que apareceram em texto durante o desenvolvimento e **devem ser rotacionadas**:
- **Stripe** restricted key `rk_live_…` → criar nova em *Developers → API keys* e atualizar `STRIPE_SECRET_KEY` (Vercel + `.env`).
- **GitHub PAT** `ghp_…` → revogar em *GitHub → Settings → Developer settings → Tokens* (não é usado pelo OAuth).
- **Supabase Management PAT** `sbp_…` → rotacionar em *Account → Access Tokens* se exposto.

### Boas práticas
- `.env`/`.env.local` **gitignored** (✅). Use `.env.example` como referência.
- Variáveis na **Vercel** separadas por ambiente: **Production**, **Preview** e **Development**.
- Nunca colar segredos em chat, issues ou commits.
- Prefira **restricted keys** (escopo mínimo) e rode rotação periódica.
