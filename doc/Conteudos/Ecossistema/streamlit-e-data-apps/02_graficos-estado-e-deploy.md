# Gráficos, estado e deploy

Sessão, formulários e publicação na nuvem.

> **Tema:** Visualização · **Nível:** intermediario · **Trilha:** Streamlit e Data Apps

## Conceitos-chave

Nesta lição você vai entender:

- **st.session_state para manter estado**
- **st.form para agrupar inputs**
- **Integração com Plotly/Altair**
- **Deploy no Streamlit Community Cloud**

## Exemplo prático

```python
import streamlit as st

if 'cont' not in st.session_state:
    st.session_state.cont = 0
if st.button('Somar'):
    st.session_state.cont += 1
st.metric('Total', st.session_state.cont)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Evite recomputar com cache e session_state
- Valide inputs antes de processar

## Pratique

Para fixar, escreva um pequeno script que combine **st.session_state para manter estado** e **st.form para agrupar inputs** em um caso do seu dia a dia. Depois refatore aplicando "Evite recomputar com cache e session_state".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: st.session_state para manter estado
- [ ] Explicar e aplicar: st.form para agrupar inputs
- [ ] Explicar e aplicar: Integração com Plotly/Altair
- [ ] Explicar e aplicar: Deploy no Streamlit Community Cloud

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/library/api-reference)
