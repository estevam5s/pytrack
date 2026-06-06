# Prompt profissional para IA implementar pagamentos Stripe em SaaS com Next.js + Supabase

"
API Key Publica: pk_live_51QIyurCB6Dz1wPeiqSW14I9x21dZpwith28Ys80f4HdFDy0GMyEy9p7qfK4nEA6GcHstvcE5fNMn2CKkyfDM2UmQ00es8uYUYi
API Key Privada: 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
"

Você é uma IA especialista em SaaS, Stripe Billing, Supabase, Next.js App Router, TypeScript, segurança, webhooks, autenticação e arquitetura de produtos por assinatura.

Implemente um sistema completo de monetização mensal para minha plataforma Python.

O produto será um SaaS com assinatura mensal de:

```txt
R$ 10,00 por mês
```

A assinatura deve liberar acesso ao dashboard apenas para usuários com plano ativo ou com período pago ainda vigente.

---

## Regras críticas de segurança

Nunca exponha chaves privadas no frontend.

Use variáveis de ambiente:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

A `SUPABASE_SERVICE_ROLE_KEY` e `STRIPE_SECRET_KEY` só podem ser usadas no servidor.

---

## Fluxo obrigatório

1. Usuário acessa `/cadastro`
2. Cria conta via Supabase Auth
3. Após cadastro, redirecionar para `/assinar`
4. Usuário clica em “Assinar por R$10/mês”
5. Criar sessão Stripe Checkout
6. Usuário paga na Stripe
7. Stripe envia evento para webhook
8. Webhook salva/atualiza assinatura no Supabase
9. Usuário ganha acesso ao dashboard
10. Se cancelar, continua com acesso até `current_period_end`
11. Após vencer o período pago, bloquear dashboard

---

## Produto na Stripe

Criar ou orientar criação do produto:

```txt
Nome: Python Learning Platform Pro
Preço: R$10,00
Moeda: BRL
Recorrência: mensal
Tipo: subscription
```

Salvar o Price ID em:

```env
STRIPE_PRICE_ID=price_xxxxxxxxx
```

---

## Rotas obrigatórias

Criar:

```txt
/app/assinar/page.tsx
/app/api/stripe/create-checkout-session/route.ts
/app/api/stripe/create-portal-session/route.ts
/app/api/stripe/webhook/route.ts
/app/(dashboard)/configuracoes/plano/page.tsx
```

Atualizar proteção do dashboard:

```txt
/middleware.ts
/lib/auth/subscription-guard.ts
```

---

## Banco de dados Supabase

Criar arquivo:

```txt
/supabase/stripe-subscriptions-schema.sql
```

Tabelas obrigatórias:

### stripe_customers

Campos:

* id
* user_id
* stripe_customer_id
* email
* created_at
* updated_at

### subscriptions

Campos:

* id
* user_id
* stripe_customer_id
* stripe_subscription_id
* stripe_price_id
* status
* current_period_start
* current_period_end
* cancel_at_period_end
* canceled_at
* trial_start
* trial_end
* metadata
* created_at
* updated_at

### payment_events

Campos:

* id
* stripe_event_id
* type
* processed
* payload
* created_at

Status aceitos:

```txt
active
trialing
past_due
canceled
unpaid
incomplete
incomplete_expired
paused
```

Criar índices, constraints, RLS e policies.

---

## Regra de acesso ao dashboard

O usuário pode acessar o dashboard se:

```ts
subscription.status === "active" || subscription.status === "trialing"
```

ou se:

```ts
subscription.current_period_end > new Date()
```

Mesmo se `cancel_at_period_end = true`, o usuário mantém acesso até o fim do período pago.

Bloquear acesso quando:

* Não existe assinatura
* Assinatura vencida
* Status `canceled` sem período vigente
* Status `unpaid`
* Status `incomplete_expired`

Redirecionar para:

```txt
/assinar
```

---

## Stripe Checkout

Criar endpoint:

```txt
POST /api/stripe/create-checkout-session
```

Esse endpoint deve:

* Verificar usuário autenticado
* Criar ou recuperar Stripe Customer
* Criar Checkout Session
* Usar `mode: "subscription"`
* Usar `STRIPE_PRICE_ID`
* Enviar `user_id` em metadata
* Definir `success_url`
* Definir `cancel_url`

URLs:

```ts
success_url: `${NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`
cancel_url: `${NEXT_PUBLIC_APP_URL}/assinar?checkout=cancelled`
```

---

## Stripe Customer Portal

Criar endpoint:

```txt
POST /api/stripe/create-portal-session
```

Esse endpoint deve:

* Verificar usuário autenticado
* Buscar `stripe_customer_id`
* Criar sessão do Billing Portal
* Redirecionar usuário para gerenciar assinatura
* Permitir cancelamento do plano pela Stripe

Na rota:

```txt
/configuracoes/plano
```

Adicionar botão:

```txt
Gerenciar assinatura
```

Esse botão abre o Stripe Customer Portal.

---

## Webhook Stripe

Criar endpoint:

```txt
POST /api/stripe/webhook
```

Obrigatório:

* Usar raw body
* Validar assinatura com `STRIPE_WEBHOOK_SECRET`
* Ignorar eventos já processados
* Salvar evento em `payment_events`
* Atualizar Supabase com service role
* Nunca depender apenas do retorno do Checkout no frontend

Eventos obrigatórios:

```txt
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
customer.updated
```

Para cada evento:

### checkout.session.completed

* Recuperar customer
* Recuperar subscription
* Relacionar com `user_id`
* Criar/atualizar `stripe_customers`
* Criar/atualizar `subscriptions`

### customer.subscription.created

* Criar assinatura no Supabase

### customer.subscription.updated

* Atualizar status
* Atualizar `current_period_start`
* Atualizar `current_period_end`
* Atualizar `cancel_at_period_end`

### customer.subscription.deleted

* Atualizar status para `canceled`
* Manter `current_period_end`

### invoice.payment_succeeded

* Garantir assinatura ativa
* Atualizar período pago

### invoice.payment_failed

* Atualizar status para `past_due` ou `unpaid`

---

## Arquivos obrigatórios

Criar:

```txt
/lib/stripe/client.ts
/lib/stripe/server.ts
/lib/stripe/subscriptions.ts
/lib/supabase/admin.ts
/lib/auth/require-subscription.ts
/lib/auth/get-current-user.ts
/components/billing/SubscribeButton.tsx
/components/billing/ManageSubscriptionButton.tsx
/components/billing/SubscriptionStatusCard.tsx
/components/billing/PricingCard.tsx
```

---

## Página `/assinar`

Criar uma página premium de assinatura com:

* Nome do plano
* Preço: R$10/mês
* Benefícios
* CTA “Assinar agora”
* Loading state
* Error state
* Segurança de pagamento via Stripe
* Design dark premium

Benefícios:

* Acesso completo ao dashboard
* Conteúdos Python do básico ao avançado
* Trilhas de dados, IoT, backend e engenharia
* Exercícios práticos
* Projetos reais
* Comunidade
* Materiais, livros e aulas Udemy
* Evolução personalizada

---

## Página `/configuracoes/plano`

Mostrar:

* Plano atual
* Status da assinatura
* Data de renovação
* Se está cancelado no fim do período
* Botão “Gerenciar assinatura”
* Botão “Assinar novamente” se necessário

---

## Vercel

Adicionar instruções para configurar variáveis na Vercel:

```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_ID
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

---

## Stripe CLI para testes locais

Adicionar instruções:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Salvar o webhook secret local em:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Testar evento:

```bash
stripe trigger checkout.session.completed
```

---

## Comandos de instalação

```bash
npm install stripe @stripe/stripe-js
npm install @supabase/supabase-js @supabase/ssr
```

---

## Resultado esperado

A IA deve entregar uma implementação completa e funcional de assinatura SaaS com Stripe + Supabase, onde:

* Usuário cria conta
* Usuário paga R$10/mês
* Webhook ativa assinatura
* Supabase armazena status
* Dashboard só libera acesso para assinantes
* Usuário pode gerenciar/cancelar plano
* Cancelamento mantém acesso até o fim do período já pago
* Vencimento bloqueia dashboard
* Tudo funciona em produção na Vercel
