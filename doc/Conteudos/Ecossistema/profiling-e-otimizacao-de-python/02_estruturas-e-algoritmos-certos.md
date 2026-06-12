# Estruturas e algoritmos certos

A maior otimização quase sempre é trocar a estrutura de dados ou o algoritmo.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Profiling e Otimização de Python

## Conceitos-chave

Nesta lição você vai entender:

- **set/dict para busca O(1) vs list O(n)**
- **collections (deque, Counter, defaultdict)**
- **Geradores poupam memória em grandes volumes**
- **Big-O domina constantes em escala**

## Exemplo prático

```python
# Lento: O(n) por busca
if x in lista: ...
# Rápido: O(1)
vistos = set(lista)
if x in vistos: ...
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Escolha a estrutura pelo padrão de acesso
- Meça memória além de tempo

## Pratique

Para fixar, escreva um pequeno script que combine **set/dict para busca o(1) vs list o(n)** e **collections (deque, counter, defaultdict)** em um caso do seu dia a dia. Depois refatore aplicando "Escolha a estrutura pelo padrão de acesso".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: set/dict para busca O(1) vs list O(n)
- [ ] Explicar e aplicar: collections (deque, Counter, defaultdict)
- [ ] Explicar e aplicar: Geradores poupam memória em grandes volumes
- [ ] Explicar e aplicar: Big-O domina constantes em escala

## Saiba mais

- [Documentação oficial](https://wiki.python.org/moin/TimeComplexity)
