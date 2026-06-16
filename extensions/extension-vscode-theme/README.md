<div align="center">

# 🎨 PyTrack Themes

### 5 temas premium para o VS Code, desenhados para quem programa em **Python**

[![Version](https://img.shields.io/visual-studio-marketplace/v/EstevamSouza.pytrack-themes?color=8257E5&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack-themes)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/EstevamSouza.pytrack-themes?color=04D361)](https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack-themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-9956F6.svg)](./LICENSE)

**Grátis** · feito pela [PyTrack](https://www.pytrack.com.br) — a plataforma de aprendizado de Python.

</div>

---

## ✨ Os 5 temas

A paleta da PyTrack (roxo `#8257E5`, verde `#04D361` e o gradiente neon da marca) levada para o editor, com **realce de sintaxe afinado para Python**: f-strings, decorators, `self`/`cls`, type hints, docstrings e chamadas de função têm tratamento próprio.

| Tema | Tipo | Personalidade |
|------|------|---------------|
| **PyTrack Dark** | escuro | O tema principal da marca. Roxo elegante sobre cinza-grafite. Equilibrado para o dia a dia. |
| **PyTrack Midnight** | escuro | Preto profundo (ótimo para telas OLED), com acentos azul-índigo. Foco e baixo brilho. |
| **PyTrack Neon** | escuro | Vibrante: magenta e verde-água saltando sobre um fundo violeta-escuro. Energia máxima. |
| **PyTrack Forest** | escuro | Verde e teal sobre um preto esverdeado. Calmo, natural, fácil para os olhos. |
| **PyTrack Light** | claro | Versão clara, limpa e de alto contraste. Roxo sobre branco para ambientes iluminados. |

Todos incluem:

- 🎯 **Syntax highlighting para Python** — keywords, strings, números, classes, funções, decorators, `self`, type hints e f-strings com cores distintas e semânticas.
- 🌈 **Bracket Pair Colorization** usando o gradiente da marca (roxo → verde → azul → magenta).
- 🧩 **Workbench completo** — activity bar, sidebar, tabs, status bar, terminal (cores ANSI), painéis, widgets de sugestão, git decorations e mais (115+ tokens de UI por tema).
- ♿ **Contraste cuidado** — pensado para legibilidade em sessões longas.
- 🔣 **Semantic highlighting** habilitado (usa as informações do Pylance/Python para colorir com precisão).

---

## 🚀 Como instalar

### Pela loja do VS Code
1. Abra o VS Code → **Extensions** (`Ctrl+Shift+X` / `⌘⇧X`).
2. Busque por **PyTrack Themes**.
3. Clique em **Install**.

Ou pela linha de comando:

```bash
code --install-extension EstevamSouza.pytrack-themes
```

### Pelo arquivo `.vsix`
```bash
code --install-extension pytrack-themes-1.0.0.vsix
```

---

## 🎨 Como ativar um tema

1. Abra a paleta de comandos: **`Ctrl+K Ctrl+T`** (`⌘K ⌘T` no macOS).
   > _Preferences: Color Theme_
2. Escolha um dos temas **PyTrack** na lista.
3. Pronto! A troca é instantânea.

Você também pode ir em **Settings → Workbench → Appearance → Color Theme**, ou definir direto no `settings.json`:

```jsonc
{
  "workbench.colorTheme": "PyTrack Dark"
}
```

### 💡 Dica: tema claro/escuro automático

O VS Code troca de tema conforme o sistema (claro de dia, escuro de noite). Combine o **PyTrack Light** com qualquer um dos escuros:

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "PyTrack Midnight",
  "workbench.preferredLightColorTheme": "PyTrack Light"
}
```

### 💡 Dica: aproveite ao máximo o highlight de Python

```jsonc
{
  "editor.bracketPairColorization.enabled": true,
  "editor.semanticHighlighting.enabled": true,
  "python.analysis.typeCheckingMode": "basic"
}
```

---

## 🛠️ Para desenvolvedores (build)

Os temas são **gerados** a partir de paletas compactas — assim os 5 ficam coerentes e fáceis de manter.

```bash
npm run gen        # gera os JSONs em themes/ a partir de scripts/gen-themes.mjs
npm run package    # gera + empacota o .vsix
npm run publish    # gera + publica no Marketplace (requer VSCE_PAT)
```

Quer um tema customizado? Edite a paleta em [`scripts/gen-themes.mjs`](./scripts/gen-themes.mjs) e rode `npm run gen`. Cada paleta define cerca de 20 cores (fundos em camadas, acento, e as cores de sintaxe) e o gerador expande para o tema completo.

---

## ❓ FAQ

**É de graça mesmo?**
Sim. Os temas são **100% gratuitos**, sem login e sem conta. Fazem parte do ecossistema PyTrack.

**Funciona com outras linguagens?**
Sim — o realce funciona para qualquer linguagem. Mas as cores foram **afinadas para Python** (f-strings, decorators, `self`, type hints).

**Preciso do Pylance?**
Não é obrigatório, mas com o **Pylance/Python** instalado o _semantic highlighting_ deixa as cores ainda mais precisas.

**Como volto ao tema padrão?**
`Ctrl+K Ctrl+T` e escolha _Dark+_ ou qualquer outro.

---

## 🔗 Ecossistema PyTrack

- 🌐 **Plataforma:** [www.pytrack.com.br](https://www.pytrack.com.br) — trilhas, +5.000 exercícios, IDE no navegador, IA.
- 🧩 **Extensão PyTrack** (Suprema): leve projetos, aulas, exercícios e IA para dentro do editor.
- ⚡ **PyTrack Autocomplete** (Completo): autocomplete profissional de Python + 20+ scaffolds de projeto.

---

<div align="center">

Feito com 🐍 e 💜 pela **PyTrack**

[Plataforma](https://www.pytrack.com.br) · [Suporte](https://www.pytrack.com.br/contato) · [Todas as extensões](https://www.pytrack.com.br/extensao)

</div>
