# Álgebra linear e estatística

Operações matriciais e numéricas.

> **Tema:** Científico · **Nível:** intermediario · **Trilha:** NumPy e Computação Científica

## Conceitos-chave

Nesta lição você vai entender:

- **dot, matmul e álgebra linear (linalg)**
- **Estatísticas (mean, std, percentile)**
- **Geração de números aleatórios**
- **Integração com SciPy**

## Exemplo prático

```python
M = np.array([[1,2],[3,4]])
print(np.linalg.inv(M))
print(np.random.default_rng(42).normal(size=3))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use o gerador moderno default_rng
- Fixe seeds para reprodutibilidade

## Pratique

Para fixar, escreva um pequeno script que combine **dot, matmul e álgebra linear (linalg)** e **estatísticas (mean, std, percentile)** em um caso do seu dia a dia. Depois refatore aplicando "Use o gerador moderno default_rng".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: dot, matmul e álgebra linear (linalg)
- [ ] Explicar e aplicar: Estatísticas (mean, std, percentile)
- [ ] Explicar e aplicar: Geração de números aleatórios
- [ ] Explicar e aplicar: Integração com SciPy

## Saiba mais

- [Documentação oficial](https://numpy.org/doc/stable/reference/routines.linalg.html)
