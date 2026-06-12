# Drift e monitoramento em produção

Modelos degradam quando o mundo muda. Monitorar é parte do MLOps.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** Monitoramento e Pipelines de ML

## Conceitos-chave

Nesta lição você vai entender:

- **Data drift: a distribuição de entrada mudou**
- **Concept drift: a relação X→y mudou**
- **Monitore métricas de negócio, não só técnicas**
- **Alertas quando a performance cai**

## Exemplo prático

```python
# compara distribuição atual vs treino
from scipy.stats import ks_2samp
stat, p = ks_2samp(treino_col, producao_col)
if p < 0.05:
    alertar('possível data drift')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Monitore entrada, saída e métricas de negócio
- Reentreine com gatilho, não por calendário cego

## Pratique

Para fixar, escreva um pequeno script que combine **data drift: a distribuição de entrada mudou** e **concept drift: a relação x→y mudou** em um caso do seu dia a dia. Depois refatore aplicando "Monitore entrada, saída e métricas de negócio".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Data drift: a distribuição de entrada mudou
- [ ] Explicar e aplicar: Concept drift: a relação X→y mudou
- [ ] Explicar e aplicar: Monitore métricas de negócio, não só técnicas
- [ ] Explicar e aplicar: Alertas quando a performance cai

## Saiba mais

- [Documentação oficial](https://evidentlyai.com/)
