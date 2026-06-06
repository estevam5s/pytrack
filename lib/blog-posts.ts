export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  emoji: string;
  tags: string[];
  content: string; // markdown
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-aprender-python-do-zero",
    title: "Como aprender Python do zero em 2026 (guia completo)",
    description:
      "Um roteiro prático para sair do zero ao primeiro emprego com Python: fundamentos, prática, projetos e carreira.",
    date: "2026-06-01",
    readingTime: "8 min",
    emoji: "🐍",
    tags: ["python", "iniciante", "carreira"],
    content: `## Por que aprender Python?

Python é uma das linguagens mais procuradas do mercado: é usada em **desenvolvimento web (backend)**, **análise e engenharia de dados**, **automação**, **IoT**, **machine learning** e muito mais. A sintaxe simples faz dela ideal para quem está começando — e a demanda por profissionais é enorme.

## O caminho do zero ao profissional

### 1. Fundamentos sólidos
Comece pelo básico, sem pular etapas:

- Variáveis, tipos e operadores
- Estruturas de controle (\`if\`, \`for\`, \`while\`)
- Estruturas de dados: listas, dicionários, tuplas e sets
- Funções e escopo
- Programação Orientada a Objetos (POO)

\`\`\`python
def saudacao(nome: str) -> str:
    return f"Olá, {nome}! Bem-vindo ao Python."

print(saudacao("dev"))
\`\`\`

### 2. Pratique todos os dias
Teoria sem prática não fixa. Resolva exercícios curtos diariamente e use uma IDE para experimentar — na PyTrack você roda Python direto no navegador, sem instalar nada.

### 3. Construa projetos reais
Projetos são o que comprovam suas habilidades para recrutadores. Comece simples (uma CLI, um web scraper) e evolua para APIs e dashboards.

### 4. Escolha uma especialização
Depois dos fundamentos, foque em uma área: **Backend**, **Dados**, **IoT** ou **Engenharia de Software**. Cada uma tem seu próprio stack e mercado.

### 5. Prepare a carreira
Monte um portfólio, estude perguntas de entrevista e candidate-se a vagas. Consistência vence talento.

## Quanto tempo leva?

Com estudo consistente (1h/dia), é realista chegar a um nível júnior empregável em **6 a 9 meses**. O segredo é ter direção — e não estudar de forma dispersa.

> Pronto para começar com um caminho guiado? A **PyTrack** reúne trilhas, exercícios com IA, IDE, projetos e comunidade em um só lugar.`,
  },
  {
    slug: "python-para-analise-de-dados",
    title: "Python para Análise de Dados: por onde começar",
    description:
      "Pandas, NumPy, visualização e estatística: o roteiro para se tornar Analista de Dados com Python.",
    date: "2026-06-02",
    readingTime: "7 min",
    emoji: "📊",
    tags: ["dados", "pandas", "carreira"],
    content: `## O que faz um Analista de Dados?

O analista transforma dados brutos em **decisões de negócio**: coleta, limpa, analisa e comunica resultados. Python é a ferramenta número 1 para isso.

## O stack essencial

- **Pandas** — manipulação de dados (o feijão com arroz)
- **NumPy** — computação numérica
- **Matplotlib / Seaborn / Plotly** — visualização
- **SQL** — porque os dados quase sempre estão em bancos

\`\`\`python
import pandas as pd

df = pd.read_csv("vendas.csv")
print(df.groupby("regiao")["valor"].sum().sort_values(ascending=False))
\`\`\`

## Roteiro de estudo

1. **Pandas a fundo**: leitura, limpeza, joins, agrupamentos
2. **Estatística aplicada**: média, mediana, distribuições, correlação
3. **Visualização**: conte histórias com gráficos
4. **Comunicação**: dashboards e relatórios que geram ação

## Próximo passo

Depois de dominar análise, o caminho natural é **Engenharia de Dados** (pipelines, Spark, Airflow) ou **Machine Learning**.

> Na PyTrack você tem a trilha completa de Dados com exercícios e projetos reais.`,
  },
  {
    slug: "backend-com-python-fastapi-django",
    title: "Backend com Python: FastAPI, Django e carreira",
    description:
      "Como construir APIs modernas com Python e o que estudar para virar desenvolvedor backend.",
    date: "2026-06-03",
    readingTime: "6 min",
    emoji: "⚙️",
    tags: ["backend", "fastapi", "django"],
    content: `## FastAPI ou Django?

- **FastAPI**: moderno, rápido, ótimo para APIs e microsserviços. Tipagem e documentação automática.
- **Django**: completo ("batteries included"), ótimo para apps full-stack e admin pronto.

Os dois são excelentes — a escolha depende do problema.

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/saudacao/{nome}")
def saudacao(nome: str):
    return {"mensagem": f"Olá, {nome}!"}
\`\`\`

## O que um backend dev precisa saber

- HTTP, REST e status codes
- Banco de dados (PostgreSQL) e SQL
- ORM (SQLAlchemy / Django ORM)
- Autenticação e segurança
- Testes (pytest)
- Docker e deploy

## Carreira

Backend é uma das áreas mais demandadas e bem pagas. Construa **APIs reais** com banco, auth e deploy para o portfólio.

> A trilha de Backend da PyTrack cobre do básico ao deploy, com projetos práticos.`,
  },
  {
    slug: "10-projetos-python-portfolio",
    title: "10 projetos Python para o seu portfólio",
    description:
      "Ideias de projetos práticos — do básico ao avançado — para comprovar suas habilidades com Python.",
    date: "2026-06-04",
    readingTime: "5 min",
    emoji: "🚀",
    tags: ["projetos", "portfólio", "python"],
    content: `## Por que projetos importam

Recrutadores confiam mais no que você **construiu** do que em certificados. Um bom portfólio mostra que você resolve problemas reais.

## 10 ideias (do básico ao avançado)

1. **Calculadora / conversor** via CLI
2. **To-do list** com persistência em arquivo
3. **Web scraper** de notícias ou preços
4. **API REST** de tarefas com FastAPI + banco
5. **Bot do Telegram** de lembretes
6. **Análise de dados** de um dataset real (Pandas + gráficos)
7. **Dashboard** interativo com Streamlit
8. **Pipeline ETL** simples (extrair → transformar → carregar)
9. **Sistema de autenticação** seguro (JWT)
10. **App full-stack** com deploy na nuvem

## Dica de ouro

Não faça 10 projetos pela metade — faça **3 muito bem feitos**, com README, testes e deploy. Qualidade > quantidade.

> A PyTrack tem mais de 1.300 projetos com requisitos e passo a passo para você praticar.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
