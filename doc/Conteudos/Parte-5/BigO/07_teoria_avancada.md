# Rigor Matemático, Limites Inferiores, P, NP e Aproximação

A teoria de complexidade explica não apenas quanto custa um algoritmo, mas também quando um problema tem limites fundamentais. Essa base ajuda a reconhecer problemas que não devem ser atacados por força bruta ou expectativa de solução perfeita rápida.

---

## Prova Direta de Big O

Para provar:

```text
7n + 20 = O(n)
```

Queremos encontrar `c` e `n0` tais que:

```text
7n + 20 <= c n, para n >= n0
```

Se `n >= 20`, então `20 <= n`.

Logo:

```text
7n + 20 <= 7n + n = 8n
```

Escolha `c = 8` e `n0 = 20`.

---

## Polinômios

Para:

```text
3n² + 5n + 100 = O(n²)
```

Se `n >= 10`:

```text
5n <= 5n²
100 <= n²
```

Então:

```text
3n² + 5n + 100 <= 3n² + 5n² + n² = 9n²
```

Logo é `O(n²)`.

O termo de maior grau domina.

---

## Provar que Não é Big O

`n²` não é `O(n)`.

Se fosse, existiriam `c` e `n0`:

```text
n² <= c n
```

Dividindo por `n > 0`:

```text
n <= c
```

Mas `n` cresce sem limite. Contradição.

---

## Usando Limites

Analise:

```text
lim n->infinito f(n) / g(n)
```

Se o limite é:

- `0`: `f = o(g)`;
- constante positiva: `f = Θ(g)`;
- infinito: `f` cresce mais rápido que `g`.

Exemplo:

```text
(3n² + n) / n² -> 3
```

Logo:

```text
3n² + n = Θ(n²)
```

---

## Limites Inferiores

Limite inferior mostra que nenhum algoritmo pode fazer melhor sob certas condições.

### Ordenação por Comparação

Qualquer algoritmo de ordenação baseado apenas em comparações precisa de:

```text
Ω(n log n)
```

no pior caso.

Por isso merge sort, heap sort e timsort são assintoticamente ótimos nesse modelo.

### Busca em Lista Não Ordenada

Para garantir que um elemento não existe, é preciso olhar todos:

```text
Ω(n)
```

Sem estrutura auxiliar ou ordenação, não há atalho geral.

---

## Explosão Combinatória

Alguns problemas têm espaço de busca enorme:

- subconjuntos: `2^n`;
- permutações: `n!`;
- combinações: depende de `n` e `k`;
- caminhos em grafos podem explodir.

Quando a saída tem tamanho `2^n`, nenhum algoritmo que lista tudo pode ser menor que `Ω(2^n)`.

---

## Classe P

P contém problemas decidíveis em tempo polinomial:

```text
O(n), O(n log n), O(n²), O(n³), ...
```

Exemplos:

- busca em grafo;
- menor caminho com pesos não negativos;
- ordenação;
- matching bipartido.

Polinomial não significa sempre rápido. `O(n^10)` é polinomial, mas geralmente impraticável.

---

## Classe NP

NP contém problemas cujas soluções podem ser verificadas em tempo polinomial.

Exemplo: dado um conjunto de cidades e uma rota, verificar se a rota do caixeiro viajante tem custo abaixo de `K` pode ser feito rapidamente.

Encontrar a rota ótima é outra história.

---

## NP-Completo

Problemas NP-completos são os mais difíceis dentro de NP, no sentido de redução polinomial.

Se alguém encontrar solução polinomial para um problema NP-completo, então:

```text
P = NP
```

Exemplos clássicos:

- SAT;
- 3-SAT;
- Vertex Cover;
- Subset Sum;
- versão decisória do Caixeiro Viajante.

---

## NP-Difícil

NP-difícil inclui problemas pelo menos tão difíceis quanto os NP-completos, mas que não precisam estar em NP.

Problemas de otimização podem ser NP-difíceis.

Exemplo:

```text
Encontrar a melhor rota do caixeiro viajante
```

---

## Pseudo-Polinomial

Mochila 0/1 com DP:

```text
O(n * capacidade)
```

Parece polinomial, mas `capacidade` é um valor numérico. Se a capacidade é grande, o algoritmo fica impraticável.

É pseudo-polinomial porque depende do valor, não apenas do tamanho da representação da entrada.

---

## Aproximação

Quando ótimo é caro demais, aproximação pode ser aceitável.

Use quando:

- solução ótima é NP-difícil;
- solução boa basta;
- tempo é restrito;
- dados mudam continuamente;
- decisão é operacional.

Exemplos:

- roteamento;
- alocação;
- clustering;
- escalonamento;
- recomendação.

---

## Heurísticas

Heurística é uma estratégia prática sem garantia forte de otimalidade.

Exemplos:

- guloso;
- busca local;
- simulated annealing;
- algoritmos genéticos;
- beam search;
- randomização.

Heurísticas devem ser medidas:

- qualidade da solução;
- tempo;
- estabilidade;
- sensibilidade a dados;
- casos ruins.

---

## Checklist

- Você sabe provar Big O simples?
- Entende diferença entre limite superior e limite inferior?
- Reconhece quando listar toda saída já impõe custo mínimo?
- Sabe o que é P?
- Sabe o que é NP?
- Sabe diferenciar NP-completo e NP-difícil?
- Identifica pseudo-polinomial?
- Considera aproximação quando ótimo é caro demais?

Teoria avançada evita expectativas irreais. Às vezes o melhor trabalho de engenharia é reconhecer que o problema não comporta solução exata rápida no pior caso.

