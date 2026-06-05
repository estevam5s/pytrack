# Construindo apps em Python puro

Streamlit transforma scripts em apps web interativos.

## Pontos-chave

- Widgets (slider, selectbox, file_uploader)
- Reatividade automática
- Cache com @st.cache_data
- Deploy simples

## Exemplo

```python
import streamlit as st
import pandas as pd

arquivo = st.file_uploader('CSV')
if arquivo:
    df = pd.read_csv(arquivo)
    st.dataframe(df)
    st.bar_chart(df.select_dtypes('number'))
```

## Boas práticas

- Use cache para dados pesados
- Mantenha o app responsivo

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/)
