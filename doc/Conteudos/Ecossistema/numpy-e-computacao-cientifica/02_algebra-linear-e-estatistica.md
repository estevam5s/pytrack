# Álgebra linear e estatística

Operações matriciais e numéricas.

## Pontos-chave

- dot, matmul e álgebra linear (linalg)
- Estatísticas (mean, std, percentile)
- Geração de números aleatórios
- Integração com SciPy

## Exemplo

```python
M = np.array([[1,2],[3,4]])
print(np.linalg.inv(M))
print(np.random.default_rng(42).normal(size=3))
```

## Boas práticas

- Use o gerador moderno default_rng
- Fixe seeds para reprodutibilidade

## Saiba mais

- [Documentação oficial](https://numpy.org/doc/stable/reference/routines.linalg.html)
