# Acelerando com Cython

Cython compila Python anotado para C, ganhando ordens de magnitude em loops numéricos.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Cython, Extensões C e CPython

## Conceitos-chave

Nesta lição você vai entender:

- **Tipos estáticos (cdef) removem overhead**
- **Compilação para módulo de extensão**
- **Libera o GIL em seções numéricas**
- **Ótimo para hot loops já identificados no profile**

## Exemplo prático

```python
# arquivo.pyx
cdef double soma_quadrados(int n):
    cdef double s = 0
    cdef int i
    for i in range(n):
        s += i * i
    return s
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cythonize só o gargalo, não o programa todo
- Meça o ganho real antes de manter a complexidade

## Pratique

Para fixar, escreva um pequeno script que combine **tipos estáticos (cdef) removem overhead** e **compilação para módulo de extensão** em um caso do seu dia a dia. Depois refatore aplicando "Cythonize só o gargalo, não o programa todo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Tipos estáticos (cdef) removem overhead
- [ ] Explicar e aplicar: Compilação para módulo de extensão
- [ ] Explicar e aplicar: Libera o GIL em seções numéricas
- [ ] Explicar e aplicar: Ótimo para hot loops já identificados no profile

## Saiba mais

- [Documentação oficial](https://cython.org/)
