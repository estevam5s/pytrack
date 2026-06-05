---
title: "Documentação de Design — Landing Page Rocketseat"
description: "Engenharia reversa da landing page: design system, tipografia, layout e componentes para recriação fiel."
---

# 1. Design System

A identidade visual é **dark-first**, com fundo quase preto, tipografia branca e um **acento roxo/violeta** reforçado por um gradiente multicolorido (verde → azul → roxo → magenta) usado em textos de destaque e detalhes neon.

## Paleta de cores

| Token | HEX | RGB | Uso |
|-------|-----|-----|-----|
| Background base | `#09090A` | `rgb(9, 9, 10)` | Fundo do `body` e da maioria das seções |
| Surface / Elevated | `#121214` | `rgb(18, 18, 20)` | Navbar, cards, blocos elevados |
| Primária (violeta) | `#8234E9` | `rgb(130, 52, 233)` | Borda de botões, foco, acento principal |
| Primária alt (roxo) | `#9956F6` | `rgb(153, 86, 246)` | Bordas de cards em destaque, gradiente |
| Texto principal | `#FFFFFF` | `rgb(255, 255, 255)` | Títulos (H1–H3) |
| Texto secundário | `#C4C4CC` | `rgb(196, 196, 204)` | Corpo de texto, parágrafos, labels |
| Preto puro | `#000000` | `rgb(0, 0, 0)` | Texto sobre botões brancos |
| Branco translúcido | `rgba(255,255,255,0.1)` | — | Fundo de badges e botões "ghost" |

### Cores do gradiente de destaque
São os 4 *stops* usados no gradiente principal (texto "tecnologia e inteligência artificial"):

| Cor | HEX | RGB |
|-----|-----|-----|
| Verde água | `#29E0A9` | `rgb(41, 224, 169)` |
| Azul/Índigo | `#5F75F2` | `rgb(95, 117, 242)` |
| Roxo | `#9956F6` | `rgb(153, 86, 246)` |
| Magenta | `#E254FF` | `rgb(226, 84, 255)` |

## Gradientes utilizados

```css
/* Gradiente de texto (título hero e palavras de destaque) */
background-image: linear-gradient(
  97.57deg,
  #29E0A9 -12.7%,
  #5F75F2 32.64%,
  #9956F6 78.49%,
  #E254FF 109.78%
);
/* aplicar com: */
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
color: transparent;
```

O fundo do hero usa uma sobreposição radial/elíptica de tons roxos sobre o `#09090A`, simulando um "glow" central. Reproduzível com:

```css
background:
  radial-gradient(ellipse 80% 60% at 50% 0%, rgba(130,52,233,0.25), transparent 70%),
  #09090A;
```

## Opacidade e variações
- Superfícies translúcidas (badges, botões ghost): branco a **10%** → `rgba(255,255,255,0.1)`.
- Bordas de destaque em cards: violeta `#9956F6` (cheia) ou transparente até hover.
- Texto secundário sempre em `#C4C4CC`, nunca branco puro, para hierarquia.

---

# 2. Tipografia

A fonte principal é **Plus Jakarta Sans**, complementada por **Inter** (UI), **Martian Mono** (mono/labels) e **Afacad** (decorativa pontual).

```css
font-family: "Plus Jakarta Sans", sans-serif;
```

Pesos carregados: **400 (regular)**, **500 (medium)** e **700 (bold)**.

## Escala tipográfica

| Elemento | Font-size | Peso | Line-height | Letter-spacing |
|----------|-----------|------|-------------|----------------|
| **H1** (hero) | `48px` (3rem) | `500` | `57.6px` (1.2) | `normal` |
| **H2** (seções) | `36px` (2.25rem) | `500` | `40px` (~1.11) | `normal` |
| **H3** (títulos de card) | `20px` (1.25rem) | `500` | `28px` (1.4) | `normal` |
| **Body / parágrafo** | `16px` (1rem) | `400` | `24px` (1.5) | `normal` |
| **Botões** | `14px` | `700` | — | `normal` |
| **Badge / label** | `12px` | `400–500` | — | `1.2px` (uppercase) |

Observações de tipografia: os títulos usam peso **medium (500)**, não bold, o que dá um ar moderno e leve. Apenas botões e labels usam peso 700. Os badges aplicam `text-transform: uppercase` com `letter-spacing: 1.2px` para separação das letras.

---

# 3. Layout

A página é estruturada em **seções verticais empilhadas** (full-width), cada uma com um container central de largura máxima fixa e conteúdo centralizado.

- **Largura máxima do container:** `1256px` (valor predominante; variações de `1216px` em algumas seções). O container é centralizado com `margin-inline: auto` e padding lateral.
- **Sistema de layout:** combinação de **Flexbox** (hero, navbar, alinhamentos verticais centralizados) e **CSS Grid / carrosséis horizontais** para as listas de formações e cursos (cards de ~`394px` de largura em scroll horizontal).
- **Padding/margens padrão:** padding lateral do container em torno de `16–24px` no mobile; seções com espaçamento vertical generoso (`py` grande) entre blocos.
- **Alinhamento:** o conteúdo do hero é totalmente **centralizado** (texto, subtítulo e CTA no eixo central). Títulos de seções intermediárias ficam **alinhados à esquerda** com link de ação à direita.

## Breakpoints responsivos
Detectados nos stylesheets — seguem essencialmente o padrão Tailwind, com breakpoints customizados adicionais:

```css
/* customizados detectados */
@media (min-width: 425px) { /* ... */ }
@media (min-width: 475px) { /* ... */ }
@media (min-width: 768px) { /* tablet */ }

/* equivalência Tailwind padrão */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

# 4. Componentes

## Navbar
Barra fixa no topo, fundo elevado sobre o conteúdo.

- **Altura:** `77px`
- **Background:** `#121214` (surface, ligeiramente mais claro que o body)
- **Position:** `sticky` (top: 0) — permanece fixa no scroll, sem mudança de cor ou blur (sem `backdrop-filter`)
- **Conteúdo:** logo (esquerda) + ícone de menu hambúrguer, ícone de conta (direita) e botão "ASSINAR AGORA"
- **Espaçamento entre itens:** alinhamento via flex com `justify-between`; itens da direita agrupados com gap horizontal

```html
<header class="sticky top-0 h-[77px] bg-[#121214] flex items-center
               justify-between px-4 md:px-8 z-50">
  <!-- logo + menu -->
  <!-- conta + CTA -->
</header>
```

## Hero Section
Bloco central com fundo escuro e glow roxo, ícones neon flutuantes nas laterais.

- **Layout:** flex column, conteúdo 100% centralizado (horizontal e vertical)
- **Estrutura:** badge → H1 → subtítulo → CTA
- **Badge:** "SUA JORNADA EM TECH E IA COMEÇA AQUI" — fundo `rgba(255,255,255,0.1)`, texto `#C4C4CC`, `border-radius: 5px`, `padding: 8px 16px`, `font-size: 12px`, `uppercase`, `letter-spacing: 1.2px`
- **Título (H1):** `48px`, peso `500`, line-height `57.6px`, branco, com palavras-chave em gradiente
- **Subtítulo:** texto `#C4C4CC`, ~`18–20px`, centralizado
- **CTA principal:** botão branco "MATRICULE-SE NA OFERTA DE ANIVERSÁRIO"
- **Espaçamento:** gaps verticais consistentes entre badge, título, subtítulo e botão (~24–32px)

## Seções intermediárias (Cards / Grids / Features)

### Cards de Formação (carrossel horizontal)
- **Largura:** ~`394px` cada
- **Background:** `#121214`
- **Border-radius:** `10px`
- **Borda de destaque:** `1px solid #9956F6` (roxo) em cards em destaque
- **Padding:** `12px 16px 16px`
- **Conteúdo:** imagem/ícone no topo, badge de status (`LANÇAMENTO` / `NOVA`), indicador de nível (`INTERMEDIÁRIO`), título H3 (`20px/500`) e avatar + nome do instrutor
- **Navegação:** setas circulares (prev/next) abaixo do carrossel

```html
<article class="w-[394px] bg-[#121214] rounded-[10px] border border-[#9956F6]
                p-3 pb-4 flex flex-col gap-3">
  <span class="text-xs uppercase tracking-wide text-[#C4C4CC]">LANÇAMENTO</span>
  <h3 class="text-xl font-medium text-white">Ruby</h3>
  <!-- avatar + nome -->
</article>
```

### Grid de cursos
Seção "Além das formações, ganhe acesso a diversos cursos" — título à esquerda + link "Ver todos os cursos" à direita, seguido de grid/carrossel de cards de curso com ícone, título e descrição.

## Botões

| Tipo | Background | Texto | Borda | Radius | Padding | Peso |
|------|-----------|-------|-------|--------|---------|------|
| **Ghost / Outline** (ASSINAR AGORA) | transparente | `#FFFFFF` | `1px solid #8234E9` | `10px` | `14px 16px` | `700` |
| **Primário branco** (CTA hero) | `#FFFFFF` | `#000000` | nenhuma | `10px` | `18px 24px` | `700` |
| **Roxo sólido** (CTAs de oferta) | `#8234E9` | `#FFFFFF` | nenhuma | `10px` | `~16px 24px` | `700` |

- **Hover:** clarear/escurecer levemente o fundo; nos outline, preencher com a cor da borda.
- **Border-radius padrão:** `10px`.
- **Fonte dos botões:** `14px`, peso `700`, geralmente em caixa alta.

```html
<!-- Ghost -->
<a class="border border-[#8234E9] rounded-[10px] px-4 py-3.5
          text-sm font-bold text-white hover:bg-[#8234E9]/10">
  ASSINAR AGORA
</a>

<!-- Primário branco -->
<button class="bg-white text-black rounded-[10px] px-6 py-[18px]
               text-sm font-bold hover:bg-zinc-200">
  MATRICULE-SE NA OFERTA DE ANIVERSÁRIO
</button>
```

## Inputs e formulários
O campo de busca observado (mockup do produto) segue o padrão dark:

- **Background:** superfície escura translúcida (`rgba(255,255,255,0.05–0.1)`) sobre `#121214`
- **Texto:** `#C4C4CC`; placeholder em tom mais apagado
- **Borda:** sutil ou inexistente em repouso; `border-radius` ~`8–10px`
- **Focus state:** borda/ring na cor primária `#8234E9`

```html
<input
  class="w-full bg-white/5 text-[#C4C4CC] placeholder:text-zinc-500
         rounded-[10px] px-4 py-3 border border-transparent
         focus:border-[#8234E9] focus:outline-none focus:ring-1
         focus:ring-[#8234E9]" />
```

---

# 5. CSS / Tailwind equivalente

Exemplo de configuração e classes que reproduzem o design.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "#09090A",
        surface: "#121214",
        primary: "#8234E9",
        "primary-light": "#9956F6",
        "text-primary": "#FFFFFF",
        "text-secondary": "#C4C4CC",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"Martian Mono"', "monospace"],
      },
      maxWidth: { container: "1256px" },
      borderRadius: { card: "10px" },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(97.57deg,#29E0A9 -12.7%,#5F75F2 32.64%,#9956F6 78.49%,#E254FF 109.78%)",
      },
    },
  },
};
```

```jsx
// Título hero com texto em gradiente
<h1 className="text-5xl font-medium leading-[1.2] text-white text-center
               max-w-container mx-auto">
  Uma escola de{" "}
  <span className="bg-brand-gradient bg-clip-text text-transparent">
    tecnologia e inteligência artificial
  </span>{" "}
  para todos os profissionais
</h1>
```

```css
/* CSS puro equivalente para o texto em gradiente */
.gradient-text {
  background-image: linear-gradient(
    97.57deg, #29E0A9 -12.7%, #5F75F2 32.64%, #9956F6 78.49%, #E254FF 109.78%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

# 6. Tokens de Design

```css
:root {
  /* Cores principais */
  --primary: #8234E9;          /* violeta — bordas, foco, CTAs */
  --primary-light: #9956F6;    /* roxo — destaques de card */
  --secondary: #5F75F2;        /* azul do gradiente */
  --accent-green: #29E0A9;
  --accent-magenta: #E254FF;

  --background: #09090A;        /* fundo base */
  --surface: #121214;          /* navbar, cards */
  --text: #FFFFFF;             /* texto principal */
  --text-secondary: #C4C4CC;   /* texto secundário */
  --overlay-white: rgba(255, 255, 255, 0.1);

  /* Gradiente da marca */
  --brand-gradient: linear-gradient(
    97.57deg, #29E0A9 -12.7%, #5F75F2 32.64%,
    #9956F6 78.49%, #E254FF 109.78%
  );

  /* Tipografia */
  --font-sans: "Plus Jakarta Sans", sans-serif;
  --font-mono: "Martian Mono", monospace;
  --fs-h1: 48px;   --lh-h1: 57.6px;
  --fs-h2: 36px;   --lh-h2: 40px;
  --fs-h3: 20px;   --lh-h3: 28px;
  --fs-body: 16px; --lh-body: 24px;
  --fw-regular: 400; --fw-medium: 500; --fw-bold: 700;
  --ls-label: 1.2px;

  /* Layout */
  --container-max: 1256px;
  --navbar-height: 77px;
  --radius: 10px;
  --radius-badge: 5px;

  /* Breakpoints */
  --bp-sm: 640px;  --bp-md: 768px;
  --bp-lg: 1024px; --bp-xl: 1280px;
}
```