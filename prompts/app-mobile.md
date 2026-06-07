# 📱 Prompt — App Mobile PyTrack (Android) com Claude Code

> Cole este arquivo inteiro como instrução para o **Claude Code** construir o **aplicativo mobile** do PyTrack. Não é um site embrulhado em WebView — é um **app nativo** que consome o **mesmo backend** da plataforma (Supabase + Stripe), com **todas as rotas** (incluindo as de admin), **todas as trilhas** e **toda a segurança** já existente no site.

---

## 0. Objetivo

Construir o **app oficial PyTrack para Android** (e iOS, se viável no mesmo código) — uma plataforma nativa de aprendizado de Python. O app **espelha o dashboard web**: trilhas, conteúdos, exercícios com IA, IDE Python, comunidade, carreira, configurações, suporte e **painel administrativo**. **Tem tela de Login, mas NÃO tem cadastro** — o registro é feito no site (`https://www.pytrack.com.br/auth/register`); no app, exibir um botão "Criar conta no site" que abre o navegador.

## 1. Stack obrigatória

- **React Native + Expo** (SDK mais recente) + **TypeScript** (strict).
- **expo-router** (file-based routing, igual ao Next App Router).
- **NativeWind** (Tailwind no RN) para reaproveitar os tokens de design da web.
- **@supabase/supabase-js** + **AsyncStorage**/**expo-secure-store** para sessão.
- **expo-secure-store** para tokens (NUNCA AsyncStorage puro para o refresh token).
- **@tanstack/react-query** para cache/estado de dados.
- **expo-web-browser** + **expo-auth-session** para OAuth (GitHub) e checkout Stripe.
- **react-native-webview** para a **IDE Python (Pyodide)** e renderização de Markdown pesado, se necessário.
- **expo-notifications** (lembretes), **expo-image** (imagens otimizadas).
- Ícones: **lucide-react-native**.

## 2. Backend (o MESMO da web — não criar outro)

- **Supabase** projeto ref: `zohqgnhymtqppgzlammv`
  - URL: `https://zohqgnhymtqppgzlammv.supabase.co`
  - Use `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` (copiar do `.env` do site — a anon key é pública e protegida por RLS).
- **RLS já está ativo** em todas as tabelas: o app usa SOMENTE a `anon key` + sessão do usuário. **NUNCA** embutir `service_role` ou qualquer segredo de servidor no app.
- Tabelas relevantes: `users_profile`, `contents`, `progress`, `subscriptions`, `community_*`, `support_messages`, `user_ai_settings`, `referrals`, `app_releases`, `community_reports`, `rate_limits`.
- **IA** (correção de exercícios / consultor de carreira): a chamada à IA é **server-side**. No app, chamar via **Supabase Edge Function** ou um endpoint HTTPS do próprio site (`https://www.pytrack.com.br/...`) que já encapsula o OpenRouter. NÃO colocar chave de IA no app. Respeitar o BYOK (`user_ai_settings`) do usuário.

## 3. Autenticação e segurança (replicar a da web)

- **Login** (`/login`): e-mail + senha (`supabase.auth.signInWithPassword`).
- **GitHub OAuth**: `supabase.auth.signInWithOAuth({ provider: 'github' })` via `expo-auth-session` com deep link (`pytrack://auth/callback`). Configurar o redirect na allowlist do Supabase.
- **2FA (TOTP)**: se o usuário tiver fator verificado, após a senha o AAL fica `aal1→aal2`; exibir tela `/auth/mfa` para digitar o código (`supabase.auth.mfa.challenge`+`verify`). Bloquear o acesso ao app até `aal2`.
- **Sem cadastro no app**: botão "Ainda não tem conta? Criar no site" → `WebBrowser.openBrowserAsync('https://www.pytrack.com.br/auth/register')`.
- **Sessão**: persistir com `expo-secure-store`; auto-refresh; logout limpa tudo.
- **Gating por plano** (idêntico à web): ranking `free(0) < essencial(1) < completo(2) < suprema(3) < vitalicio(4)`.
  - Usuário **sem assinatura paga** tem **7 dias grátis** desde o cadastro; depois, bloquear rotas pagas e mostrar tela de upgrade.
  - Rotas/recursos **exclusivos do Completo+**: comunidade, projetos, especializações, consultor IA, vagas, perguntas de carreira.
  - Conteúdo: trilha de Fundamentos é grátis; módulos avançados (ML, Eng. de Dados, IoT, Arquitetura, Especializações, Segurança) exigem Completo+.
- **Não** confiar só no client: o gating real é garantido pelo RLS/backend; o app apenas reflete o estado.

## 4. Navegação e TODAS as rotas (espelhar o dashboard)

Use **abas inferiores** (bottom tabs) para o núcleo + um **drawer/menu** para o resto. Estrutura de telas (expo-router):

**Auth**
- `/login` · `/auth/mfa` · `/auth/callback` (deep link OAuth)

**Estudar**
- `/inicio` — hub: progresso, próximos passos, XP/nível, atalhos, banner de upgrade se grátis.
- `/trilhas` — as **16 trilhas** agrupadas por plano (ver lista na seção 6), com cadeado por tier.
- `/trilhas/[id]` — detalhe: tópicos + módulos agrupados por área + progresso; "Começar/Continuar".
- `/conteudos/[modulo]` e `/conteudos/[modulo]/[licao]` — leitor de lição (Markdown + code highlight), marcar como concluída.
- `/comunidade` (Completo+) — feed, posts, curtidas, comentários, ranking; denunciar conteúdo.
- `/evolucao` — gráficos de XP, horas e progresso por área.
- `/stack` — stack do ecossistema com logos.
- `/exercicios` — exercícios com **correção por IA** (nota, feedback, melhor solução) + aviso/fallback se IA falhar.
- `/ide` — **IDE Python** (Pyodide via WebView), rodando Python no aparelho.

**Recursos**
- `/aulas-udemy` · `/aulas-youtube` (detalhe + análise por IA)
- `/material` (CRUD + upload validado) · `/livros` (capa/PDF, baixar)
- `/aplicativo` — tela "sobre o app" + (para Completo+) checar atualizações via `app_releases`.

**Carreira**
- `/minha-carreira` · `/especializacoes` · `/consultor-ia` · `/vagas` · `/perguntas-carreira-python`

**Conta**
- `/perfil`
- `/configuracoes` (hub) com subrotas: `conta`, `perfil`, `plano` (upgrade/downgrade/reembolso/portal via WebBrowser), `ia` (BYOK), `indicacoes`, `seguranca` (2FA + GitHub), `aparencia` (tema), `plataforma`, `dados` (exportar/excluir conta — LGPD).
- `/suporte` — enviar mensagem ao admin + thread.

**Admin** (somente e-mails admin: `contato@estevamsouza.com.br`, `estevamsouzalaureth@gmail.com`) — esconder o grupo para não-admins:
- `/admin` — hub + criar usuários Suprema vitalício.
- `/admin/clientes` — métricas (MRR, ARR, assinaturas, planos), lista de clientes (excluir/mudar plano), busca, CSV. **Excluir os próprios admins do faturamento.**
- `/admin/moderacao` — denúncias pendentes (remover post / bloquear autor / resolver) + bloqueados.
- `/admin/mensagens` — caixa de entrada do suporte + responder.

> Rota inexistente → tela **404 informativa** (mesmo espírito da web).

## 5. Pagamentos (Stripe)

- O app **não processa cartão diretamente**. Para assinar/upgrade/downgrade: abrir `https://www.pytrack.com.br/assinar` (ou o Checkout) via `expo-web-browser`; ao voltar, recarregar o estado da assinatura.
- Gerenciar/cancelar/reembolso: abrir o portal/`/configuracoes/plano` no navegador.
- Refletir o plano lendo `subscriptions` (RLS) + a lógica de `tierOf`/`hasDashboardAccess`.
- Mostrar os planos: Grátis (7 dias) · Essencial R$10 · Completo R$19 · Suprema R$46 · **Vitalício R$697 (único)**.

## 6. Trilhas (as mesmas 16 da web)

Grátis: **Primeiros Passos**.
Essencial: **Python Developer**, **Backend Developer**, **Data Analytics**, **Automação & Produtividade**, **Apps Desktop & Jogos**.
Completo: **Engenharia de Dados**, **Machine Learning & IA**, **DevOps & Cloud**, **Arquitetura de Software**, **IoT & Embarcados**, **Cyber Security**, **Blockchain**, **Bioinformática**, **Quant & Finanças**.
Suprema: **Python Mastery — Trilha Suprema** (todos os módulos + projeto final SaaS).

Cada trilha tem objetivo, tópicos (currículo) e contagem divulgada (módulos/aulas/horas). O conteúdo real vem de `contents` + os arquivos de lição.

## 7. UI/UX — robusta e profissional

- **Tema claro/escuro** com os tokens da marca:
  - primary `#8234E9` / primary-light `#9956F6`; secondary/green `#29E0A9`; blue `#5F75F2`; magenta `#E254FF`; fundo escuro `#09090B`.
- Logo: usar o `new-logo.png` da plataforma.
- Componentes: cards com cantos arredondados, gradientes sutis, animações (Reanimated/Moti), skeletons de carregamento, pull-to-refresh, estados vazios e de erro.
- **Onboarding** pós-primeiro login: perguntar o objetivo (Backend, Dados, Eng. de Dados, Automação, IoT, Carreira) → levar à trilha ideal.
- Gamificação: XP, níveis, notificação de "subiu de nível", sequência (streak) com lembretes.
- Acessibilidade e responsividade para telefones e tablets.

## 8. Segurança (replicar a do site)

- Tokens em **expo-secure-store** (keychain/keystore do SO).
- Nenhum segredo de servidor no bundle (só anon key pública).
- Confiar no **RLS** do Supabase para autorização.
- **2FA** obrigatório quando ativado pelo usuário.
- Validação de uploads (tamanho/extensão/MIME) antes de enviar ao Storage, com nomes seguros (espelhar `lib/upload-validation.ts`).
- Rate limiting é aplicado no backend; tratar respostas de limite com mensagens amigáveis.
- Deep links e callback OAuth validados; HTTPS sempre.

## 9. Build e distribuição

- **Android**: `eas build -p android` gerando **APK** (e AAB para a Play Store). O APK deve poder ser disponibilizado em `/aplicativo` (bucket `app-releases`) para download por usuários **Completo+**.
- iOS (opcional): `eas build -p ios`.
- Configurar `app.json`/`app.config.ts`: nome "PyTrack", ícone (new-logo), scheme `pytrack`, deep link para OAuth, permissões mínimas.
- Versionamento + changelog.

## 10. Critérios de aceite

- [ ] Login com e-mail/senha, GitHub OAuth e 2FA funcionando; sem cadastro no app.
- [ ] Todas as rotas acima implementadas, incluindo as de **admin** (escondidas para não-admins).
- [ ] Gating por plano idêntico ao site (7 dias grátis, tiers, completo-only).
- [ ] 16 trilhas + leitor de conteúdo + IDE Python funcionando.
- [ ] Correção de exercícios por IA + consultor de carreira (via backend, com fallback).
- [ ] Comunidade, suporte, configurações (incl. LGPD: exportar/excluir conta).
- [ ] Tema claro/escuro, onboarding, gamificação, offline básico (cache).
- [ ] Segurança: secure storage, RLS, 2FA, uploads validados, sem segredos no bundle.
- [ ] Build Android (APK/AAB) gerando artefato instalável.

> Entregue um projeto Expo organizado (`app/`, `components/`, `lib/`, `hooks/`), tipado, com README de setup (env, `eas build`, deep links e provedores Supabase).
