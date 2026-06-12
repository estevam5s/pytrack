# 🔒 Análise de Segurança Avançada — PyTrack

> Auditoria técnica da plataforma PyTrack (`www.pytrack.com.br`).
> Data: junho/2026 · Escopo: aplicação web, banco de dados, pagamentos, e-mail e infraestrutura.

---

## 1. Resumo executivo

A plataforma apresenta uma **postura de segurança boa e acima da média** para um produto de estágio inicial criado por um desenvolvedor solo. As camadas críticas — autorização no banco, cabeçalhos HTTP, isolamento de segredos e pagamentos — estão **corretamente implementadas**. O risco residual está concentrado em **higiene operacional** (rotação de credenciais que circularam em texto) e em pontos de **defesa em profundidade** que podem ser reforçados com o crescimento.

**Classificação geral: B+ (Boa).** Pronta para produção e divulgação, com os ajustes da Seção 7.

| Domínio | Status |
|--------|--------|
| Autorização no banco (RLS) | ✅ Forte |
| Cabeçalhos de segurança HTTP | ✅ Forte |
| Isolamento de segredos | ✅ Forte (com ressalva operacional) |
| Autenticação & sessões | ✅ Boa |
| Pagamentos (Stripe) | ✅ Boa |
| Anti-abuso / rate limiting | 🟡 Adequada (pode reforçar) |
| LGPD / privacidade | 🟡 Adequada (formalizar) |
| Observabilidade / resposta a incidentes | 🟡 Inicial |

---

## 2. Autorização e isolamento de dados (RLS)

**Verificado:** *todas* as tabelas do schema `public` têm **Row Level Security habilitada**. Nenhuma tabela ficou exposta.

- As políticas seguem o padrão `auth.uid() = user_id` para dados privados (perfil, progresso, mensagens, planos, projetos SaaS, carreira).
- Tabelas de leitura pública intencional (perfis da comunidade, certificados para verificação, badges) usam `SELECT using (true)` mas **bloqueiam escrita** a terceiros (`INSERT/UPDATE/DELETE` com `with check (auth.uid() = user_id)`).
- Operações administrativas e que precisam ignorar RLS (broadcast, newsletter, analytics) usam o **service role apenas no servidor** (Server Actions / Route Handlers), nunca no cliente.
- **Testes realizados** confirmaram que um cliente anônimo:
  - lê perfis públicos (200) mas **não** lê mensagens, planos de carreira ou visitas (`[]`/401);
  - **não consegue inserir** em `user_solved`, `user_badges`, `community_experiences` etc. (HTTP 401).

> **Veredicto:** a camada mais importante de um SaaS multi-tenant — o isolamento de dados entre usuários — está **sólida**.

---

## 3. Cabeçalhos HTTP e proteção do navegador

Configurados globalmente em `next.config` para todas as rotas:

| Header | Valor | Protege contra |
|--------|-------|----------------|
| `Content-Security-Policy` | restritiva | XSS, injeção de scripts |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | downgrade para HTTP, MITM |
| `X-Frame-Options` | `DENY` | clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | vazamento de URL |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | abuso de APIs do navegador |

> **Veredicto:** conjunto **completo e moderno**, equivalente ao que grandes SaaS aplicam. HSTS com `preload` é um diferencial.

---

## 4. Segredos e configuração

- A **chave `service_role`** e segredos do Stripe/Resend/NVIDIA **não aparecem** em nenhum componente de cliente — apenas em código de servidor.
- A **chave anônima do Supabase** é pública por design (protegida por RLS) e pode ficar no bundle.
- Variáveis sensíveis estão no **Vercel (criptografadas)** e no `.env` local (fora do versionamento via `.gitignore`).
- **Ressalva operacional (importante):** ao longo do desenvolvimento, vários tokens (GitHub PAT, Supabase Management, Stripe `rk_live`, Resend, senha de app do Gmail) **circularam em texto** durante o trabalho. Eles devem ser **rotacionados** (ver Seção 7). Isso é higiene, não falha de arquitetura.

---

## 5. Autenticação, sessões e anti-abuso

- **Supabase Auth (GoTrue)** com confirmação de e-mail obrigatória (`mailer_autoconfirm=false`).
- **2FA (TOTP)** disponível e dispositivos confiáveis.
- E-mails transacionais via **Resend** com domínio `pytrack.com.br` **verificado** (SPF/DKIM/DMARC) — boa entregabilidade e antifraude.
- No cadastro há **defesa em profundidade**: validação de formato, bloqueio de **e-mails descartáveis**, checagem de **registro MX** (e-mail real), **rate limiting** por e-mail/IP e **limite de contas por IP** (anti-burla de trial).
- Sessões nos apps usam **armazenamento seguro do SO** (keychain/keystore). No bot do Telegram, a senha enviada é **apagada da conversa**.
- O **gating por plano** é feito no **middleware de borda** (antes de renderizar) e reforçado **na página** (dupla verificação) — um usuário não acessa recurso pago manipulando o cliente.

> **Reforços recomendados:** captcha (hCaptcha/Turnstile) no cadastro/login e proteção a brute-force de senha por IP com bloqueio temporário.

---

## 6. Pagamentos (Stripe)

- Integração com **Stripe** usando `STRIPE_SECRET_KEY`, todos os `PRICE_ID` (Completo/Suprema/Vitalício, mensal e anual) e **webhook com assinatura verificada** (`STRIPE_WEBHOOK_SECRET`).
- O **webhook valida a assinatura** do evento antes de processar — impede que terceiros forjem confirmações de pagamento.
- O **gating de acesso** deriva da tabela `subscriptions` (sincronizada pelo webhook), não de um valor manipulável no cliente.
- O programa de **indicação (1 mês grátis)** é processado de forma **idempotente** (`reward_granted`), tanto na **confirmação de conta** do indicado quanto no **pagamento** (webhook), com crédito Stripe ou mês de cortesia.

> **Veredicto:** o fluxo de pagamento e o controle de acesso estão **corretos e à prova de manipulação pelo cliente**. O ponto de atenção é a **chave `rk_live` ter circulado** — rotacione.

---

## 7. Plano de ação (prioridade)

**🔴 Alta (fazer antes/junto da divulgação):**
1. **Rotacionar todas as credenciais** que circularam em texto: GitHub PAT, Supabase Management token, Stripe restricted key, Resend API key, senha de app do Gmail.
2. Confirmar que o **webhook do Stripe** está ativo no painel da Stripe apontando para `…/api/stripe/webhook` e recebendo eventos (status 200).
3. Garantir backup do **par de chaves do updater Tauri** (sem ele, não há como assinar updates futuros do app desktop).

**🟡 Média (primeiras semanas):**
4. Adicionar **captcha** (Cloudflare Turnstile) no cadastro/login.
5. Ativar **observabilidade**: Sentry para erros + alertas de webhook falho.
6. Formalizar **LGPD**: já há exportar/excluir conta; publicar política de retenção e DPA, e nomear um contato de privacidade.
7. Habilitar **MFA obrigatório** para a conta admin.

**🟢 Baixa (com o crescimento):**
8. Backups gerenciados (plano Pro do Supabase) e testes de restauração.
9. Pentest externo / bug bounty quando houver receita recorrente relevante.
10. WAF/rate limiting na borda (Cloudflare) para picos e DDoS.

---

## 8. Conclusão

A PyTrack **não tem falhas estruturais de segurança**. As camadas que realmente importam num SaaS — **isolamento de dados (RLS), cabeçalhos, segredos e integridade dos pagamentos** — estão bem feitas. O trabalho restante é **operacional** (rotação de chaves, captcha, observabilidade, LGPD formal), típico da transição de "MVP funcional" para "produto com clientes pagantes".

**Pode divulgar com segurança**, executando a Seção 7 (itens 🔴) primeiro.
