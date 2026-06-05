# Dashboards, Storytelling, Projetos e Roadmap de Especialista

Este arquivo organiza a evolução final: dashboards profissionais, storytelling, portfólio, projetos progressivos e roadmap completo para se tornar especialista em ciência, análise e engenharia de dados com Python.

---

## Sumário

1. [Dashboards Profissionais](#dashboards-profissionais)
2. [Métricas e Definições](#métricas-e-definições)
3. [Storytelling Analítico](#storytelling-analítico)
4. [Projetos Progressivos](#projetos-progressivos)
5. [Projeto Final Integrado](#projeto-final-integrado)
6. [Roadmap de Especialista](#roadmap-de-especialista)
7. [Checklist de Domínio](#checklist-de-domínio)
8. [Boas Práticas](#boas-práticas)

---

## Dashboards Profissionais

Um dashboard deve apoiar decisão recorrente.

Perguntas antes de criar:

- quem usa?
- com que frequência?
- qual decisão será tomada?
- qual métrica é principal?
- quais filtros são necessários?
- qual granularidade?
- qual SLA de atualização?

Estrutura comum:

```text
topo: KPIs principais
meio: tendências e segmentações
baixo: tabela detalhada e alertas
sidebar: filtros
rodapé: fonte, atualização e definições
```

Exemplo de KPIs:

```python
def calcular_kpis(df):
    return {
        "receita": df["valor"].sum(),
        "pedidos": len(df),
        "clientes": df["cliente_id"].nunique(),
        "ticket_medio": df["valor"].mean(),
    }
```

---

## Métricas e Definições

Métrica sem definição vira conflito.

Exemplo:

```text
Receita líquida = soma do valor pago, excluindo cancelamentos e reembolsos.
Pedido ativo = pedido com status pago ou enviado.
Cliente ativo = cliente com pelo menos uma compra nos últimos 90 dias.
```

Crie dicionário de métricas:

| Métrica | Definição | Granularidade | Atualização |
|---|---|---|---|
| Receita | soma de vendas válidas | dia/categoria | diária |
| Ticket médio | receita / pedidos | dia/categoria | diária |
| Churn | clientes perdidos / base | mês | mensal |

---

## Storytelling Analítico

Uma análise forte separa:

- fato;
- interpretação;
- recomendação;
- limitação.

Template:

```text
Pergunta:
Achado principal:
Evidência:
Impacto:
Recomendação:
Risco/limitação:
Próximo passo:
```

Exemplo:

```text
Pergunta: qual categoria impulsionou a receita?
Achado: cursos cresceram 32% no mês.
Evidência: receita mensal por categoria.
Impacto: cursos explicam 68% do crescimento total.
Recomendação: ampliar campanha de cursos avançados.
Limitação: dados de reembolso ainda não entraram.
```

---

## Projetos Progressivos

### Projeto 1: Relatório CSV

Objetivo:

- ler CSV;
- limpar tipos;
- agrupar por categoria;
- exportar relatório.

Bibliotecas:

- Pandas;
- Matplotlib.

### Projeto 2: EDA Completa

Objetivo:

- análise de nulos;
- duplicatas;
- outliers;
- estatística descritiva;
- visualizações;
- hipóteses.

Bibliotecas:

- Pandas;
- Seaborn;
- SciPy.

### Projeto 3: Dashboard de Vendas

Objetivo:

- KPIs;
- filtros;
- gráficos interativos;
- tabela detalhada;
- atualização por Parquet.

Bibliotecas:

- Streamlit;
- Plotly;
- Pandas.

### Projeto 4: Pipeline ETL

Objetivo:

- extrair de API;
- salvar raw;
- transformar silver;
- validar;
- publicar gold.

Bibliotecas:

- requests;
- Pandas/Polars;
- Pandera;
- PyArrow.

### Projeto 5: Engenharia de Dados Local

Objetivo:

- DuckDB;
- Parquet particionado;
- modelo estrela;
- logs;
- testes.

### Projeto 6: Performance com Polars

Objetivo:

- processar múltiplos Parquets;
- lazy execution;
- filtros;
- agregações;
- benchmark.

### Projeto 7: Pipeline Orquestrado

Objetivo:

- Airflow/Prefect/Dagster;
- tarefas;
- dependências;
- idempotência;
- monitoramento.

---

## Projeto Final Integrado

Construa um sistema completo:

```text
API/CSV/DB
  ↓
raw
  ↓
bronze
  ↓
silver validado
  ↓
gold analítico
  ↓
dashboard
  ↓
relatório executivo
  ↓
monitoramento
```

Requisitos:

- README;
- ambiente reproduzível;
- dados de exemplo;
- pipeline idempotente;
- validação de qualidade;
- análise exploratória;
- dashboard;
- testes;
- logs;
- documentação de métricas;
- decisões técnicas.

---

## Roadmap de Especialista

### Nível 1: Base

- Python para dados.
- NumPy.
- Pandas.
- CSV, Excel, JSON.
- Visualizações básicas.

### Nível 2: Análise

- limpeza;
- data wrangling;
- EDA;
- estatística descritiva;
- correlação;
- outliers;
- storytelling.

### Nível 3: Visualização e BI

- Matplotlib;
- Seaborn;
- Plotly;
- Bokeh;
- dashboards;
- métricas;
- design analítico.

### Nível 4: Engenharia

- ETL/ELT;
- Parquet;
- DuckDB;
- SQL;
- validação;
- testes;
- pipelines;
- idempotência.

### Nível 5: Escala

- Polars;
- Dask;
- Spark;
- particionamento;
- orquestração;
- data warehouse;
- lakehouse.

### Nível 6: Produção

- observabilidade;
- governança;
- segurança;
- MLOps;
- custos;
- SLAs;
- contratos de dados.

---

## Checklist de Domínio

- Sei limpar dados sujos.
- Sei explicar cada transformação.
- Sei usar Pandas e Polars.
- Sei aplicar NumPy e SciPy.
- Sei fazer EDA com estatística.
- Sei criar gráficos claros.
- Sei construir dashboards.
- Sei criar pipelines ETL.
- Sei validar qualidade.
- Sei trabalhar com Parquet e SQL.
- Sei monitorar pipelines.
- Sei comunicar achados.
- Sei documentar métricas.
- Sei montar projeto completo de portfólio.

---

## Boas Práticas

- Trabalhe da pergunta para o dado.
- Não confie em dado sem validação.
- Documente decisões.
- Automatize o que é recorrente.
- Meça performance antes de trocar ferramenta.
- Use a biblioteca mais simples que resolve bem.
- Comunique incerteza.
- Separe análise exploratória de produção.
- Mantenha métricas consistentes.

