# Gráficos, estado e deploy

Sessão, formulários e publicação na nuvem.

## Pontos-chave

- st.session_state para manter estado
- st.form para agrupar inputs
- Integração com Plotly/Altair
- Deploy no Streamlit Community Cloud

## Exemplo

```python
import streamlit as st

if 'cont' not in st.session_state:
    st.session_state.cont = 0
if st.button('Somar'):
    st.session_state.cont += 1
st.metric('Total', st.session_state.cont)
```

## Boas práticas

- Evite recomputar com cache e session_state
- Valide inputs antes de processar

## Saiba mais

- [Documentação oficial](https://docs.streamlit.io/library/api-reference)
