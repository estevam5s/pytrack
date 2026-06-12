# Paralelismo: threads, processos e async

Escapar do GIL quando faz sentido e escolher o modelo de concorrência certo.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Profiling e Otimização de Python

## Conceitos-chave

Nesta lição você vai entender:

- **GIL serializa bytecode — threads não aceleram CPU**
- **multiprocessing para trabalho CPU-bound**
- **asyncio para I/O-bound concorrente**
- **concurrent.futures unifica a API**

## Exemplo prático

```python
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as ex:
    resultados = list(ex.map(tarefa_pesada, itens))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- CPU-bound → processos; I/O-bound → async/threads
- Meça: paralelizar tem custo de coordenação

## Pratique

Para fixar, escreva um pequeno script que combine **gil serializa bytecode — threads não aceleram cpu** e **multiprocessing para trabalho cpu-bound** em um caso do seu dia a dia. Depois refatore aplicando "CPU-bound → processos; I/O-bound → async/threads".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: GIL serializa bytecode — threads não aceleram CPU
- [ ] Explicar e aplicar: multiprocessing para trabalho CPU-bound
- [ ] Explicar e aplicar: asyncio para I/O-bound concorrente
- [ ] Explicar e aplicar: concurrent.futures unifica a API

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/concurrent.futures.html)
