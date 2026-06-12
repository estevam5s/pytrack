# 🔐 Checklist de Rotação de Credenciais — PyTrack

> Várias chaves circularam em texto durante o desenvolvimento e/ou ficaram no histórico
> do repositório público. **Rotacione todas** e atualize o `.env` local + as variáveis no
> Vercel. Marque cada item ao concluir.

| ✓ | Credencial | Onde rotacionar | Variável no .env / Vercel |
|---|-----------|-----------------|---------------------------|
| ☐ | **GitHub PAT** | github.com → Settings → Developer settings → Personal access tokens → revogar o antigo e gerar novo (escopo `repo`) | usado no git remote / scripts |
| ☐ | **Supabase Management token** | supabase.com → Account → Access Tokens → revogar e gerar | `SUPABASE_MGMT_TOKEN` (scripts) |
| ☐ | **Supabase service_role** (se exposta) | Supabase → Project Settings → API → "Reset service_role" | `SUPABASE_SERVICE_ROLE_KEY` |
| ☐ | **Stripe secret/restricted** | dashboard.stripe.com → Developers → API keys → "Roll key" | `STRIPE_SECRET_KEY` |
| ☐ | **Stripe webhook secret** | Stripe → Developers → Webhooks → endpoint → "Roll secret" | `STRIPE_WEBHOOK_SECRET` |
| ☐ | **Resend API key** | resend.com → API Keys → revogar e criar | `RESEND_API_KEY` |
| ☐ | **Telegram bot token** | @BotFather → `/revoke` → `/token` | `TELEGRAM_BOT_TOKEN` (bot/Render) |
| ☐ | **Utmify token** | app.utmify.com.br → Integrações/API → gerar novo | `UTMIFY_API_TOKEN` |
| ☐ | **Sentry token/DSN** | sentry.io → Settings → Auth Tokens (e Client Keys p/ DSN) | `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` |
| ☐ | **NVIDIA / OpenRouter** | build.nvidia.com / openrouter.ai → keys | `NVIDIA_API_KEY` / `OPENROUTER_API_KEY` |
| ☐ | **Senha de app do Gmail** (se usada) | myaccount.google.com → Segurança → Senhas de app | SMTP |
| ☐ | **Tauri updater key** | backup de `~/.tauri/pytrack-updater.key` (NÃO perder) | assinatura de updates do app desktop |

## Passos após rotacionar cada chave

```bash
# 1) atualizar no Vercel (prod + preview + dev)
vercel env rm NOME_DA_VAR production -y ; printf 'NOVO_VALOR' | vercel env add NOME_DA_VAR production
# repita para preview e development

# 2) atualizar o .env local (gitignored)
#   edite o arquivo .env trocando o valor

# 3) redeploy para aplicar
vercel --prod --yes
```

## ⚠️ Segredos no histórico do git (repo público)

`docs/stripe.md` e `docs/tasks.md` tiveram segredos reais commitados no passado (já
mascarados na versão atual). Para remover do histórico do GitHub:

```bash
# instale: pipx install git-filter-repo
git filter-repo --replace-text <(printf 'literal:SEGREDO_ANTIGO==>REDACTED\n')
git push --force --all
git push --force --tags
```

> Mesmo sem reescrever o histórico, **rotacionar já neutraliza** o vazamento (a chave antiga
> deixa de funcionar). A reescrita de histórico é opcional e mais arriscada.
