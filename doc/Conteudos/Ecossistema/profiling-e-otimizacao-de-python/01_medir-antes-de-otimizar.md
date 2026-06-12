# Medir antes de otimizar

Otimização sem medição é chute. Profile primeiro, depois aja no gargalo real.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Profiling e Otimização de Python

## Conceitos-chave

Nesta lição você vai entender:

- **cProfile mostra onde o tempo é gasto**
- **timeit mede trechos pequenos com precisão**
- **py-spy faz profiling de produção sem parar o app**
- **A regra: 90% do tempo está em 10% do código**

## Exemplo prático

```python
import cProfile

cProfile.run('processar(dados)', sort='cumulative')
# ou: python -m cProfile -s cumulative script.py
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca otimize sem um profile na mão
- Otimize o gargalo medido, não o que você 'acha'

## Pratique

Para fixar, escreva um pequeno script que combine **cprofile mostra onde o tempo é gasto** e **timeit mede trechos pequenos com precisão** em um caso do seu dia a dia. Depois refatore aplicando "Nunca otimize sem um profile na mão".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: cProfile mostra onde o tempo é gasto
- [ ] Explicar e aplicar: timeit mede trechos pequenos com precisão
- [ ] Explicar e aplicar: py-spy faz profiling de produção sem parar o app
- [ ] Explicar e aplicar: A regra: 90% do tempo está em 10% do código

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/profile.html)
