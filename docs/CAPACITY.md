# 📊 Análise de Capacidade — 3.000+ usuários

Avaliação se a plataforma (Vercel + Supabase + Stripe) suporta 3.000+ usuários com mix de planos.

## Cenário simulado (3.000 usuários)

| Plano | % | Usuários | Receita |
|-------|---|----------|---------|
| Vitalício (R$697 único) | 10% | 300 | R$ 209.100 (único) |
| Suprema (R$46/mês) | 15% | 450 | R$ 20.700/mês |
| Completo (R$19/mês) | 25% | 750 | R$ 14.250/mês |
| Essencial (R$10/mês) | 20% | 600 | R$ 6.000/mês |
| Grátis/Trial | 30% | 900 | — |

- **MRR**: R$ 40.950/mês · **ARR**: R$ 491.400/ano
- **Vitalício (único)**: R$ 209.100 · **Receita ano 1**: ~R$ 700.500
- **Taxas Stripe**: ~R$ 2.336/mês (~5,7% do MRR) → **líquido ~R$ 38.614/mês**

## Veredito por serviço

### ✅ Stripe — sem limites
Processa milhões de transações. 3.000 assinaturas é trivial. O webhook é idempotente (dedupe por `payment_events`) e agora trata `charge.refunded`/`charge.dispute.created`. **Nenhuma ação necessária.**

### ✅ Vercel — escala automática
Funções serverless escalam horizontalmente sob demanda. Páginas estáticas/ISR e a CDN absorvem picos de tráfego. **Suporta 3.000+ usuários simultâneos.** Atenção apenas a cold starts em rotas dinâmicas (mitigado por uso real constante).

### ⚠️ Supabase — suporta, com ajuste recomendado
- **Banco estimado para 3.000 usuários**: ~**166 MB** (3.000 × ~50KB de dados por usuário + ~20MB de conteúdo compartilhado). Cabe até no plano Free (500MB), folgado no Pro (8GB).
- **Acesso via REST (PostgREST)**: o `@supabase/supabase-js` usa a **API REST**, que **não abre uma conexão Postgres por requisição** — ela faz pooling interno. Por isso escala para milhares de usuários sobre as 60 conexões diretas.
- **`max_connections` = 60** (instância atual): só é gargalo se algo abrir **conexão direta** ao Postgres (não é o nosso caso). Se um dia usar Prisma/conexão direta em serverless, **ative o Connection Pooler (Supavisor) em modo transaction** (porta 6543) — suporta milhares de conexões.

## Recomendações antes de escalar para produção em massa

1. **Upgrade do Supabase para o plano Pro (US$25/mês)** — habilita PITR (backups point-in-time), mais CPU/RAM e remove limites do Free. Recomendado a partir de ~algumas centenas de usuários pagantes.
2. **Connection Pooler ligado** (já disponível no Supabase) — usar a connection string do pooler se houver acesso direto ao Postgres.
3. **Índices** — já existem nas tabelas quentes (RLS por `user_id`); revisar `EXPLAIN ANALYZE` nas queries do dashboard sob carga.
4. **Cache/ISR** — páginas públicas (site, blog, trilhas) com revalidação para reduzir carga no banco em picos.
5. **Monitorar** — Supabase → Reports (conexões, queries lentas) e Vercel Analytics; alertas no webhook da Stripe.
6. **Rate limiting** — já aplicado (login, cadastro, suporte, comunidade, chat) — protege contra abuso sob escala.

## Conclusão

**Sim — a arquitetura suporta 3.000+ usuários** com o mix de planos acima.
- Stripe e Vercel: prontos, sem ação.
- Supabase: suporta tecnicamente já hoje (uso via REST); **recomenda-se o plano Pro** para garantir performance, backups e folga ao crescer.

> Teste de carga reproduzível: `load-test/k6.js` (`k6 run -e VUS=200 load-test/k6.js`) contra staging para medir p95 sob carga real.
