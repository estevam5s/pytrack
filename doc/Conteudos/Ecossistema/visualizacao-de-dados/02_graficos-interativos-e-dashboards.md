# Gráficos interativos e dashboards

Plotly e Streamlit para interatividade.

> **Tema:** Visualização · **Nível:** intermediario · **Trilha:** Visualização de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **Plotly Express para gráficos interativos**
- **Hover, zoom e filtros**
- **Streamlit para apps de dados**
- **Deploy simples**

## Exemplo prático

```python
import plotly.express as px
fig = px.scatter(df, x='x', y='y', color='grupo')
fig.show()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Não exagere na interatividade
- Otimize para grandes volumes

## Pratique

Para fixar, escreva um pequeno script que combine **plotly express para gráficos interativos** e **hover, zoom e filtros** em um caso do seu dia a dia. Depois refatore aplicando "Não exagere na interatividade".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Plotly Express para gráficos interativos
- [ ] Explicar e aplicar: Hover, zoom e filtros
- [ ] Explicar e aplicar: Streamlit para apps de dados
- [ ] Explicar e aplicar: Deploy simples

## Saiba mais

- [Documentação oficial](https://plotly.com/python/)
