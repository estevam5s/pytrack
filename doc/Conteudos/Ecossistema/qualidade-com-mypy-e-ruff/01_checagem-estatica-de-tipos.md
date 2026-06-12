# Checagem estática de tipos

mypy encontra erros de tipo antes da execução.

> **Tema:** Qualidade · **Nível:** intermediario · **Trilha:** Qualidade com mypy e Ruff

## Conceitos-chave

Nesta lição você vai entender:

- **Type hints graduais (gradual typing)**
- **mypy --strict para rigor máximo**
- **Protocolos e generics tipados**
- **Stubs para libs sem tipos**

## Exemplo prático

```python
def media(notas: list[float]) -> float:
    return sum(notas) / len(notas)

# mypy aponta: media(['a'])  -> erro de tipo
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Ative o modo strict em código novo
- Trate avisos do mypy como erros no CI

## Pratique

Para fixar, escreva um pequeno script que combine **type hints graduais (gradual typing)** e **mypy --strict para rigor máximo** em um caso do seu dia a dia. Depois refatore aplicando "Ative o modo strict em código novo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Type hints graduais (gradual typing)
- [ ] Explicar e aplicar: mypy --strict para rigor máximo
- [ ] Explicar e aplicar: Protocolos e generics tipados
- [ ] Explicar e aplicar: Stubs para libs sem tipos

## Saiba mais

- [Documentação oficial](https://mypy.readthedocs.io/)
