# Visualização: Matplotlib, Seaborn, Plotly, Bokeh e Dashboards

Visualização transforma dados em compreensão. Este arquivo cobre gráficos estáticos, estatísticos e interativos com Matplotlib, Seaborn, Plotly e Bokeh, além de princípios para dashboards profissionais. O complemento com Altair, Dash e comparação de ferramentas está em `09_ecossistema_analytics_bibliotecas.md`.

---

## Sumário

1. [Princípios de Visualização](#princípios-de-visualização)
2. [Matplotlib](#matplotlib)
3. [Seaborn](#seaborn)
4. [Plotly](#plotly)
5. [Bokeh](#bokeh)
6. [Dashboards](#dashboards)
7. [Altair e Dash](#altair-e-dash)
8. [Storytelling com Dados](#storytelling-com-dados)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Princípios de Visualização

Escolha gráfico pela pergunta:

- comparação: barras;
- tendência: linha;
- distribuição: histograma/boxplot;
- relação: dispersão;
- composição: barras empilhadas com cuidado;
- ranking: barras ordenadas;
- geografia: mapas quando localização importa.

Evite:

- 3D desnecessário;
- pizza com muitas categorias;
- eixo truncado sem aviso;
- paleta confusa;
- gráfico sem título claro;
- excesso de elementos decorativos.

---

## Matplotlib

Base do ecossistema de visualização.

```python
import matplotlib.pyplot as plt

categorias = ["A", "B", "C"]
valores = [100, 150, 80]

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(categorias, valores)
ax.set_title("Receita por categoria")
ax.set_xlabel("Categoria")
ax.set_ylabel("Receita")
plt.tight_layout()
plt.show()
```

Linha temporal:

```python
fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(df["data"], df["receita"], marker="o")
ax.set_title("Receita ao longo do tempo")
ax.grid(True, alpha=0.3)
plt.tight_layout()
```

Customização:

```python
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
```

---

## Seaborn

Seaborn é excelente para visualização estatística.

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")

sns.barplot(data=df, x="categoria", y="valor", estimator="sum")
plt.title("Receita por categoria")
plt.show()
```

Distribuição:

```python
sns.histplot(data=df, x="valor", kde=True)
```

Boxplot:

```python
sns.boxplot(data=df, x="categoria", y="valor")
```

Scatter:

```python
sns.scatterplot(data=df, x="desconto", y="valor", hue="categoria")
```

Heatmap:

```python
corr = df[["valor", "quantidade", "desconto"]].corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
```

---

## Plotly

Plotly cria gráficos interativos.

```python
import plotly.express as px

fig = px.bar(
    df,
    x="categoria",
    y="valor",
    color="categoria",
    title="Receita por categoria",
)
fig.show()
```

Linha:

```python
fig = px.line(df, x="data", y="receita", title="Receita diária")
fig.show()
```

Scatter:

```python
fig = px.scatter(
    df,
    x="desconto",
    y="valor",
    color="categoria",
    hover_data=["produto"],
)
fig.show()
```

Plotly é útil para exploração e dashboards interativos.

---

## Bokeh

Bokeh é focado em visualizações interativas para web.

```python
from bokeh.plotting import figure, show

p = figure(
    title="Receita por categoria",
    x_range=["A", "B", "C"],
    height=350,
)
p.vbar(x=["A", "B", "C"], top=[100, 150, 80], width=0.6)

show(p)
```

Com hover:

```python
from bokeh.models import ColumnDataSource, HoverTool

source = ColumnDataSource(
    data={"categoria": ["A", "B"], "valor": [100, 200]}
)

p = figure(x_range=["A", "B"], height=350)
p.vbar(x="categoria", top="valor", source=source, width=0.6)
p.add_tools(HoverTool(tooltips=[("Categoria", "@categoria"), ("Valor", "@valor")]))
show(p)
```

---

## Dashboards

Dashboard profissional deve responder perguntas recorrentes.

Componentes:

- filtros;
- KPIs;
- tendência temporal;
- segmentação;
- tabela detalhada;
- alerta de qualidade;
- última atualização.

Exemplo com Streamlit:

```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Dashboard de Vendas", layout="wide")

df = pd.read_parquet("data/gold/vendas.parquet")

categoria = st.sidebar.multiselect(
    "Categoria",
    sorted(df["categoria"].unique()),
    default=sorted(df["categoria"].unique()),
)

filtrado = df[df["categoria"].isin(categoria)]

receita = filtrado["valor"].sum()
pedidos = len(filtrado)
ticket = filtrado["valor"].mean()

col1, col2, col3 = st.columns(3)
col1.metric("Receita", f"R$ {receita:,.2f}")
col2.metric("Pedidos", pedidos)
col3.metric("Ticket médio", f"R$ {ticket:,.2f}")

fig = px.line(
    filtrado.groupby("data", as_index=False)["valor"].sum(),
    x="data",
    y="valor",
    title="Receita diária",
)
st.plotly_chart(fig, use_container_width=True)
```

---

## Altair e Dash

`Altair` é declarativo e bom para gráficos estatísticos baseados em gramática de visualização. `Dash` cria aplicações analíticas web com componentes interativos e callbacks em Python.

Use:

- Matplotlib para controle fino e publicações estáticas;
- Seaborn para estatística rápida;
- Plotly para interatividade;
- Altair para visualização declarativa;
- Bokeh para interatividade web customizável;
- Dash para apps analíticos;
- Streamlit para dashboards e protótipos rápidos.

Exemplos completos estão em `09_ecossistema_analytics_bibliotecas.md`.

---

## Storytelling com Dados

Estrutura:

1. contexto;
2. pergunta;
3. achado principal;
4. evidência visual;
5. impacto;
6. recomendação;
7. limitações.

Um gráfico deve ter uma mensagem.

Ruim:

```text
Gráfico de vendas
```

Melhor:

```text
Receita de cursos cresceu 32% após campanha de março
```

---

## Boas Práticas

- Comece pela pergunta.
- Use títulos informativos.
- Ordene barras por valor.
- Mostre unidades.
- Evite cores sem significado.
- Use interatividade quando ela ajuda a explorar.
- Não esconda nulos e filtros.
- Dashboard precisa ter dono e rotina de atualização.
- Métricas precisam de definição estável.

---

## Exercícios

1. Crie gráfico de barras com Matplotlib.
2. Crie histograma e boxplot com Seaborn.
3. Crie gráfico interativo com Plotly.
4. Crie gráfico Bokeh com hover.
5. Crie dashboard Streamlit com KPIs.
6. Reescreva títulos genéricos como mensagens analíticas.
7. Crie uma paleta consistente para categorias.
8. Crie um gráfico Altair e um app Dash mínimo.
