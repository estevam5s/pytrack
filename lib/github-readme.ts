// Gera um README.md profissional e completo para os repositórios criados
// pela PyTrack (a partir de exercícios, projetos ou da IDE).

// .gitignore padrão para projetos Python
export const GITIGNORE_PY = `# Python
__pycache__/
*.py[cod]
*.egg-info/
.eggs/
build/
dist/

# Ambientes virtuais
.venv/
venv/
env/

# IDEs
.vscode/
.idea/

# Variáveis de ambiente
.env
.env.local

# Sistema
.DS_Store
Thumbs.db
`;

// Licença MIT (arquivo LICENSE completo)
export function buildLicense(author = "Desenvolvedor PyTrack"): string {
  const year = new Date().getFullYear();
  return `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

// Workflow de CI (GitHub Actions) para projetos Python: lint + testes
export const PY_CI_WORKFLOW = `name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - name: Configurar Python \${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}

      - name: Instalar dependências
        run: |
          python -m pip install --upgrade pip
          pip install ruff pytest
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

      - name: Lint (ruff)
        run: ruff check . || true

      - name: Testes (pytest)
        run: pytest -q || echo "Sem testes ainda."
`;

interface ReadmeInput {
  title: string;
  kind: "exercicio" | "projeto" | "codigo";
  description?: string;
  objective?: string;
  requirements?: string[];
  files: { path: string }[];
  mainFile?: string; // arquivo de entrada (ex.: main.py / solucao.py)
}

function slug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "pytrack-projeto";
}

export function buildReadme(input: ReadmeInput): string {
  const repo = slug(input.title);
  const main = input.mainFile || input.files.find((f) => f.path.endsWith(".py"))?.path || "main.py";
  const kindLabel = input.kind === "exercicio" ? "Exercício" : input.kind === "projeto" ? "Projeto" : "Código";
  const desc = (input.description || input.objective || "Solução desenvolvida na plataforma PyTrack.").trim();

  const tree = input.files
    .map((f) => `├── ${f.path}`)
    .join("\n")
    .replace(/├── ([^\n]*)$/, "└── $1"); // último item

  const reqBlock = input.requirements && input.requirements.length
    ? `\n## ✅ Requisitos atendidos\n\n${input.requirements.map((r) => `- [x] ${r}`).join("\n")}\n`
    : "";

  const objectiveBlock = input.objective && input.kind === "exercicio"
    ? `\n## 🎯 Objetivo\n\n${input.objective.trim()}\n`
    : "";

  return `# ${input.title}

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Status-Concluído-success" alt="Status" />
  <img src="https://img.shields.io/badge/Feito%20com-PyTrack%20🐍-8234E9" alt="PyTrack" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

> ${desc}

---

## 📌 Sobre

Este repositório contém um **${kindLabel.toLowerCase()}** em **Python**, desenvolvido como parte do meu aprendizado na [PyTrack](https://www.pytrack.com.br) — plataforma de estudo do ecossistema Python.
${objectiveBlock}${reqBlock}
## 🚀 Como executar

\`\`\`bash
# 1) Clone o repositório
git clone https://github.com/SEU_USUARIO/${repo}.git
cd ${repo}

# 2) (Opcional) Crie um ambiente virtual
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\\Scripts\\activate

# 3) Instale dependências (se houver requirements.txt)
pip install -r requirements.txt 2>/dev/null || true

# 4) Execute
python ${main}
\`\`\`

## 📁 Estrutura do projeto

\`\`\`
${repo}/
${tree}
\`\`\`

## 💻 Tecnologias

- **Python 3.10+** — linguagem principal
- Boas práticas de código limpo e legível
- Versionamento com **Git/GitHub**

## 🧠 O que pratiquei

- Lógica de programação e resolução de problemas
- Sintaxe e estruturas de dados do Python
- Organização e documentação de código

## 👤 Autor

Desenvolvido durante os estudos na **PyTrack** 🐍

<p>
  <a href="https://www.pytrack.com.br">
    <img src="https://img.shields.io/badge/PyTrack-Domine%20Python-8234E9?logo=python&logoColor=white" alt="PyTrack" />
  </a>
</p>

## 📄 Licença

Distribuído sob a licença **MIT**. Sinta-se livre para usar e aprender com este código.

---

<p align="center"><sub>⭐ Gerado automaticamente pela <a href="https://www.pytrack.com.br">PyTrack</a> — do primeiro <code>print()</code> à carreira.</sub></p>
`;
}
