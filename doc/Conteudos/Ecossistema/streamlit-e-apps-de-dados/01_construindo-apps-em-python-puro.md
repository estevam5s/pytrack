# Construindo apps em Python puro

Streamlit transforma scripts em apps web interativos.

> **Tema:** Apps · **Nível:** basico · **Trilha:** Streamlit e Apps de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **Widgets (slider, selectbox, file_uploader)**
- **Reatividade automática**
- **Cache com @st.cache_data**
- **Deploy simples**

## Exemplo prático

```python
import streamlit as st
import pandas as pd

arquivo = st.file_uploader('CSV')
if arquivo:
    df = pd.read_csv(arquivo)
    st.dataframe(df)
    st.bar_chart(df.select_dtypes('number'))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use cache para dados pesados
- Mantenha o app responsivo

## Pratique

Para fixar, escreva um pequeno script que combine **widgets (slider, selectbox, file_uploader)** e **reatividade automática** em um caso do seu dia a dia. Depois refatore aplicando "Use cache para dados pesados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Widgets (slider, selectbox, file_uploader)
- [ ] Explicar e aplicar: Reatividade automática
- [ ] Explicar e aplicar: Cache com @st.cache_data
- [ ] Explicar e aplicar: Deploy simples

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/)
