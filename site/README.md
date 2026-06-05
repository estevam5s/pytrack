# 🐍 PyTrack — Site institucional

Landing page / site público da plataforma de aprendizado **PyTrack** (Python do
básico à carreira). Projeto **separado** do dashboard, para não interferir no app
principal.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide.

## Paleta
Dark-first: `#09090A` (fundo), `#121214` (cards), roxo `#8234E9` como primária e
gradiente neon verde→azul→roxo→magenta nos destaques. Fonte **Plus Jakarta Sans**.

## Rodando

```bash
cd site
npm install
npm run dev          # http://localhost:3000  (use -p 3001 se o app usar a 3000)
```

Como o **dashboard** roda em outra porta, rode o site em uma porta livre:

```bash
npm run dev -- -p 3001
```

### Integração com a plataforma
Os botões **Entrar / Começar agora / Cadastro** apontam para a autenticação real
do app principal. Configure a URL em `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:6464   # onde o dashboard está rodando
```

Os links viram `${NEXT_PUBLIC_APP_URL}/auth/login` e `/auth/register`.

## Páginas
`/` (landing completa) · `/sobre` · `/trilhas` · `/recursos` · `/projetos` ·
`/carreira` · `/precos` · `/login` · `/cadastro`.

## Componentes (`components/site`)
navbar · hero-section · dashboard-mockup · section-header · feature-card ·
track-card · project-card · career-card · pricing-card · faq-item · cta-section ·
footer · gradient-text · reveal · page-hero · auth-landing.

Dados mockados em `lib/site-data.ts`. Conteúdo é estático (RSC) com ilhas
client apenas onde há interação (navbar, hero, FAQ, animações).

## Build

```bash
npm run build && npm run start
```
