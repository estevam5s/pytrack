# 📈 Monitoramento e Logs — PyTrack

## O que já existe (sem dependências extras)

- **`lib/logger.ts`** — logger central (`logEvent`/`logError`). Sempre escreve no console (visível em **Vercel → Logs**) e, se `LOG_WEBHOOK_URL` estiver definido, envia o evento para um destino externo (Logtail/Better Stack, Discord, Slack…).
- **`/api/log`** — endpoint que recebe erros do cliente.
- **`app/global-error.tsx`** — error boundary global: mostra uma tela amigável e **reporta o erro** para `/api/log`.
- Erros críticos já instrumentados (ex.: `stripe.webhook`).

### Ativar um destino externo (rápido)
1. Crie uma "HTTP source" no **Better Stack / Logtail** (ou um webhook do Discord/Slack).
2. Defina na Vercel: `LOG_WEBHOOK_URL=https://...`.
3. Pronto — erros do servidor e do cliente passam a ser enviados.

## Sentry (recomendado para produção séria)

Para captura rica (stack traces, performance, releases):

```bash
npx @sentry/wizard@latest -i nextjs
```

Isso cria `sentry.client/server.config.ts` e instrumentação. Defina:
- `NEXT_PUBLIC_SENTRY_DSN` e `SENTRY_AUTH_TOKEN` na Vercel.

Depois, substitua as chamadas `logError(...)` por `Sentry.captureException(...)` (ou mantenha ambos).

## O que monitorar
- **Erros de pagamento** — falhas no webhook/checkout (já logado em `stripe.webhook`).
- **Falhas de IA** — correção de exercícios / consultor (tratadas com fallback + aviso ao usuário).
- **Latência** — Core Web Vitals (Vercel Analytics / Speed Insights) + load test (`load-test/`).
- **Banco** — Supabase → *Reports* (conexões, queries lentas).
- **Disponibilidade** — página pública **/status** (ping em site, db, auth, Stripe, IA).

## Alertas sugeridos
- Erro 5xx acima de X/min → notificar.
- Webhook Stripe falhando → notificar (risco de assinaturas não ativarem).
- Saldo/sucesso de pagamentos → painel `/admin/clientes`.
