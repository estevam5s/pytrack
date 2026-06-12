# Apps de dados em minutos

Streamlit transforma scripts Python em web apps interativos sem HTML/JS.

> **Tema:** Visualização · **Nível:** intermediario · **Trilha:** Streamlit e Data Apps

## Conceitos-chave

Nesta lição você vai entender:

- **st.write, st.dataframe e widgets reativos**
- **Reexecução do script a cada interação**
- **st.cache_data para evitar recomputar**
- **Layout com colunas, abas e sidebar**

## Exemplo prático

```python
import streamlit as st
import pandas as pd

st.title('Dashboard')
n = st.slider('Linhas', 5, 100, 20)
df = pd.DataFrame({'x': range(n)})
st.line_chart(df)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use cache para dados e modelos pesados
- Separe lógica de dados da camada visual

## Pratique

Para fixar, escreva um pequeno script que combine **st.write, st.dataframe e widgets reativos** e **reexecução do script a cada interação** em um caso do seu dia a dia. Depois refatore aplicando "Use cache para dados e modelos pesados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: st.write, st.dataframe e widgets reativos
- [ ] Explicar e aplicar: Reexecução do script a cada interação
- [ ] Explicar e aplicar: st.cache_data para evitar recomputar
- [ ] Explicar e aplicar: Layout com colunas, abas e sidebar

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/)
