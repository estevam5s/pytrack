# Apps de dados em minutos

Streamlit transforma scripts Python em web apps interativos sem HTML/JS.

## Pontos-chave

- st.write, st.dataframe e widgets reativos
- Reexecução do script a cada interação
- st.cache_data para evitar recomputar
- Layout com colunas, abas e sidebar

## Exemplo

```python
import streamlit as st
import pandas as pd

st.title('Dashboard')
n = st.slider('Linhas', 5, 100, 20)
df = pd.DataFrame({'x': range(n)})
st.line_chart(df)
```

## Boas práticas

- Use cache para dados e modelos pesados
- Separe lógica de dados da camada visual

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/)
